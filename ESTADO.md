# Photoon — estado do projeto e continuação

> **Revisado em 28/08/2026, após auditoria contra o código.** Vários itens da
> seção 7 já foram feitos por outra sessão. O quadro abaixo vale mais que o
> texto antigo das subseções:
>
> | Item | Situação |
> |---|---|
> | 7.1 inspetor | **feito** (mais o `<img>`: Girar e Espelhar aparecem) |
> | 7.2 arrastar / redimensionar | **feito** |
> | 7.3 roda do mouse dá zoom | **feito** (`onWheel` no palco) |
> | 7.4 filtros de foto | **feito**, com largura/altura no banco |
> | 7.5 espaçamento entre fotos em mm | **feito** — painel na barra de layouts, escopo álbum/lâmina |
> | 7.6 fundos e elementos | **feito** (`src/lib/elementos.ts`) |
> | 7.7 rostos | **feito e verificado**: 22 rostos → 13 pessoas em 24 fotos, bolinhas no editor |
> | 7.12 cabeçalho do lojista | **feito** — nome e e-mail reais; "Sair" funciona |
> | 7.9 galeria de fotos (U04) | FALTA |
> | 7.10 IA | FALTA |
> | 7.11 impressão / PDF | FALTA |
> | 7.12 cabeçalhos de admin e planos | FALTA (só o do lojista foi unificado) |
>
> **Rostos — como reprocessar.** A detecção roda no navegador do lojista, no
> envio. Para as fotos já enviadas há o botão **"Detectar rostos nas fotos
> antigas"** em `/clientes` → Gerenciar. Se der zero rostos, confira que
> `https://app.photoon.com.br/modelos-rosto/tiny_face_detector_model.bin`
> responde **200**: o middleware reescreve `app.*` → `/app/*` e já escondeu os
> modelos uma vez.
>
> **Pendência conhecida dos rostos:** o limiar de 0,35 traz falso positivo
> (numa galeria de teste, uma bolinha era cabelo). Falta o lojista poder
> **excluir e juntar** pessoas — é a mitigação que o próprio Google Fotos usa.
>
> **Modelos de rosto:** ficam em `public/modelos-rosto/`, copiados do pacote npm
> por `tools/copiar-modelos.mjs` na build — não estão no Git. Se derem **404**,
> o contêiner foi construído antes de eles existirem: `docker compose up -d
> --build app` resolve. Sem isso a detecção falha **em silêncio**.

Documento de passagem. Escrito em **28/08/2026**; Fase 3 concluída.
Leia inteiro antes de tocar em qualquer arquivo: há **seis** armadilhas neste
projeto que já custaram retrabalho e estão descritas em "Armadilhas" — a 3.4
(dimensionamento da foto) foi a mais cara até agora.

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

**Conferir o editor SEM a senha de teste:** `npm run dev` e abrir
`http://localhost:3000/dev-preview/editor` — monta o `<EditorCliente>` com fotos
de mentira (SVG assimétrico) e um documento v2 com quadros girados/espelhados.
A página vive em `src/app/dev-preview/editor/` e devolve 404 em build de
produção. Fotografar com Puppeteer (`/usr/bin/chromium-browser` +
`puppeteer-core`, ambos já instalados), sem `isMobile`, viewport 1440.

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

### 3.4. `object-position` não serve para manipulação direta
Com `object-fit:cover` a imagem só transborda em **um** eixo; no outro ela
preenche a caixa exatamente e `object-position` **não tem curso nenhum**.
Arrastar a foto nesse eixo não movia um pixel — mas gravava, entrava no
desfazer e disparava a gravação. `transform:scale()` não resolve: amplia o
recorte já feito.

O modelo correto (em `src/lib/imagem.ts`) dimensiona o `<img>` em % calculadas
a partir da proporção da FOTO e da CAIXA (`medidasPorcento`), preservando a
proporção por construção. É a mesma conta que `caixaFonte()` vai precisar na
Fase 4. `PAGINA_AR` (em `livro.ts`) é o que dá a proporção da caixa.

Duas ciladas dentro dessa cilada:
- **`min-width:100%` + `min-height:100%` ESTICA a foto.** O algoritmo de
  mínimos do CSS satisfaz as duas restrições deformando o elemento
  substituído: uma foto 800×600 virava 121×250. Por isso as duas medidas são
  calculadas, nunca `auto`.
- **O preflight do Tailwind aplica `img { max-width:100%; height:auto }`**, que
  truncava a largura calculada de volta ao tamanho do quadro. Todo `<img>` de
  foto precisa de `max-width:none;max-height:none` inline.

Ao conferir isto, **meça o retângulo renderizado** (`offsetWidth` × `scale`),
não a string de estilo: a string pode estar certa e o navegador ignorá-la.

### 3.5. Não use `pkill -f next`
Mata o processo do contêiner Docker de **produção** (o Docker o reergue, mas o
site cai por alguns segundos). Mate por PID, e só o servidor de dev que você
mesmo subiu — confira com `ps -eo pid,cmd | grep next`.

Depois de `npm run build`, o `.next` do servidor de dev fica inconsistente:
mate o dev, apague o `.next` e suba de novo.

### 3.6. Outras
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
| `src/lib/livro.ts` | curvatura, luz, zoom e `PAGINA_AR` |
| `src/lib/imagem.ts` | `filtroCss`, `imagemCss`, `medidasPorcento` |
| `src/lib/manipulacao.ts` | contas puras dos gestos + faixas de rot/escala |
| `src/lib/elementos.ts` | catálogo de 56 elementos, por categoria |
| `src/lib/cor.ts` | hex ↔ HSV do seletor de fundo |
| `src/lib/preco.ts` | preço (verificado rodando a função compilada) |
| `src/app/actions.ts` | `salvarLaminas` (valida com zod antes de gravar) |
| `src/middleware.ts` | roteamento multi-inquilino. **Tem que ficar em `src/`** |

### Modelo do documento (v2)
```ts
Lamina  = { id, fundo, esquerda: Pagina, direita: Pagina, reserva: string[] }
Pagina  = { layoutId: string, quadros: Quadro[] }
Quadro  = QuadroFoto | QuadroTexto | QuadroElemento
QuadroFoto  = { id, tipo:'foto', fotoId, enq: Enq, ajustes: Ajustes }
QuadroElemento = { id, tipo:'elemento', forma, cor, rot, ret }
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

## 6. Inspetor — CONCLUÍDO

O estado meio-quebrado descrito antes foi resolvido: o `.dc.html` e o hook estão
em sincronia, `./tools/gerar.sh editor` roda limpo e a compilação passa.

**Funciona e foi verificado no navegador:**
- os três sliders (Brilho, Contraste, Saturação) — arrasto real, via um
  `input[type=range]` invisível sobre a trilha do design;
- Preencher / Encaixar / Girar / Espelhar;
- os campos numéricos de Zoom e Rotação;
- o botão Preto e branco (antes animava sem que `s.bw` fosse lido por ninguém);
- `src/lib/imagem.ts`: `filtroCss()` e `imagemCss()`, as fórmulas isoladas para
  valerem igual na impressão.

**O aviso "Rosto perto do corte" está ESCONDIDO de propósito** (`blocoRosto:
'display:none'`). Era um retângulo fixo em 16%/20%/36%/40% que mentia em toda
foto. Volta a aparecer quando a Fase 5 (rostos) existir — os bindings
`textoRosto`, `corrigirRosto` e `manterRosto` já estão no lugar, vazios.

**Resolvido nesta passagem** (verificado no navegador via `/dev-preview/editor`:
rot 90° deita a foto, rot 180° vira de cabeça para baixo, `espelho` inverte o
texto; painel do inspetor abre com 306px e mostra "Enquadramento"):
1. **Girar aparece no render.** O quadro deixou de ser `background-image` num
   `<div>`: agora é uma caixa com `overflow:hidden` e um `<img>` dentro
   (`imagemCss()`). `rot` entra como `transform:rotate()`, `espelho` como
   `scaleX(-1)`, o modo como `object-fit`, `dx/dy` como `object-position` e
   `escala` como `transform:scale()`. É a mesma modelagem que o `sharp` vai usar
   na impressão. Vale para os quadros da página, o primeiro quadro (com a
   marcação de rosto) e as duas faces da virada.
   *Atualizado:* o `object-fit` saiu — ver armadilha 3.4. As medidas do `<img>`
   são calculadas de `medidasPorcento()`, o giro de 90°/270° já cobre o quadro
   corretamente, e a proporção da foto é preservada por construção.
2. **`insp: true` expande o painel sozinho** — não há segundo estado de largura.
   `inspectorStyle` é o único controle: `s.insp` → `width:clamp(238px,23vw,306px)`,
   senão `display:none`. O corpo (com "Enquadramento") depende ainda de haver
   seleção viva (`selTipo`), que é o que um teste precisa disparar clicando num
   quadro da lâmina antes de procurar o texto.

## 7. O QUE FALTA — lista do usuário, em ordem de prioridade

Ele listou isto em 28/08. Os dois primeiros itens já foram corrigidos e estão
na seção 5.

### 7.1. Inspetor funcional (Fase 3) — CONCLUÍDO (ver seção 6)
Todos os controles do painel direito têm manipulador: Preencher / Encaixar /
Girar / Espelhar, os campos de Zoom e Rotação, os três sliders e o P&B. O
quadro virou `<img>` dentro de `overflow:hidden` (`imagemCss()`), então Girar e
Espelhar aparecem no render.

Ainda falta para a **impressão** (Fase 4, ver 7.11), não para o editor:
- `src/lib/enquadramento.ts` — `caixaFonte(foto, quadro, enq)` devolve o
  retângulo em pixels da foto original. Compartilhada com a impressão; é o que
  resolve o recobrimento exato ao girar 90°/270°.
- `src/lib/imagem.ts` — `aplicarSharp(img, ajustes)` a partir da **mesma**
  fórmula de `filtroCss()`.

### 7.2. Arrastar para mover e redimensionar — FEITO para foto
No palco, com um quadro de foto selecionado:
- **arrastar o meio** desloca o recorte, acompanhando o cursor (verificado:
  40px de cursor = 40px de foto, nos dois eixos);
- **arrastar um canto** amplia/reduz (razão da distância ao centro);
- **arrastar o botão redondo** (base do quadro) gira; **Shift** trava de 15 em
  15 graus;
- a foto **nunca** sai de cima do quadro no modo Preencher: o deslocamento
  trava na sobra disponível.

As alças ficam DENTRO do quadro (`inset` positivo). Em `-8px` eram recortadas
pelo `overflow:hidden` da página nos quadros da linha de cima e invadiam o
quadro vizinho.

**Falta:** texto e elemento ainda não são arrastáveis (precisam do mesmo gesto
escrevendo em `ret`, não em `enq`). `doc.mudarRet()` já existe para isso.

### 7.3. Roda do mouse dá zoom — FEITO
A roda amplia a FOTO quando o cursor está sobre ela (ou com Ctrl/⌘); fora dela,
aproxima a visualização. Uma sequência de rodadas é **um** passo de desfazer.
Teclado já funciona (setas viram página, `+`/`-` zoom, `Esc` desmarca, `Delete`
esvazia o quadro).

### 7.4. Filtros do painel de fotos — FEITO
"Todas / Não usadas / Verticais / Horizontais" filtram de verdade, e o
contador do cabeçalho mostra `N de M` em vez do "38 de 120" cravado.
**"Favoritas" foi removida**: não existe a coluna no banco, e um filtro que não
filtra é pior que a ausência dele. Volta quando houver onde marcar.
Vertical/horizontal usa `galeria_fotos.largura/altura`, que já existem.

### 7.5. Layouts mostrando as DUAS páginas + espaçamento
O usuário mandou print de concorrente. Dois pedidos:
1. a miniatura do seletor deve mostrar a lâmina inteira (as duas páginas), não
   uma página. Hoje o seletor mostra uma página; o storyboard já mostra as duas;
2. **espaçamento entre fotos em mm**, com opção "álbum todo" ou "apenas nesta
   lâmina". Hoje o respiro é a constante `G = 2.5` em `src/lib/layouts.ts`.
   Vira parâmetro do documento.

Também pediu: na área de sangria (fora da margem de corte) a foto deve
aparecer **clareada**, não sumir — para o cliente ver o que será cortado.

### 7.6. Fundos e Elementos — FEITO (o essencial)

**Fundos.** `lamina.fundo` era gravado e **nunca desenhado** — o cliente
escolhia uma cor e a página continuava branca. Agora:
- o fundo aparece na página, sob os quadros;
- as 9 amostras e as 16 pastilhas aplicam de verdade, e marcam a cor vigente;
- a área de saturação/brilho e a barra de matiz são arrastáveis
  (`src/lib/cor.ts` faz hex ↔ HSV); o campo hex aceita 3 ou 6 dígitos;
- **"Todo o álbum"** aplica em todas as lâminas (`doc.mudarFundoTudo`).

A cor vive no documento; a UI guarda só o MATIZ corrente, porque o hex não o
devolve quando o brilho vai a zero (a barra saltaria para o vermelho sozinha).

**Elementos.** O documento não tinha onde guardá-los: `Quadro` era só
`foto | texto`. Agora existe `QuadroElemento { forma, cor, rot, ret }`, com
schema zod que **recusa forma fora do catálogo**, e `src/lib/elementos.ts` com
**56 formas** em 6 categorias (Molduras, Florais, Fitas, Selos, Formas,
Linhas) — contra as 12 soltas do design. O que grava é o `id` da forma, não o
`d` do SVG: o desenho pode ser corrigido sem reescrever o álbum de ninguém.

Clicar insere na página do lado selecionado, já selecionado. As pastilhas de
cor pintam o próximo e também o elemento selecionado.

**Falta:** arrastar/redimensionar o elemento na lâmina (ver 7.2), e o campo de
busca do painel.

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

1. ~~Terminar a seção 6 (inspetor)~~ — FEITO. Próximo passo real é o de baixo.
2. ~~7.2 e 7.3 (arrastar, roda do mouse)~~ — FEITO para FOTO. Falta o mesmo
   gesto para TEXTO e ELEMENTO (`ret`), que ainda não são arrastáveis.
3. 7.5 (layouts das duas páginas no seletor, espaçamento em mm).
4. **7.7 (rostos)** — o usuário chama de urgente e é o diferencial dele.
   Destrava 7.8 automaticamente.
5. 7.9 (galeria), 7.6 (fundos/elementos).
6. 7.11 (impressão), 7.10 (IA), 7.12 (cabeçalhos).

O que **não** dá para adiar já foi feito: o editor grava. Enquanto não gravava,
qualquer melhoria era pintura sobre um álbum que não existia.
