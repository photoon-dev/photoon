# Photoon — estado e continuação

Documento de passagem. **Revisado em 29/08/2026.**
Leia a seção 3 (Armadilhas) antes de tocar em qualquer arquivo.

---

## 1. O que é e onde roda

SaaS multi-inquilino de álbuns de foto.

| | Endereço | Quem |
|---|---|---|
| Super admin | `admin.photoon.com.br` | dono da plataforma |
| Lojista | `app.photoon.com.br` | estúdio fotográfico |
| Cliente | `<loja>.photoon.com.br` | quem monta o álbum |

- **VPS** `2.25.140.168` (`srv1934934`) — 4 vCPU, 16 GB, 200 GB NVMe.
  Roda só Next.js + Caddy em Docker: `docker compose up -d --build app`.
- **Supabase** `whsrcrqyoblulpqsjxmq` — banco, auth, storage. É externo.
- **GitHub** `photoon-dev/photoon`, branch `master`.
- **TLS on-demand**: subdomínio novo de lojista funciona sem configurar DNS.

Contas de teste: `admin@`, `lojista@`, `usuario@photoon.com.br`.
**A senha circulou em texto puro no chat e precisa ser trocada antes de
produção.** Não está em nenhum arquivo versionado.

---

## 2. Como rodar e verificar

```bash
cd /root/photoon
npm run build && docker compose up -d --build app

./tools/gerar.sh tudo          # regenera as telas do design
./tools/gerar.sh telas         # só as 16 do lojista

export SENHA_TESTE='...'
node tools/tirar-foto.mjs lojista /pedidos nome 1600   # screenshot autenticado
node tools/auditar-pagina.mjs app.photoon.com.br lojista@photoon.com.br /pedidos
node tools/testar-editor.mjs   # 30 controles do editor
node tools/auditar.mjs         # varre as rotas dos 3 perfis
```

Projetos de teste (cliente `usuario@`, loja `demo`):
`6191d544-…` Fotolivro · `d3a58dd0-…` Revista · `52dc9ded-…` Álbum dos pais

---

## 3. Armadilhas

### 3.1. Nunca edite `src/components/design/*.tsx`
São **gerados** por `tools/dc2tsx.py` a partir de `design/extraido/*.dc.html`.
Todo binding novo nasce no `.dc.html`; depois `./tools/gerar.sh`.

### 3.2. Cada tela do zip traz sua PRÓPRIA cópia do menu e do cabeçalho
Com "Lab Cores", "Marta Reis" e "1,44 TB de 2 TB" escritos à mão. Já foram
ligados nas 19 telas. **Se exportar o design de novo, o defeito volta** —
reaplique a substituição de moldura.

### 3.3. Fonte única de verdade
O projeto já teve quatro modelos de layout incompatíveis e três estados
duplicados. Cada um virou bug visível. **O documento (`useDocumento`) manda**;
`useEditorDesign` só guarda estado de interface.

### 3.4. CSS de atributo: o React serializa sem espaço
`[style*="left: 662px"]` não casa — o React gera `left:662px`.

### 3.5. Outras
- `next start` não funciona com `output: standalone`; use o Docker.
- `NEXT_PUBLIC_*` são embutidas no build. Mudou `.env`? Reconstrua.
- O `.env` **não** está no Git. Se recriar a máquina, restaure-o.
- O MCP do Supabase cai com frequência. Alternativa: REST com JWT do usuário
  (veja os comandos `curl` no histórico) ou colar SQL no editor do Supabase.

---

## 4. O que FUNCIONA (verificado no navegador)

### Painel do cliente — completo
| Tela | Estado |
|---|---|
| Entrar, Meus projetos, Detalhe | dado real |
| **Editor** | 28 de 30 controles confirmados |
| Galeria | 24 fotos, 13 bolinhas de pessoas, filtro por rosto, visor |
| Minha conta | foto de perfil, nome, telefone |
| Ajuda | 10 dúvidas, contatos reais da loja |

### Painel do lojista
| Tela | Estado |
|---|---|
| Dashboard | dado real (era todo inventado; corrigido) |
| **Pedidos** | **completa** — KPIs calculados, abas filtrando pela URL, selo de não vistos, tabela real |
| Clientes, Configurações, Templates | dado real |

### Super admin
Plataforma e Planos — dado real.

### Editor (detalhe)
Grava sozinho, layout único, enquadramento, 7 efeitos, texto completo
(fonte/tamanho/peso/cor/alinhamento), 1.310 elementos, 360 fundos vetoriais,
espaçamento em mm, prévia com reprodução, rostos (22 → 13 pessoas em 24 fotos),
desfazer/refazer, arrastar/redimensionar/girar.

---

## 5. O QUE FALTA

### 5.1. As 14 telas com conteúdo ainda do protótipo
Layout do design e moldura real, mas **o conteúdo não tem ação ligada**.
Sinal objetivo: têm **32 controles ativos** (só menu + cabeçalho); Pedidos tem 54.

Produção · Expedição · Loja · Catálogo · Preços · CRM · Vendedores ·
Marketing · Pagamentos · Carteira · Relatórios · Integrações · Auditoria ·
Suporte

**Seis ainda mostram nomes fictícios**: Produção, CRM, Pagamentos, Carteira,
Relatórios, Suporte ("Rita Nunes", "Colégio Farol", "R$ 184.320").

**O trabalho é ligar, não desenhar.** As bibliotecas já existem e as consultas
estão escritas:
- `src/lib/pedidos.ts` — listarPedidos, getPedido, filaDeProducao,
  pedidosForaDaFila, listarEnvios, pedidosSemEnvio, listarPagamentos
- `src/lib/comercial.ts` — listarProdutos, listarModelos, dadosCRM,
  dadosVendedores, dadosVitrine, dadosMarketing
- `src/lib/financeiro.ts` — carteiraDaLoja, relatoriosDaLoja, gatewaysDaLoja,
  auditoriaDaLoja, chamadosDaLoja, resolverPeriodo

**Receita, tela a tela** (siga `src/app/app/pedidos/page.tsx` +
`src/components/app/PedidosDoDesign.tsx`, que é o padrão pronto):
1. abrir `design/extraido/<Tela>.dc.html` e trocar os valores fixos por
   `{{ binding }}`; listas fixas viram `<sc-for>`
2. `./tools/gerar.sh telas`
3. criar o componente `<Tela>DoDesign.tsx` que monta o `v` com o dado real
4. a página usa `molduraDaLoja()` e passa `dados`

Também existem componentes Tailwind escritos pelos agentes
(`PainelProducao.tsx`, `PainelCRM.tsx`, …) — **não são usados**. Servem de
referência da lógica; podem ser apagados quando a tela do design estiver ligada.

### 5.2. Ações de servidor sem tela ligada
`src/app/app/actions-pedidos.ts`, `actions-comercial.ts`, `actions-sistema.ts`
existem e não estão ligados a nada. Avançar estado, cancelar com motivo, mover
etapa de produção, postar envio, criar produto, conectar gateway.

### 5.3. Não existe ainda
| O quê | Por que importa |
|---|---|
| **Checkout do cliente** | é o que falta para o cliente pagar. Não há design no zip |
| **Webhook de pagamento** | é o que de fato confirma o pagamento; nunca confiar no retorno do navegador |
| **Cifragem de credenciais** | `src/lib/cripto.ts` existe, **não verificado**. Chave de dinheiro de terceiro não pode ficar em texto puro |
| **PDF final** | `src/lib/impressao.ts` renderiza página e lâmina em 300 dpi; falta montar o arquivo e a fila |
| **Assistência com IA** | Fase 6, deixada por último a pedido do Fábio |
| **`photoon.com.br` (raiz)** | devolve 404; falta a página institucional |

### 5.4. Pendências menores
- URLs assinadas do storage expiram em 6 h: sessão longa deixa o canvas branco
- O envio da foto de perfil não pôde ser testado no navegador automatizado
  (limitação do Puppeteer); verificado por fora com JWT real → HTTP 200
- Limiar de rosto em 0,35 traz falso positivo; falta o lojista poder **excluir
  e juntar** pessoas
- "Girar" no editor não aparece no render (`background-image` não gira)

---

## 6. Banco

Migrações 0001–0012 aplicadas. A 0012 criou o negócio:
`produtos`, `vendedores`, `pedidos`, `pedido_itens`, `producao`, `expedicao`,
`lojista_gateways`, `pagamentos`, `auditoria`, `chamados` — todas com RLS por
loja, reusando os auxiliares do schema `private`.

Dados reais no banco: **24 pedidos** (todos os estados, incluindo cancelados,
recusados e devolvidos), 24 pagamentos, 6 produtos, 3 vendedores, 3 chamados.

O seed está em `supabase/SEED-PEDIDOS.sql` e pode rodar de novo sem duplicar.

**Decisões do modelo que valem lembrar:**
- o preço é **congelado** no item do pedido: `preco.ts` calcula do template, e
  mudar o template não pode mudar uma compra fechada
- `numero` é sequencial por loja e visível ao cliente ("#1042")
- credencial de gateway guarda o **cifrado**; a chave vive no ambiente

---

## 7. Ordem sugerida

1. **Produção e Expedição** — continuam o fluxo de Pedidos e usam as ações que
   já existem
2. **Catálogo e Preços** — o lojista precisa cadastrar o que vende
3. **Pagamentos, Carteira, Relatórios** — o dinheiro
4. **Checkout + webhook** — fecha a venda ponta a ponta
5. CRM, Vendedores, Marketing, Integrações, Auditoria, Suporte
6. PDF, e por último a IA

Documentos irmãos: `AUDITORIA.md` (levantamento tela a tela),
`PLANO-PAGAMENTOS.md` (gateways), `PLANO-EDITOR-2.md` (concluído).
