# Photoon — reestruturação do painel e da área do cliente

Fases 1 e 2 do briefing de 31/08/2026. **Nenhum código foi alterado para produzir
este documento.** Irmão de `ESTADO.md` (estado verificado) e `AUDITORIA.md`.

Versão navegável: https://claude.ai/code/artifact/f498b83d-c51e-491b-93b6-6c285e403bbd

---

## 1. Veredito

A base é boa e não deve ser recriada. O trabalho real, em ordem de peso:

1. **Renderização não existe como entidade** — nem job, nem fila, nem arquivo, nem versão.
2. **Não existe App Shell único** — 22 cópias da mesma sidebar, uma por `.dc.html`.
3. **8 módulos precisam ser desmontados** — migrando a funcionalidade *antes* de a rota sair.

| | |
|---|---|
| Telas do lojista | 20 (7 com dado real, 12 protótipo, 1 sem rota) |
| Cópias do menu | 22 arquivos `.dc.html` |
| Tabelas no banco | 26, em 13 migrações, todas com RLS |
| Tabelas a criar | 11 |
| Rotas novas | 13 · rotas removidas 8 (todas com redirect) |

**Antes da Fase 3:** a árvore tem 14 arquivos modificados e 2 não rastreados
(`src/lib/rastreio.ts`, `scratch-verifica.mjs`), de Expedição e Galeria. Fechar em
um commit próprio — senão `git diff` deixa de servir para revisar a reestruturação.

---

## 2. Fase 1 — inventário

### 2.1. Arquitetura

| Camada | O que é | Onde |
|---|---|---|
| Roteamento por host | 3 painéis no mesmo app; middleware reescreve | `src/middleware.ts` |
| Tenant | `<loja>.photoon.com.br` → slug → `lojistas`; `app.`/`admin.` reservados | `src/lib/tenant.ts` |
| Autorização | RLS no Postgres, auxiliares em `private.*` | `migrations/0004` |
| Telas | `.dc.html` → `dc2tsx.py` → `*Design.tsx` (gerado) → `*DoDesign.tsx` (liga o dado) | `tools/gerar.sh` |
| Render de impressão | página e lâmina em 300 dpi com `sharp`; **síncrono, sem fila** | `src/lib/impressao.ts` |

`src/components/design/*.tsx` é **gerado**. Mudança visual nasce no `.dc.html`.

### 2.2. Rotas do lojista (`app.photoon.com.br`)

Índice do menu em `src/lib/rotas-lojista.ts`, casado por número com `pick<n>` do design.

| # | Menu | Rota | Estado hoje | Destino |
|---|---|---|---|---|
| 0 | Dashboard | `/` | dado real | editar |
| 1 | Pedidos | `/pedidos`, `/pedidos/[id]` | completa | editar |
| 2 | Produção | `/producao` | completa | editar |
| 3 | Expedição | `/expedicao` | completa | editar |
| 4 | Loja | `/loja` | protótipo | mantém |
| 5 | Catálogo | `/catalogo` | protótipo | editar |
| 6 | Preços | `/precos` | protótipo | editar |
| 7 | Temas e templates | `/templates` | dado real | vira Templates e Design (5 abas) |
| 8 | Clientes | `/clientes` | dado real | editar |
| 9 | CRM | `/crm` | protótipo, nomes fictícios | **sai** → ficha do cliente |
| 10 | Vendedores | `/vendedores` | protótipo | **sai** → Config. > Equipe |
| 11 | Marketing | `/marketing` | protótipo | **sai** → Cupons + Comunicação |
| 12 | Pagamentos | `/pagamentos` | protótipo, nomes fictícios | vira `/financeiro` |
| 13 | Carteira e faturas | `/carteira` | protótipo, nomes fictícios | **sai** → Financeiro > Carteira |
| 14 | Relatórios | `/relatorios` | protótipo, nomes fictícios | editar |
| 15 | Automações | — | **link morto hoje** | **sai** |
| 16 | Integrações | `/integracoes` | protótipo | editar |
| 17 | Auditoria | `/auditoria` | protótipo | **sai** → Config. > Segurança |
| 18 | Suporte | `/suporte` | protótipo, nomes fictícios | **sai** → botão Ajuda na Topbar |
| 19 | Configurações | `/configuracoes` | dado real | vira central de 14 abas |

### 2.3. Rotas do cliente (`<loja>.photoon.com.br`)

`/entrar` · `/meus-projetos` · `/projetos/[id]` (**ainda com a casca antiga `AppHeader`**) ·
`/editor/[id]` · `/galeria` · `/minha-conta` · `/ajuda`.
Nascem: `/conta/pedidos` e `/conta/pedidos/[id]`.

Super admin (`admin.`): `/admin`, `/admin/planos` — fora do escopo.
Serviço: `/auth/callback`, `/auth/sair`, `/api/tls-check`, `/dev-preview/editor`.

### 2.4. Componentes

| Família | Onde | Qtd | Regra |
|---|---|---|---|
| Telas geradas | `src/components/design/` | 25 | nunca editar à mão |
| Ligações | `src/components/app/*DoDesign.tsx` | 6 | montam `v` com dado real |
| Painéis Tailwind | `src/components/app/Painel*.tsx` | 18 | só 3 em uso (Clientes, Configurações, Templates); 15 são código morto |

**Achado principal.** Não existe App Shell único: os 22 `.dc.html` carregam cada um sua
cópia da sidebar e da topbar com os 20 itens escritos à mão. `TelaDoDesign` +
`useDashboardDesign` injetam os mesmos bindings em todas, mas a *marcação* segue
duplicada. Mudar o menu hoje = editar 22 arquivos e regenerar 25 componentes.

Convivem dois caminhos de casca: `ShellLojista` (3 telas Tailwind) e `TelaDoDesign`
(12 telas de protótipo). Ao fim da Fase 4 deve restar só o primeiro.

### 2.5. Banco — 26 tabelas

| Domínio | Tabelas | Situação |
|---|---|---|
| Tenant e acesso | `lojistas` `lojista_membros` `super_admins` `planos` `uso_lojista` | serve; falta `filiais` |
| Cliente | `clientes` `cliente_documentos` `notificacoes` | serve; faltam grupo, tabela de preço, observações |
| Fotos | `galerias` `galeria_fotos` `pessoas` `rostos` | serve |
| Projeto | `projetos` `projeto_fotos` `projeto_eventos` | sem código amigável, sem arquivos, sem versões |
| Pedido | `pedidos` `pedido_itens` | serve; `numero` já é sequencial por loja |
| Produção | `producao` `expedicao` | 5 etapas (briefing pede 8); expedição sem volume/peso/SLA |
| Dinheiro | `pagamentos` `lojista_gateways` | serve; **não há carteira de crédito** |
| Catálogo | `produtos` `templates` | falta a ficha técnica do briefing |
| Sistema | `auditoria` `chamados` `vendedores` | preservar mesmo quando a página sai |
| Renderização | — | **não existe** |

**Duas descobertas que mudam o plano:**

- **“Carteira” hoje não é carteira.** `carteiraDaLoja()` em `src/lib/financeiro.ts` é um
  *extrato de recebimentos* derivado de `pagamentos`. O briefing pede saldo de crédito por
  cliente, com ajuste auditado. São coisas diferentes: a atual vira a aba **Recebimentos**,
  a nova nasce como aba **Carteira**.
- **Filial não existe** — nem tabela, nem coluna, nem filtro. Citada em 6 telas do
  briefing. Precisa entrar cedo (Fase 4), não tarde.

### 2.6. Storage, APIs, dependências

- **Buckets (3):** `galerias` (privado), `marcas` (público), `avatares` (público).
  **Não há bucket para arquivo renderizado** — o quarto nasce na Fase 6, privado, com URL assinada.
- **Edge Functions: 0.** A fila de renderização precisa de executor fora da requisição HTTP.
- **Rotas de API (3):** `/api/tls-check`, `/auth/callback`, `/auth/sair`. Escrita é toda por
  Server Action. **Não há webhook de pagamento.**
- **Server Actions:** `actions-pedidos.ts` (inteiro ligado), `actions.ts` (ligado),
  `actions-comercial.ts` e `actions-sistema.ts` (escritos, sem tela).
- **Dependências:** next 15.5, react 19.2, @supabase/ssr, sharp, face-api, zod, tailwind 3.4.
  A reestruturação não pede nenhuma nova.

### 2.7. Lacunas frente ao briefing

Alto: renderização como entidade · arquivos do projeto · App Shell único.
Médio: filial · Central de Projetos · código amigável do projeto · carteira de crédito ·
cupons · tabela de preços.
Baixo (já há base): pré-flight (`projetos.avisos` existe) · pedidos na área do cliente
(`contaDoCliente` já traz compras) · importação (convite por e-mail é o gancho) ·
ordem de serviço (a etiqueta de expedição é o molde).

---

## 3. Fase 2 — plano de migração

### 3.1. As seis entidades

```
CLIENTE → PROJETO → PEDIDO → RENDERIZAÇÃO → PRODUÇÃO → EXPEDIÇÃO
clientes  projetos  pedidos     (nasce)      producao   expedicao
                 + pedido_itens
```

A ligação projeto↔pedido **já é a correta**: `pedido_itens.projeto_id` é opcional e um
pedido tem vários itens — logo um pedido já pode ter vários projetos e um projeto já pode
existir sem pedido. Nada a desfazer; falta mostrar isso nas telas e criar o elo que falta.

### 3.2. O que sai — e para onde vai antes de sair

Regra 17: migrar a funcionalidade primeiro, remover a página depois.
**Nenhuma linha de banco é apagada em nenhum dos 8 casos.**

| Módulo | Vai para | Banco |
|---|---|---|
| CRM | observações, tags, histórico e responsável → abas da ficha do cliente | nada sai (é derivado de `clientes`+`pedidos`) |
| Marketing | cupons → Loja > Cupons; e-mails → Config. > Comunicação; carrinho abandonado só como evento | nada sai |
| Automações | nenhuma tela; ficam os eventos internos | nasce `eventos`, sem interface |
| Suporte | botão **Ajuda** na Topbar | preservar `chamados` (a área do cliente escreve nela) |
| Carteira | Financeiro > Recebimentos (extrato atual) + Financeiro > Carteira (saldo, novo) | nasce `carteira_movimentos` |
| Auditoria | Configurações > Segurança > Auditoria | preservar `auditoria`; passar a escrever em toda ação sensível |
| Vendedores | Configurações > Equipe | preservar `vendedores` e `pedidos.vendedor_id` |
| Temas | Templates e Design (5 abas) | preservar `templates` |

**Zero link morto:** cada rota removida ganha redirect permanente (`/crm` → `/clientes`,
`/carteira` → `/financeiro?aba=carteira`, …). `tools/auditar.mjs` vira o teste disso.

### 3.3. O que é reaproveitado sem reescrever

Autenticação e multi-tenant · pipeline do design (`dc2tsx.py`, `gerar.sh`) · Pedidos,
Produção e Expedição (as três completas) · Editor do cliente (**não redesenhar**) ·
bibliotecas de consulta (`pedidos.ts`, `comercial.ts`, `financeiro.ts`, `lojista.ts`,
`cliente.ts`) · `impressao.ts`, que vira o miolo do worker.

Os 15 `Painel*.tsx` mortos são apagados conforme cada tela for ligada — **nunca antes**,
porque documentam a lógica que a tela nova precisa reproduzir.

### 3.4. O que nasce

| Rota | Tela | Depende de |
|---|---|---|
| `/projetos` | Central de Projetos — 6 cards, busca universal, 14 filtros, 9 status | colunas novas em `projetos` |
| `/projetos/[id]` | 6 abas: Resumo, Capa, Arquivos, Validação, Histórico, Versões | `projeto_arquivos`, `projeto_versoes`, `projeto_validacoes` |
| `/projetos/[id]/resumo` | Resumo do projeto + PDF | `impressao.ts` |
| `/renderizacao` | Central de Renderização — fila, workers, 11 status | `render_jobs` |
| `/renderizacao/[id]` | Detalhe do job — 7 etapas, arquivos, log, erro | `render_jobs`, `render_logs` |
| `/pedidos/[id]/os` | Ordem de serviço (impressão, QR Code, código de barras) | — |
| `/templates` | Layouts · Temas · Fundos · Elementos · Fontes | `templates` + `biblioteca_ativos` |
| `/loja/cupons` | Cupons | `cupons`, `cupom_usos` |
| `/clientes/importacoes` | Importação CSV/XLSX em 6 etapas | `importacoes` |
| `/financeiro` | 6 abas; absorve Pagamentos e Carteira | `carteira_movimentos` |
| `/conta/pedidos` · `/conta/pedidos/[id]` | Pedidos do cliente | — |

**Componentes compartilhados** (regra 4 do briefing) nascem na Fase 4, junto com a casca,
não em cada tela: Tabela, BarraDeFiltros, Modal, Gaveta, Selo, CartãoKPI, Campo,
Confirmação, EstadoVazio.

### 3.5. Migrações necessárias — todas aditivas

| Migração | Cria | Altera | Fase |
|---|---|---|---|
| **0014** filiais_e_codigos | `filiais` | `projetos.codigo` (L4512367, único por loja, indexado) · `pedidos.codigo` (PT-10482, derivado de `numero`) · `filial_id` em pedidos, projetos, clientes, vendedores, producao | 4 |
| **0015** projeto_completo | `projeto_arquivos` `projeto_versoes` `projeto_validacoes` | `projetos`: status novos (rascunho, aguardando_cliente, fechado, em_renderizacao, renderizado, com_erro, arquivado), `fechado_em`, `finalizado_em`, `arquivado_em`, `bytes_total`, `criado_por`, `capa_tipo`, `dorso_mm` | 5 |
| **0016** renderizacao | `render_jobs` `render_logs` `render_workers` | bucket `renders`, privado, com política por loja | 6 |
| **0017** producao_e_expedicao | `producao_historico` (regra 12) | `producao.etapa` 5→8 · `expedicao`: modalidade, volumes, peso, dimensões, coleta, previsão, SLA | 8–9 |
| **0018** comercial | `carteira_movimentos` `cupons` `cupom_usos` `grupos_cliente` `tabelas_preco` `regras_preco` `importacoes` | `clientes`: grupo, tabela de preço, observações, responsável, tags | 10–12 |
| **0019** catalogo_e_eventos | `eventos` `biblioteca_ativos` | `produtos`: DPI mínimo, sangria, área segura, páginas min/max/incremento, capa/dorso/contracapa, papéis, acabamentos, peso, dimensões | 11 |

**Invariantes:** UUID continua PK e o código amigável é coluna única indexada · toda tabela
nova com RLS por loja via `private.is_membro_do_lojista` · todo bucket novo privado com URL
assinada · soft delete (`arquivado_em`) em projeto, arquivo e versão · preço congelado no
item do pedido continua valendo.

### 3.6. Menu final — 17 itens em 6 grupos

```
OPERAÇÃO   /  /pedidos  /projetos  /producao  /renderizacao  /expedicao
LOJA       /loja  /catalogo  /precos  /templates  /loja/cupons
CLIENTES   /clientes  /clientes/importacoes
FINANCEIRO /financeiro
GESTÃO     /relatorios
SISTEMA    /integracoes  /configuracoes
```

Topbar: **Ajuda**. Fora do menu e com redirect: CRM, Marketing, Automações, Carteira,
Vendedores, Auditoria, Suporte, Temas.

### 3.7. Ordem de execução

A ordem do briefing muda em um ponto: **filiais e a casca vêm antes de tudo**, porque
atravessam todas as telas seguintes.

- **3** — commit do pendente; migrar a funcionalidade dos 8 módulos e então remover rota e menu, com redirect. Tabelas ficam.
- **4** — quebrar as 22 cópias da sidebar (casca em um arquivo, tela vira conteúdo de slot); menu novo; Topbar com Ajuda; migração 0014; kit de componentes.
- **5** — migração 0015; `/projetos`, `/projetos/[id]`, resumo.
- **6** — migração 0016 + bucket `renders`; fila e worker fora da requisição HTTP; `/renderizacao`.
- **7–9** — migração 0017; Pedido com aba Projetos e OS; Produção perde a fila de renderização e ganha kanban de 8 estágios; Expedição ganha volume, peso, SLA, etiqueta.
- **10–12** — migração 0018; ficha do cliente com 11 abas (absorve CRM); importações; Templates (5 abas, absorve Temas); Financeiro (6 abas, absorve Pagamentos e Carteira).
- **13–14** — migração 0019; Configurações com 14 abas (absorve Equipe, Auditoria, Comunicação); Centro de Relatórios com 9 categorias e exportação.
- **15** — área do cliente: `/conta/pedidos`, filtros em Meus projetos, galeria com filtros de qualidade, editor.
- **16** — os 20 passos do teste obrigatório, executados de verdade.

### 3.8. Riscos

| Risco | Tratamento |
|---|---|
| Reexportar o design volta o defeito do menu escrito à mão | a Fase 4 elimina a causa: `.dc.html` de tela não contém mais menu |
| `sharp` em 300 dpi bloqueando o processo Next | regra 9: worker fora; a rota só enfileira |
| URL assinada expira em 6 h e deixa o canvas branco | com `projeto_arquivos`, assinatura renovada por arquivo, sob demanda |
| Credencial de gateway em texto puro (`cripto.ts` nunca verificado) | verificar antes de qualquer tela de Pagamentos ir ao ar |
| Senha de teste circulou em texto puro | trocar antes de produção (registrado no ESTADO.md) |
| Import de `pedidos.ts` em componente de navegador quebra o build | rótulos e formatos continuam vindo de `pedidos-termos.ts` |

---

## 4. Quatro decisões antes da Fase 3

1. **Onde roda o worker de renderização?** Proposta: segundo container no mesmo
   `docker-compose`, puxando job de `render_jobs` — reusa `impressao.ts`, não depende de
   nada externo. Alternativa: Edge Function com cron, que não roda `sharp` do mesmo jeito.
2. **Filial: entidade real agora ou campo preparado?** Proposta: criar tabela e coluna na
   Fase 4, com uma filial padrão por loja criada automaticamente.
3. **Formato do código do projeto.** Proposta: letra do tipo (L/R/F) + 7 dígitos,
   sequencial por loja, gerado por função no banco como `proximo_numero_pedido`. Pedido
   vira `PT-` + o `numero` que já existe.
4. **As 12 telas de protótipo: ligar ou reconstruir?** Proposta: ligar (Loja, Catálogo,
   Preços, Integrações, Relatórios já têm consulta escrita e layout do design); reconstruir
   só as que mudam de forma — Financeiro, Configurações e Templates.


---

## 5. Andamento

### Fase 3 e 4 — feitas

**A casca virou uma só.** `dc2tsx.py` ganhou o modo `somenteConteudo`: descarta
tudo entre `<aside>` e `</header>` e devolve só o miolo do `<main>`. As 19 telas
do painel passaram a ser conteúdo puro; `ShellLojistaDesign` (gerado de
`Dashboard.dc.html`) é o **único componente com menu** — antes eram 22. Pedidos,
por exemplo, caiu de 678 para 305 linhas.

Dois defeitos apareceram no caminho e foram corrigidos no gerador, não à mão:

- `Pedidos.dc.html` abre uma `<div>` dentro do `<main>` que só fecha depois de
  `</main>`. Inofensivo no documento inteiro, fatal num recorte. `equilibrar()`
  fecha o que sobrou e avisa em qual arquivo.
- Uma troca de `dashboard.json` nunca casava (`alignItems` no meio da string), e
  por isso a classe responsiva do cabeçalho da tabela jamais foi aplicada.

**Menu novo**, 17 itens em 6 grupos, escrito uma vez em `Dashboard.dc.html`.
`src/lib/rotas-lojista.ts` passou a ser a fonte única: `MENU_LOJISTA` gera
`ROTAS_LOJISTA`, `MODULO` (fim dos `ativo={9}` mágicos nas páginas) e alimenta
também o menu de celular, que tinha seis itens sem destino.

**Nada virou link morto.** Módulo ainda sem tela (`Projetos`, `Renderização`,
`Cupons`, `Importações`, `Financeiro`) aparece esmaecido e não navega.
As 7 rotas que saíram do menu continuam respondendo, com uma faixa dizendo para
onde a funcionalidade vai — `ROTAS_LEGADAS` guarda o destino e o `migrado`, que
vira `true` quando o destino nasce.

**Suporte saiu.** Virou o botão **Ajuda** na topbar e a página `/ajuda`, com
três blocos de dado real: contato da Photoon (do ambiente), os canais que a
própria loja publica (do banco) e quantas mensagens os clientes abriram. Sem
nenhum valor de exemplo: campo vazio diz que está vazio e onde se preenche.

**Uma consulta a menos por página.** `molduraDaLoja()` era chamada pela página e
de novo pela moldura — `numerosDaLoja` lê 200 projetos. Agora só o
`ShellLojista` a chama; as páginas usam `lojaAtual()` quando só precisam do id.

Verificado: `tsc --noEmit` limpo, `next build` completo, servidor de produção
sobe e responde 200. **Não foi possível conferir no navegador autenticado** —
`tools/tirar-foto.mjs` precisa da senha de teste, que não está em arquivo
versionado.

### Próxima — Fase 4 (resto) e 5

Migração 0014 (filiais e códigos amigáveis), o kit de componentes
compartilhados (Tabela, Filtros, Modal, Gaveta, Selo, KPI, Confirmação,
EstadoVazio) e então a Central de Projetos.
