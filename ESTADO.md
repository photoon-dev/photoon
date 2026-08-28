# Photoon — estado do projeto e continuação

Documento de passagem. Escrito em **28/08/2026**, no meio da Fase 3.
Leia inteiro antes de tocar em qualquer arquivo: há três armadilhas neste
projeto que já custaram retrabalho e estão descritas em "Armadilhas".

---

## 1. O que é

SaaS multi-inquilino de álbuns de foto. Três níveis de acesso:

| Nível | Endereço | Quem |
|---|---|---|
| Super admin | `admin.photoon.com.br` | dono da plataforma |
| Lojista | `app.photoon.com.br` | estúdio fotográfico |
| Cliente final | `<loja>.photoon.com.br` | quem monta o álbum |

- **VPS** `2.25.140.168` (Hostinger, `srv1934934`) — 4 vCPU, 16 GB, 200 GB NVMe.
  Roda só Next.js + Caddy, em Docker. `docker compose up -d --build app`.
- **Supabase** (projeto `whsrcrqyoblulpqsjxmq`) — banco, auth e storage. É
  externo: a VPS **não** cresce com o volume de fotos, só com renderização.
- **GitHub** `photoon-dev/photoon`, branch `master`.
- **TLS on-demand** no Caddy: subdomínio novo de lojista funciona sem
  configurar DNS (já existe `A *` apontando para o IP). Não é preciso token da
  Hostinger para nada.

### Contas de teste
`admin@photoon.com.br`, `lojista@photoon.com.br`, `usuario@photoon.com.br`.
A senha circulou em texto puro no chat e **precisa ser trocada antes de
produção**. Ela não está em nenhum arquivo do repositório — os seeds usam o
marcador `SENHA_DE_TESTE` com uma trava que recusa rodar se não for
substituído. Nunca escreva segredo em arquivo versionado.

---

## 2. Como rodar e verificar

```bash
cd /root/photoon
npm run build
docker compose up -d --build app
```

**Regenerar as telas do design** (obrigatório depois de mexer em `.dc.html`):

```bash
./tools/gerar.sh            # tudo
./tools/gerar.sh editor     # só o editor
```

**Fotografar uma tela já logado** (é assim que se confere layout — não há
como enxergar o resultado de outro jeito):

```bash
export SENHA_TESTE='...'
node tools/tirar-foto.mjs cliente /editor/<id> nome 1440
# perfis: cliente | lojista | admin
```

Projetos de teste do usuário `usuario@photoon.com.br` na loja `demo`:

- `6191d544-023a-4ee7-88e7-699472448212` — "Fotolivro da formatura", 5 lâminas
- `d3a58dd0-2cc7-41c8-99b9-770a47f23729` — "Revista da turma", 2 lâminas
- `52dc9ded-9aff-49f6-a1a0-36c73c717a8c` — "Álbum dos pais", 1 lâmina

---

## 3. Armadilhas (leia antes de codar)

### 3.1. Nunca edite `src/components/design/*Design.tsx`
São **gerados** por `tools/dc2tsx.py` a partir de `design/extraido/*.dc.html`.
Toda ligação nova nasce no `.dc.html`; depois roda `./tools/gerar.sh`.
Editar o TSX gerado funciona até alguém regenerar, e some.

Os parâmetros de geração (slots e trocas) estão em `tools/telas/*.json`.
Regenerar tudo hoje reproduz o repositório **byte a byte** — se der diferença,
é porque alguém editou o gerado à mão.

### 3.2. Fonte única de verdade
Este projeto já teve **quatro** modelos de layout incompatíveis e **três**
estados duplicados (`s.spread` vs `doc.atual`, `s.sel` vs `doc.selecao`,
`s.lay` vs o layout da página). Cada um produziu um bug visível ao usuário:
o botão de layout mostrava um desenho e a página entregava outro; o rodapé
dizia "Lâmina 1" estando na 2; clicar na foto não abria o inspetor.

**Regra:** o documento (`useDocumento`) manda. `useEditorDesign` só guarda
estado de interface (hover, aba aberta, zoom da visualização). Se você
precisar de um segundo lugar para guardar a mesma informação, pare.

### 3.3. CSS de atributo: o React serializa sem espaço
`[style*="left: 662px"]` **não casa**. O React gera `left:662px`.
Escrevi um bloco inteiro de CSS responsivo que não fazia nada por causa disso.
Confira no pacote construído, não no fonte.

### 3.4. Outras
- `next start` **não funciona** com `output: 'standalone'`; use
  `node .next/standalone/server.js` (ou o Docker, que já faz certo).
- `NEXT_PUBLIC_*` são embutidas **no build**. Mudou `.env`? Reconstrua.
- `pkill -f "next start"` mata o próprio shell (o padrão casa com a linha de
  comando do wrapper). Mate por PID.
- O `.env` **não** está no Git (é segredo). Se recriar a máquina, restaure-o.

---

## 4. Arquitetura do editor

Três camadas, nesta ordem de autoridade:

```
design/extraido/Cliente Editor.dc.html   ← a UI de verdade; bindings nascem aqui
        │  tools/gerar.sh (dc2tsx.py)
        ▼
src/components/design/EditorDesign.tsx   ← GERADO, não edite
        │  recebe `v`
        ▼
src/components/editor/useEditorDesign.tsx ← monta `v`: só estado de INTERFACE
        │  recebe `doc`
        ▼
src/components/editor/useDocumento.ts    ← o DOCUMENTO: lâminas, seleção,
                                            desfazer/refazer, gravação
```

Costura: `src/components/editor/EditorCliente.tsx`.

### Arquivos-chave
| Arquivo | Papel |
|---|---|
| `src/lib/layouts.ts` | catálogo **único** de layouts, em % **por página** |
| `src/lib/album.ts` | documento v2, validação zod, `migrarLamina` |
| `src/lib/livro.ts` | curvatura, luz e zoom do livro |
| `src/lib/preco.ts` | preço (verificado rodando a função compilada) |
| `src/app/actions.ts` | `salvarLaminas` (valida com zod antes de gravar) |
| `src/middleware.ts` | roteamento multi-inquilino. **Tem que ficar em `src/`** |

### Modelo do documento (v2)
```ts
Lamina  = { id, fundo, esquerda: Pagina, direita: Pagina, reserva: string[] }
Pagina  = { layoutId: string, quadros: Quadro[] }
Quadro  = QuadroFoto | QuadroTexto
QuadroFoto  = { id, tipo:'foto', fotoId, enq: Enq, ajustes: Ajustes }
Enq     = { modo:'preencher'|'encaixar', escala, dx, dy, rot, espelho }
Ajustes = { brilho, contraste, saturacao, pb }   // -100..100
```
A **posição** do quadro de foto vem do layout, pelo índice — não é guardada no
quadro. É o que garante que o desenho do botão seja o desenho da página.
Quadro de texto é livre e tem `ret` próprio.

`migrarLamina()` aceita v1, v2 e lixo parcial sem lançar exceção. Álbum de
cliente não pode virar tela branca por um campo faltando.

---

## 5. O que está PRONTO e verificado no navegador

- **O editor grava.** Antes não gravava nada: as fotos vinham de
  `fotos[n % fotos.length]` e a sequência de layouts era uma constante. O
  projeto tinha `laminas = 0` no banco enquanto a tela mostrava 10 lâminas
  cheias. Verificado: trocar layout de 2 para 9 quadros sobrevive ao recarregar.
- **Layout único.** Seletor, miniatura do storyboard e página renderizada usam
  a mesma função de retângulo.
- **Migração v1 → v2** funciona em dado real de produção.
- Clicar numa foto da galeria a coloca no quadro; foto já usada fica com marca
  verde.
- Adicionar lâmina, Desfazer, Refazer (eram botões decorativos, sem `onClick`).
- Virada de página com o conteúdo real nas duas faces, brilho varrendo e sombra
  projetada. A "tela azul" era literal: dois retângulos chapados no design
  (`#7C3AED→#2563EB`) nunca ligados a nada.
- Zoom não vaza mais do palco.
- Curvatura da página chega **na foto** (o design curvava só o papel por baixo).
- Desfazer/refazer com Ctrl+Z / Ctrl+Shift+Z, aviso ao fechar a aba com
  gravação pendente.
- **Migração 0010 aplicada em produção:** `total_paginas` contava LÂMINAS e era
  cobrada como PÁGINAS — todo álbum estava subfaturado. Mais as tabelas
  `rostos` e `pessoas` com RLS herdada da galeria.

Último commit bom: `c4a6828`.

---

## 6. TRABALHO EM ANDAMENTO — estado exato

**⚠ O repositório está com uma alteração pela metade. Resolva isto primeiro.**

`design/extraido/Cliente Editor.dc.html` **já recebeu** as ligações do inspetor
(commit ainda não feito), mas `useEditorDesign.tsx` **ainda não fornece** os
valores correspondentes. Se rodar `./tools/gerar.sh editor` agora, o TSX vai
referenciar campos que não existem e o TypeScript acusa.

Ligações já escritas no `.dc.html` que **faltam** no hook:

| Binding | O que deve fazer |
|---|---|
| `blocoRosto` | estilo do bloco de aviso; `display:none` enquanto não houver análise de rosto (não minta) |
| `textoRosto` | texto do aviso |
| `corrigirRosto` / `manterRosto` | ação de reenquadrar / dispensar |
| `enqPreencher` / `enqEncaixar` / `enqGirar` / `enqEspelhar` | cada um `{ style, pick }`; `pick` chama `doc.mudarEnq(...)`; `style` marca o ativo |
| `zoomFoto` / `setZoomFoto` | valor e `onChange` → `doc.mudarEnq({ escala })` |
| `rotFoto` / `setRotFoto` | valor e `onChange` → `doc.mudarEnq({ rot })` |
| `sliders[].min/.max/.raw/.set` | `set` chama `doc.mudarAjustes({ brilho\|contraste\|saturacao })` |

O objeto `sliders` **já existe** no hook mas com valores literais (+4, 0, −6) e
sem `min`/`max`/`raw`/`set`.

**Para desfazer e recomeçar limpo:** `git checkout design/extraido/`.

---

## 7. O QUE FALTA — lista do usuário, em ordem de prioridade

Ele listou isto em 28/08. Os dois primeiros itens já foram corrigidos e estão
na seção 5.

### 7.1. Inspetor funcional (Fase 3) — EM ANDAMENTO
Hoje o painel direito é pintura. "Preencher/Encaixar/Girar/Espelhar", os
campos de Zoom e Rotação, os três sliders e o P&B não têm nenhum manipulador.
Ver seção 6 para o estado exato.

Depende de duas funções puras a escrever:
- `src/lib/enquadramento.ts` — `caixaFonte(foto, quadro, enq)` devolve o
  retângulo em pixels da foto original. Compartilhada com a impressão.
- `src/lib/imagem.ts` — `filtroCss(ajustes)` e `aplicarSharp(img, ajustes)`
  a partir da **mesma** fórmula.

Trocar `background-image` por `<img>` dentro de `overflow:hidden`: com
`background-size/position` não há como girar nem espelhar sem gambiarra, e a
conta deixa de bater com o `sharp` na impressão.

### 7.2. Arrastar para mover e redimensionar
Não funciona para foto nem para texto. Precisa de manipulador de ponteiro nos
quadros, escrevendo em `enq.dx/dy/escala` (foto) e em `ret` (texto).

### 7.3. Roda do mouse dá zoom
O palco já está marcado com `data-om-palco="1"` no `.dc.html` — use isso para
prender o ouvinte de `wheel`. Teclado já funciona (setas viram página, `+`/`-`
dão zoom, `Esc` desmarca, `Delete` esvazia o quadro).

### 7.4. Filtros do painel de fotos
"Todas / Não usadas / Favoritas / Verticais / Horizontais" são decorativos.
`doc.usadas` já dá o conjunto de fotos usadas. Vertical/horizontal precisa das
dimensões da foto — conferir se `galeria_fotos` guarda largura/altura; se não,
é migração nova.

### 7.5. Layouts mostrando as DUAS páginas + espaçamento
O usuário mandou print de concorrente. Dois pedidos:
1. a miniatura do seletor deve mostrar a lâmina inteira (as duas páginas), não
   uma página. Hoje o seletor mostra uma página; o storyboard já mostra as duas;
2. **espaçamento entre fotos em mm**, com opção "álbum todo" ou "apenas nesta
   lâmina". Hoje o respiro é a constante `G = 2.5` em `src/lib/layouts.ts`.
   Vira parâmetro do documento.

Também pediu: na área de sangria (fora da margem de corte) a foto deve
aparecer **clareada**, não sumir — para o cliente ver o que será cortado.

### 7.6. Fundos e Elementos
Painéis existem, não aplicam nada. Fundo precisa de "aplicar a tudo".
Elementos: ele quer muitos mais que os poucos do design.

### 7.7. Rostos (Fase 5) — ele chama de urgente e de diferencial
Já existem no banco (migração 0010): tabelas `rostos` e `pessoas`.

Decisão tomada: **`@vladmandic/face-api` no navegador do lojista**, no laço de
envio que já existe. Detecção e vetor de 128 dimensões na mesma biblioteca,
~6 MB de modelo cacheado, **custo zero na VPS**. O agrupamento é DBSCAN sobre
os vetores — matemática pura, milissegundos, no servidor.

CompreFace estava descartado por caber em 3,8 GB de RAM. **Com a VPS atual
(16 GB) ele voltou a ser viável** como plano B se a precisão do face-api
incomodar. Mesma estrutura de dados; só o vetor muda.

Destrava três coisas: o aviso "rosto perto do corte" (hoje é um retângulo fixo
em 16%/20%/36%/40% que mente), o botão "Corrigir" (determinístico, sem IA) e a
aba "Pessoas" com as bolinhas estilo Google Fotos.

### 7.8. Corte de rosto
Depende de 7.7. Sem análise, o bloco de aviso deve ficar **escondido**, não
mostrar texto inventado.

### 7.9. Tela de galeria de fotos
**Não existe** — nem construída, nem no design. O `Cliente Galeria de fotos.dc.html`
é referenciado pelo projeto mas não está no zip. A especificação descreve a tela
inteira em `U04` e já previa o filtro "Uma pessoa". Construir a partir da spec.

### 7.10. Assistência com IA (Fase 6)
`@anthropic-ai/sdk` (ainda não está no `package.json`), só no servidor,
`ANTHROPIC_API_KEY` no `docker-compose.yml`. Saída estruturada com
`client.messages.parse()` + `zodOutputFormat`, modelo `claude-opus-5`.

Custo medido: **US$ 0,12 por álbum de 120 fotos** com miniaturas de 384px.
Duas passagens: visão (com imagens) e diagramação (sem imagens, de graça
refazer).

**Quatro travas obrigatórias:**
1. validar no servidor que todo `fotoId` existe na galeria e todo `layoutId`
   no catálogo; descartar o que não passar, **nunca adivinhar**. A saída do
   modelo jamais vai direto para `salvarLaminas`;
2. proposta ≠ aplicação: o modal já existe no design, vira prévia com
   Aplicar/Descartar;
3. por padrão só preenche quadro vazio;
4. um Ctrl+Z desfaz a IA inteira.

### 7.11. Impressão / PDF (Fase 4)
`sharp` (0.35.4, já instalado) usando as **mesmas** funções do inspetor.
Rota de prévia `/api/projetos/[id]/lamina/[n].jpg`. Sangria, área segura e DPI
saem do `template` (`sangria_mm`, `area_segura_mm` já existem na tabela).

*Risco conhecido:* `filter: contrast()` do CSS opera em sRGB não-linear e a
saturação usa matriz Rec.601, enquanto `sharp.modulate()` usa HSL. Divergem em
cores muito saturadas. O aceite é **documentar a tolerância**, não perseguir
igualdade matemática.

Depois disto, a virada de página pode virar Three.js com curvatura de geometria
real (como `quick_flipbook` / `3D-Book-Slider`), usando a imagem gerada aqui.
**Não dá para usar essas bibliotecas como canvas do editor**: nelas a página é
uma textura, e numa textura não existe clicar em quadro, selecionar nem
inspetor.

### 7.12. Cabeçalhos padronizados (Fase 7)
São **cinco** implementações independentes. A do lojista mostra
**"Marta Reis", "marta@labcores.com.br", "Plano Pro · 8 usuários" fixos** — o
lojista vê o nome de outra pessoa — e o botão "Sair" aponta para
`./Login.dc.html`, ou seja, **não sai**. A de Planos não tem botão de sair.

Solução: um `CabecalhoApp` único alimentado por props, reusando
`PainelNotificacoes`, que já funciona.

### 7.13. Pendências menores
- `photoon.com.br` (domínio raiz, sem subdomínio) devolve **404**. Falta a
  página institucional.
- URLs assinadas do storage expiram em 6h: sessão longa de edição deixa o canvas
  em branco. Renovar antes de expirar.
- O selo "4 lâminas sem foto" no rodapé vem de `avisos` no banco e pode estar
  velho em relação à tela.

---

## 8. Ordem sugerida

1. **Terminar a seção 6** (inspetor) — está pela metade e bloqueia o resto.
2. 7.2 e 7.3 (arrastar, roda do mouse) — mesma área do código.
3. 7.4 e 7.5 (filtros, layouts das duas páginas, espaçamento).
4. **7.7 (rostos)** — o usuário chama de urgente e é o diferencial dele.
   Destrava 7.8 automaticamente.
5. 7.9 (galeria), 7.6 (fundos/elementos).
6. 7.11 (impressão), 7.10 (IA), 7.12 (cabeçalhos).

O que **não** dá para adiar já foi feito: o editor grava. Enquanto não gravava,
qualquer melhoria era pintura sobre um álbum que não existia.
