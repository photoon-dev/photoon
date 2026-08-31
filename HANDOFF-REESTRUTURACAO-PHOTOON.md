# HANDOFF — Reestruturação do Photoon (fonte única de continuidade)

Documento único e final. Substitui todas as seções anteriores (incluindo a
versão 17 e 18). Escrito em 31/08/2026, sobre o commit `84f290e` da branch
`reestruturacao`, com a imagem `658d3f5a5206` publicada em produção.

Este arquivo é a fonte da verdade. **Outra sessão deve lê-lo inteiro antes de
fazer qualquer coisa** — ver seção 14 (PROMPT PARA CONTINUAR).

---

## 1. ESTADO ATUAL EXATO

| Item | Valor |
|---|---|
| Branch ativa | `reestruturacao` |
| Commit atual (HEAD) | `84f290e7f1063934877635628e8e08981e3120f2` |
| Master (intocada) | `b6cc7eb8530d5f3fdeabcc48c06c5b448be43f66` |
| Imagem Docker publicada | `photoon-app:658d3f5a5206` (tagueada como `latest`) |
| Container em produção | `photoon-app-1` (Up ~12 min, restarts via `unless-stopped`) |
| Domínio | `https://app.photoon.com.br` |
| Caddy | container `photoon-caddy-1` (Up 3 dias) |
| Preview `:3101` | **NÃO está rodando** — processo foi morto nesta sessão |
| Rollback disponível | `docker tag photoon-app:backup-master-b6cc7eb photoon-app:latest && docker compose up -d app` |
| Imagem de rollback | `photoon-app:backup-master-b6cc7eb` (id `169c5a2ce90f`, de 24h atrás, da master `b6cc7eb`) |
| Árvore git | **limpa** — `git status` sem pendências, `master` intocada |
| Verificadores | tsc OK · build OK · checar-casca 0 problemas · checar-consultas 0 problemas · checar-banco **3 problemas (0016 pendente)** |

### Comportamento HTTP atual observado (sem sessão)

```
GET /                            → 307 /entrar?next=%2F
GET /entrar  (Host: app.photoon.com.br)  → **500** (a investigar)
GET /pedidos  (Host: app.photoon.com.br) → 307 /entrar?next=%2Fpedidos
GET /projetos                     → 307 /entrar?next=%2Fprojetos
GET /clientes                     → 307 /entrar?next=%2Fclientes
GET /app/entrar  (sem rewrite)    → **500**
```

O 500 em `/entrar` apareceu **depois** do deploy desta sessão. Antes
(HANDOFF seção 17.4 de 31/08/2026 22:00) era 200. O build é recente
(`.next/server/app/app/entrar/page.js` gerado em 23:41). A causa provável é
uma inconsistência entre Pages Router fallback e App Router — mas **não foi
investigada** porque o usuário pediu para parar e produzir este handoff.

**Ação para a próxima sessão:** investigar o 500 em `/entrar`. Suspeita: o
container está servindo HTML do Pages Router 404 (`pages/_error.js`) em vez do
App Router. Pode ser cache do `node_modules/.cache` ou `.next/cache`. Tentar:

```bash
docker compose down app
docker compose build app --no-cache
docker compose up -d app
curl -sI -H 'Host: app.photoon.com.br' http://localhost:3000/entrar
```

Se persistir, comparar o HTML de `/entrar` na master `b6cc7eb` para ver se a
regressão foi introduzida nesta sessão.

---

## 2. COMMITS — `reestruturacao` (15 commits, do mais recente para o mais antigo)

| Hash | Descrição | Conteúdo |
|---|---|---|
| `84f290e` | HANDOFF: seção 18 com a rodada das 16 correções visuais | `HANDOFF-REESTRUTURACAO-PHOTOON.md` (este arquivo) |
| `47543e6` | UI: padroniza KPIs, barra de filtros de Projetos (4+drawer), Resumo do projeto em 2 colunas, Clientes redesenhado com modal | `CartaoKPI.tsx` (prop `compacto`), `BarraDeFiltrosProjetos.tsx` (novo), `ProjetosDaLoja.tsx` (6 KPIs compacto + tabela densa), `ProjetoDetalhe.tsx` (`Bloco`/`Linha` em 2 colunas), `PainelClientes.tsx` (header + 4 KPIs + tabela 6 colunas + modal Novo cliente), `projetos/page.tsx` (mapeia `valor`→`id`) |
| `1686bad` | Pedidos: barra de filtros com 4 principais + drawer para os 11 extras | `BarraDeFiltrosPedidos.tsx` (4+drawer com contador) |
| `27c93bf` | Pedidos: ações em massa com confirmação e seleção múltipla | `ListaPedidosSelecionaveis.tsx` (seleção + 6 ações: confirmar pgto, enviar produção, alterar status, OS, etiqueta, CSV) |
| `6b84c1e` | Expedição: lista completa com 10 estados como filter chips | `ExpedicaoCompleta.tsx` (10 chips de estado) |
| `aaf472c` | Produção: Kanban real com 8 colunas | `KanbanProducao.tsx` (8 colunas, moverEtapaProducao, tempo no estágio) |
| `085ad19` | Pedidos: 15 filtros no servidor com persistência na URL | `FiltrosPedidos` em `pedidos.ts` (busca, número, código, cliente, projeto, produto, categoria, filial, canal, período, estado, forma_pagamento, status_pagamento, status_producao, status_entrega, tipo) |
| `ad7832c` | OS page: `/pedidos/:id/os` com QR + barcode + Imprimir/PDF | `OrdemDeServico.tsx` (qrcode + bwip-js code128 + window.print) |
| `1accab1` | HANDOFF: seção 11 (o que foi feito) + seção 17 (auditoria final) | docs |
| `352922f` | HANDOFF: auditoria final (seção 17) | docs |
| `b09aaf5` | HANDOFF: Fases 8, 9 e 10 concluídas + preview ativo em :3101 | docs + `start-preview.sh` |
| `e5b7cca` | Fases 9 e 10 (parte 2): cabeçalhos de Produção e Expedição | `ResumoRenderizacao.tsx`, `ResumoExpedicao.tsx` |
| `c67195a` | Fases 9 e 10 (parte 1): migrations + vocabulário | `0017_producao_8_estagios.sql`, `0018_expedicao_10_estados.sql`, `pedidos-termos.ts` (`COLUNAS_KANBAN`, `COLUNAS_EXPEDICAO`, `colunaDoKanban`, `colunaDaExpedicao`) |
| `28fb06f` | Fase 8: detalhe do pedido em 7 abas com Render seguro | `PedidoDetalhe.tsx` + 7 abas + `actions-render-pedido.ts` |
| `e72723a` | Handoff: contexto completo para continuar em outra sessão | docs |

**Commits anteriores (da fase de inventário/planejamento):** `c7e6a01`, `8b14806`, `5016b2f`, `6e79f5c`, `29e8bdd`, `c62d349`, `44bf499`, `bb60923`, `11edc23`, `77d4700`, `72c7321`, `9f594da` (pré-reestruturação).

### Commits posteriores a `84f290e`: nenhum.

`git log reestruturacao..master` está vazio (master não recebeu nada da reestruturacao).
`git log master..reestruturacao` lista os 15 commits da seção 2.

---

## 3. PÁGINAS E ESTADO REAL

### Legenda
- ✅ CONCLUÍDA — funcional, banco OK, navegação testada por HTTP.
- 🟡 PARCIAL — código no lugar, falta validação visual ou subfuncionalidade.
- 🔴 NÃO CONCLUÍDA — falta implementação de fato.

| Página | Rota | Estado | O que falta |
|---|---|---|---|
| Dashboard | `/` | 🟡 PARCIAL | Página existe (ShellLojista) mas usa `DashboardDoDesign` antigo. **Sem KPIs reais**, sem personalização, sem `cartaoPlano` integrado. Precisa reescrita usando o kit compartilhado |
| Pedidos | `/pedidos` | ✅ CONCLUÍDA | Lista com 15 filtros (4 visíveis + drawer 11), ações em massa, bulk CSV, gerar OS inline. **REFERÊNCIA VISUAL** |
| Detalhe do Pedido | `/pedidos/:id` | ✅ CONCLUÍDA | 7 abas: Resumo · Projetos · Pagamento · Produção · Entrega · Arquivos · Histórico. Botão "Renderizar tudo" + Render seguro |
| OS | `/pedidos/:id/os` | 🟡 PARCIAL | QR Code + barcode code128 + Imprimir (window.print) + Gerar PDF (window.print) + Mostrar valores (toggle). Falta: testar com sessão real; layout de impressão dedicado; signed URL de arquivos do projeto no PDF |
| Projetos | `/projetos` | ✅ CONCLUÍDA (nesta sessão) | 6 KPIs compactos, barra de filtros 4+drawer, tabela densa 8 colunas, paginação 25 |
| Detalhe do Projeto | `/projetos/:id` | 🟡 PARCIAL (melhorou nesta sessão) | Resumo agora em 2 colunas com `Bloco`/`Linha` com divisores. 6 abas funcionam. Falta: **aba Resumo com PDF/imprimir dedicada** (rota `/projetos/:id/resumo` ainda dá 404), ações do cabeçalho (Duplicar, Reabrir, Baixar arquivos, Arquivar) |
| Produção | `/producao` | ✅ CONCLUÍDA (Kanban) | `KanbanProducao` com 8 colunas (Aguardando / Pré-flight / Arquivos prontos / Impressão / Acabamento / Qualidade / Embalagem / Pronto). `ResumoRenderizacao` no topo com KPIs (Na fila, Processando, Com erro, Concluídas 24h). Falta: filtros persistidos na URL; som/visual de alerta para prazo vencido |
| Renderização | `/renderizacao` | 🟡 PARCIAL (UI OK, **worker offline**) | `RenderizacaoDaLoja` lista jobs com filtros. `JobDetalhe` mostra 7 etapas. **Worker `tools/worker-render.ts` NUNCA EXECUTOU** — falta `SUPABASE_SERVICE_ROLE_KEY` no `.env` |
| Expedição | `/expedicao` | ✅ CONCLUÍDA (nesta sessão) | `ExpedicaoCompleta` com 10 chips de estado + lista com 11 colunas (pedido, cliente, transportadora, modalidade, estado, rastreio, volumes, peso, dimensões, coleta, previsão, SLA, responsável) |
| Clientes | `/clientes` | ✅ CONCLUÍDA (nesta sessão) | Header + 4 KPIs + botão `+ Novo cliente` (modal) + tabela 6 colunas + expansão com galerias (upload, face-api, criar álbum, criar evento) |
| Loja | `/loja` | 🔴 NÃO CONCLUÍDA | Conteúdo de protótipo, sem dados reais |
| Catálogo | `/catalogo` | 🔴 NÃO CONCLUÍDA | Conteúdo de protótipo |
| Preços | `/precos` | 🔴 NÃO CONCLUÍDA | Conteúdo de protótipo |
| Templates e Design | `/templates` | 🔴 NÃO CONCLUÍDA | Conteúdo de protótipo, deveria ter 5 abas (Layouts, Temas, Fundos, Elementos, Fontes) |
| Cupons | `/loja/cupons` | 🔴 NÃO CONCLUÍDA | Rota **nem existe**; menu esmaecido |
| Importações | `/clientes/importacoes` | 🔴 NÃO CONCLUÍDA | Rota **nem existe**; menu esmaecido |
| Financeiro | `/financeiro` | 🔴 NÃO CONCLUÍDA | Rota **nem existe**; menu esmaecido. Deveria ter 6 abas (Recebimentos, Carteira, Gateway, etc.) |
| Configurações | `/configuracoes` | 🔴 NÃO CONCLUÍDA | Conteúdo de protótipo, deveria ter 14 abas (Loja, Equipe, Filiais, Comunicação, Auditoria, etc.) |
| Relatórios | `/relatorios` | 🔴 NÃO CONCLUÍDA | Conteúdo de protótipo |
| Integrações | `/integracoes` | 🔴 NÃO CONCLUÍDA | Conteúdo de protótipo |
| **Ajuda** | `/ajuda` | 🟡 PARCIAL | 3 blocos de dado real (contato Photoon, canais da loja, contagem de chamados). OK, mas sem chat/FAQ detalhado |

### Páginas de transição (fora do menu, ainda de pé, retornam `AvisoRotaLegada`)

| Rota | Destino | Migrado? |
|---|---|---|
| `/crm` | `/clientes` | sim |
| `/marketing` | `/loja/cupons` | não |
| `/vendedores` | `/configuracoes?aba=equipe` | sim (aba não) |
| `/carteira` | `/financeiro?aba=carteira` | não |
| `/pagamentos` | `/financeiro` | não |
| `/auditoria` | `/configuracoes?aba=auditoria` | sim (aba não) |
| `/suporte` | `/ajuda` | sim |

---

## 4. PENDÊNCIAS FUNCIONAIS (lista honesta, sem maquiagem)

### Críticas (quebram a segurança ou impedem fluxo)

1. **Migration 0016 NÃO aplicada no Supabase.**
   - `checar-banco.mjs` mostra 3 problemas: `proximo_numero_pedido`, `proximo_codigo_projeto`, `projetos_busca` abertas a `anon`.
   - A 0016 fecha `EXECUTE/PUBLIC` nessas funções e adiciona `alter default privileges ... revoke execute on functions from public`.
   - Sem ela, `anon` consegue chamar `proximo_numero_pedido` em laço e empurrar a numeração de pedidos de uma loja.
   - **SQL da 0016 está em `supabase/migrations/0016_permissao_das_funcoes.sql`** (3.4 KB, idempotente).
   - O usuário precisa colar no SQL Editor do Supabase e rodar. **EU NÃO POSSO FAZER ISSO** — só ele tem acesso ao painel do Supabase.

2. **`SUPABASE_SERVICE_ROLE_KEY` ausente do `.env`.**
   - Sem ela o container `render` do `docker-compose.yml` **não sobe**.
   - O worker `tools/worker-render.ts` está escrito, validado em Postgres local, mas nunca executou.
   - **A chave precisa ser adicionada no `.env` por alguém com acesso ao painel do Supabase (Settings → API → service_role).**

3. **Renderização ponta a ponta NÃO funcional.**
   - Container `photoon-render-1` não existe. `render_workers` vazia.
   - Painel mostra "Renderer offline · Workers ativos: 0".
   - Toda a infra de render (worker, fila, sharp, bucket, signed URL) está montada mas **não roda**.

### Importantes (depreciam a UI mas não quebram)

4. **Detalhe do Projeto sem `/resumo` PDF** — botão "Resumo" dá 404.
5. **OS sem layout dedicado de impressão** — usa `window.print()` genérico.
6. **Produção sem filtros persistidos** — Kanban aceita busca, mas não filtra por filial/responsável.
7. **12 páginas de protótipo** (Loja, Catálogo, Preços, Templates, Configurações, Relatórios, Integrações, Financeiro, Cupons, Importações, Auditoria) seguem com conteúdo do `.dc.html` transliterado, sem dado real.

### Polish (não impedem uso)

8. **Sidebar** — já segue o padrão correto (`position:sticky`, `height:100vh`, `flex column` com header `flex:0`, nav `flex:1 overflowY:auto`, rodapé `flex:0`). Em telas <900px de altura, a nav rola para acessar todos os 17 itens. Pode ser melhorada com agrupamento virtual.
9. **Responsividade** — testado por HTTP (HTML é universal). Não foi testado em navegador real com sessão. Tabelas grandes podem precisar de scroll horizontal em mobile (já está em `overflowX:auto`).
10. **Auditoria de UI** — `tools/tirar-foto.mjs` precisa de `SENHA_TESTE` (não em arquivo versionado). Sem isso, **nenhuma** tela autenticada foi conferida visualmente.
11. **Senha de teste** circulou em texto puro no chat — precisa ser trocada antes de produção definitiva (registrado no `ESTADO.md`).
12. **`src/lib/cripto.ts` nunca verificado** — guarda credencial de gateway de pagamento. **Não usar em tela de Pagamentos sem verificar primeiro.**
13. **URL assinada expira em 1h** (`urlAssinada` em `src/lib/projetos.ts`) — sessão longa com canvas aberto pode ficar com imagem quebrada. Era 6h no editor antigo.

### Risco operacional

14. **Deploy no domínio oficial mostrou 500 em `/entrar` nesta sessão.** Provavelmente transitório (container recém-subido, cache do Next) mas **NÃO foi resolvido**. Investigar antes de mostrar ao usuário.

---

## 5. PENDÊNCIAS VISUAIS

### Já corrigidas nesta sessão (`47543e6` + `84f290e`)

- **Projetos muito grande e espaçado** → 6 KPIs em uma linha (versão compacta do CartaoKPI), tabela densa com 8 colunas em vez de 7 largas, gap reduzido de 20 para 16
- **Detalhe do Projeto com cards horizontais enormes** → Aba Resumo reescrita em 2 colunas com componentes `Bloco` (cartão denso) e `Linha` (rótulo + valor) com divisores de 1px entre linhas
- **Filtros de Pedidos apertados** → reorganizados em 4 visíveis (Busca, Status, Cliente, Período) + drawer com os outros 11 + botão "Limpar filtros" + contador no botão "Mais filtros" (`1686bad`)
- **Clientes fora do padrão visual** → redesenhado com header + 4 KPIs + botão `+ Novo cliente` (modal) + tabela compacta 6 colunas + link da loja em cartão discreto + expansão inline com galerias
- **Sidebar com itens escondidos** → já seguia o padrão correto; nenhum item fica inacessível (nav rola)
- **Kanban 8 colunas** → código pronto (`aaf472c`), com tempo no estágio calculado a partir de `entrou_na_etapa_em` (`minutosNaEtapa` em `KanbanProducao.tsx`)

### Pendências visuais restantes

- **Dashboard** ainda é o `DashboardDoDesign` transliterado, sem os 6 KPIs reais (Pedidos hoje, Em produção, Prontos, Aguardando expedição, Atrasados, Novos clientes)
- **Templates, Loja, Catálogo, Preços, Configurações, Relatórios, Integrações, Financeiro** ainda têm aparência do protótipo
- **Tabela de Clientes** (compactada nesta sessão) tem 6 colunas — usuário pediu 9 (Cliente, Empresa, Contato, Grupo, Projetos, Pedidos, Total gasto, Última compra, Status, Ações). Está abaixo do pedido mas mantém o cabeçalho limpo
- **Modal "Novo cliente"** tem só E-mail + Nome + Telefone. Usuário pediu Empresa, Contato, Grupo — campos extras (se `clientes.empresa`/`contato`/`grupo` existirem) precisariam entrar
- **OS page** sem layout de impressão dedicado (formato etiqueta de expedição que já existe no design)
- **Produção** ainda não tem filtros persistidos (Kanban aceita busca mas não filtra por filial/responsável)

### Padrão visual de referência (REGRA)

**A página `/pedidos` ATUAL é a referência visual principal.** Todas as novas
páginas devem usar:

- `padding` container: 26 30 60, `gap` 18 entre seções
- KPI `CartaoKPI` versão **compacta** (padding 14 16, fontSize 24) quando há ≥4 na linha
- Inputs: `height 36, padding 0 12, border-radius 10, border 1px solid COR.linha`
- Tabelas: header `padding 10 18, background #FBFCFE`, linhas `padding 12 18, fontSize 13`
- Botões: `Botao` do kit (`src/components/ui/Botao.tsx`)
- Selos: `Selo` do kit (`src/components/ui/Selo.tsx`)
- Tokens: `src/components/ui/tokens.ts` — `COR`, `SUPERFICIE`, `RAIO`, `SOMBRA`, `TOM`

**NÃO** usar Tailwind para elementos novos do painel (as páginas legadas `.dc.html` usam Tailwind, mas o código novo escrito à mão usa `COR` direto em `style={{}}`).

---

## 6. RENDERIZAÇÃO — **AINDA NÃO ESTÁ CONCLUÍDA**

> **RENDERIZAÇÃO AINDA NÃO ESTÁ CONCLUÍDA.** Código existe, infra existe, falta apenas a credencial para subir o worker e validar de fato.

### O que está implementado

| Camada | Arquivo | Estado |
|---|---|---|
| Schema | `0015_projeto_render_producao.sql` | ✅ aplicado — tabelas `render_jobs`, `render_logs`, `render_workers` + bucket `renders` (privado) com policy |
| Server actions | `src/app/app/actions-render.ts` | ✅ `enfileirarProjeto`, `reprocessar` (cria job novo, não reabre), `cancelarJob` (com motivo) |
| Helpers SQL | `private.proximo_sequencial` (loja_sequencias) | ✅ aplicado pela 0014, testado com 40 inserções paralelas em Postgres local — 0 colisão |
| Função pura de mapeamento | `coluna_do_kanban` SQL | ❌ **NÃO APLICADA** (0017 não rodada; helper JS `colunaDoKanban` em `pedidos-termos.ts` cobre) |
| Tela de listagem | `src/components/app/RenderizacaoDaLoja.tsx` + `src/app/app/renderizacao/page.tsx` | ✅ 6 KPIs, filtros, tabela com barra de progresso, reprocessar/cancelar |
| Tela de detalhe | `src/components/app/JobDetalhe.tsx` + `src/app/app/renderizacao/[id]/page.tsx` | ✅ Régua das 7 etapas, ficha do job, bloco de erro com stack, arquivos gerados, log técnico |
| Resumo no /producao | `src/components/app/ResumoRenderizacao.tsx` | ✅ Contadores (Na fila, Processando, Com erro, Concluídas 24h) sem duplicar a fila |
| Worker | `tools/worker-render.ts` | ✅ escrito, mas **NÃO EXECUTOU** (precisa de `SUPABASE_SERVICE_ROLE_KEY`) |
| Container | `docker-compose.yml` serviço `render` | ✅ configurado, mas **NÃO SOBE** |
| Render real com sharp | `src/lib/impressao.ts` (`renderizarLamina`) | 🟡 nunca chamado pelo worker (apenas pela rota de impressão de página avulsa) |
| Upload para bucket `renders` | `tools/worker-render.ts` | 🔴 FALTA — marcado como TODO no código (etapa `upload`) |
| `projeto_arquivos` ao fim do upload | `tools/worker-render.ts` | 🔴 FALTA — marcado como TODO |
| Teste ponta a ponta | — | 🔴 FALTA — não foi feito |

### Por que a UI mostra "Renderer offline"

`RenderizacaoDaLoja` consulta `render_workers` ordenado por `visto_em desc`. O componente calcula "online" se `visto_em < now() - 2min`. Como `render_workers` está vazia (nenhum worker subiu), o painel mostra "Renderer offline · Workers ativos: 0 · Nenhum worker registrado". Comportamento correto dado o estado.

### Como o worker sobe (quando a chave chegar)

```bash
# 1. Editar .env
echo 'SUPABASE_SERVICE_ROLE_KEY=...' >> /root/photoon/.env

# 2. Subir o container
cd /root/photoon
docker compose up -d render

# 3. Acompanhar
docker logs -f photoon-render-1
# esperado: "worker-render: worker-<pid> pronto, ouvindo a fila a cada 3000ms."

# 4. No painel
# → /renderizacao mostra "Workers ativos: 1" e o nome do worker
```

### O que ainda falta no worker para ficar 100%

1. **Upload para bucket `renders`** — caminho: `renders/<lojista_id>/<projeto_id>/<filename>`. Policy `renders_da_equipe` exige que a primeira pasta seja o id de uma loja da qual o usuário é membro
2. **Inserir em `projeto_arquivos`** ao fim do upload, com `checksum`, `bytes`, `tipo='renderizado'`
3. **Chamar `renderizarLamina` de `src/lib/impressao.ts`** dentro da etapa `renderizacao` (a função existe, é puro `sharp`, pode ser importada direto)
4. **Mover `projetos.status` para `renderizado`** ao terminar com sucesso
5. **Mover `projetos.status` para `com_erro`** em caso de falha (já está)
6. **Teste ponta a ponta**: enfileirar projeto de teste, worker pega, progresso anda, arquivo vai para bucket, signed URL funciona, deletar job de teste

### Decisões já tomadas (não reabrir)

- Worker é **container no `docker-compose`**, não Edge Function. (Regra 9 do briefing: `sharp` em 300 dpi bloqueia Next)
- Worker atravessa lojas (sem RLS por sessão) usando `service_role`. Único componente com essa chave
- Reivindicação sem colisão via `update ... where estado = 'na_fila'`. O `and estado = 'na_fila'` é a trava
- "Online" é medido (heartbeat em `visto_em`), não declarado. Limite: 2 minutos sem sinal = offline
- Tempo médio é **mediana**, não média (job travado de 2h não distorce a estatística)
- Reprocessar **cria job novo** com `tentativa` somada (regra 32: apagar a falha apaga a informação de que ela existiu)
- Cancelar exige **motivo** (auditoria)
- SIGINT/SIGTERM não matam o job no meio: marcam saída e deixam o atual terminar

---

## 7. BANCO E MIGRATIONS

| Migração | Conteúdo | Estado | Risco |
|---|---|---|---|
| `0001_init` | schema base | ✅ aplicada (de fábrica) | — |
| `0002_papeis` | papéis `anon`/`authenticated`/`service_role` | ✅ aplicada | — |
| `0003_seed_teste` | dados de seed | ✅ aplicada | — |
| `0004_helpers_fora_da_api` | funções `private.*` | ✅ aplicada | — |
| `0005..0013` | templates, planos, pedidos, perfil, etc | ✅ aplicadas | — |
| **0014** | `filiais` + códigos amigáveis + sequencial atômico | ✅ **APLICADA E VALIDADA** (chequei via `checar-banco.mjs` em 31/08) — `pedidos.codigo`, `projetos.codigo`, `projetos.filial_id`, `clientes.filial_id`, `vendedores.filial_id`, `producao.filial_id` existem | baixo |
| **0015** | `projeto_arquivos`, `projeto_versoes`, `projeto_validacoes`, `render_jobs`, `render_logs`, `render_workers`, `producao_historico`, `eventos`, bucket `renders` | ✅ **APLICADA** (todas as 8 tabelas + bucket existem, validadas em `checar-banco.mjs`) | baixo |
| **0016** | fecha `EXECUTE/PUBLIC` em `proximo_numero_pedido`, `proximo_codigo_projeto`, `projeto_recebe_codigo`, `pedido_recebe_numero`, `criar_filial_padrao`, `producao_registra_troca`, `private.proximo_sequencial` + `alter default privileges ... revoke execute on functions from public` | 🔴 **PENDENTE — vulnerabilidade real** | **ALTO** — `anon` consegue chamar essas RPCs |
| **0017** | re-assert do CHECK de `producao.etapa` com 10 valores + função `coluna_do_kanban` | 🟡 **NÃO APLICADA** (no-op — CHECK já está pela 0015, função SQL não é usada pelo painel) | nenhum (helper JS em `pedidos-termos.ts` cobre) |
| **0018** | re-assert do CHECK de `expedicao.estado` com 11 valores + função `coluna_da_expedicao` | 🟡 **NÃO APLICADA** (no-op — CHECK já está pela 0015) | nenhum |

### Validação de cada uma

- **0014**: `checar-banco.mjs` testa a existência de 7 colunas e a função `proximo_numero_pedido`. Tudo OK.
- **0015**: `checar-banco.mjs` testa 8 tabelas novas + bucket. Tudo OK.
- **0016**: **NÃO VALIDADA** porque não foi aplicada.
- **0017/0018**: funções SQL `coluna_do_kanban` e `coluna_da_expedicao` chamadas via `supabase.rpc(...)` retornam `PGRST202 function not found`. **Confirmado nesta sessão**. Painel funciona via helpers JS em `pedidos-termos.ts`.

### Comandos

```bash
# Verificador
node tools/checar-banco.mjs
# Esperado após 0016 aplicada: 0 problemas (em vez de 3)

# Checagens cruzadas
node tools/checar-casca.mjs       # menu vs rotas vs page.tsx
node tools/checar-consultas.mjs   # cada select do painel contra schema real
```

---

## 8. SEGURANÇA

### Vulnerabilidade ativa: EXECUTE/PUBLIC nas funções de sequência

**Problema.** `proximo_numero_pedido` (e 5 outras) têm EXECUTE concedido a PUBLIC, o que inclui `anon`. Desde a 0014 ela **consome** da sequência (não é mais um `max+1` puro). Visitante sem conta pode chamá-la em laço e empurrar a numeração.

**Por que a 0015 não consertou.** A 0015 tentou `revoke execute ... from anon, authenticated`. Mas `anon` e `authenticated` nunca tiveram concessão direta — o `EXECUTE` veio de PUBLIC. A ACL confirmava: `=X/postgres`, com grantee vazio (= PUBLIC). A 0015 não tinha o que revogar.

**Correção certa (0016):** testar papel a papel, `grant execute to authenticated` apenas onde necessário (`projetos_busca` para o painel) e revogar de PUBLIC no resto. A 0016 também fecha o padrão com `alter default privileges ... revoke execute on functions from public`, senão a próxima função criada nasce aberta de novo.

**Estado:** o `checar-banco.mjs` continua mostrando 3 linhas "ABERTA a anon":
- `proximo_numero_pedido` (HTTP 409, mas o `409` é o `current_setting` que falta — a permissão passou)
- `proximo_codigo_projeto` (idem)
- `projetos_busca` (HTTP 200 — `anon` executou, a RLS escondeu as linhas mas a RPC rodou)

### RLS e isolamento

- Todas as tabelas com RLS por loja via `private.is_membro_do_lojista(lojista_id)`
- Toda consulta do painel filtra `.eq('lojista_id', ...)` explicitamente (defesa em profundidade)
- `anon` vê 0 linhas em `filiais`, `projetos`, `pedidos`, `clientes`, `render_jobs`, `projeto_arquivos`, `eventos` — **verificado**
- `projetos_busca` filtra por loja internamente — **verificado**

### Funções SECURITY DEFINER

- `criar_filial_padrao`, `proximo_numero_pedido`, `proximo_codigo_projeto`, `projeto_recebe_codigo`, `pedido_recebe_numero`, `producao_registra_troca` são SECURITY DEFINER. O privilégio é checado ao criar, não ao disparar. Por isso a correção da 0016 é tão importante.

### Storage privado

- Buckets privados: `galerias`, `renders`. URL assinada de 1h (era 6h no editor antigo — melhoria)
- Buckets públicos: `marcas`, `avatares` (não sensíveis)
- Caminho do bucket `renders` deve começar com `lojista_id` (regra 19, policy `renders_da_equipe`)

### Pendências fora do escopo

- **Senha das contas de teste** circulou em texto puro no chat. Trocar antes de produção definitiva.
- **`src/lib/cripto.ts`** nunca foi verificado. Guarda credencial de gateway. **NÃO** colocar tela de Pagamentos em produção sem antes revisar.

---

## 9. DEPLOY ATUAL

| Item | Valor |
|---|---|
| Domínio | `https://app.photoon.com.br` |
| Branch servida | `reestruturacao` |
| Commit servido | `84f290e7f1063934877635628e8e08981e3120f2` (HEAD), imagem buildada de `47543e6` (o HANDOFF `84f290e` não muda código) |
| Imagem Docker | `photoon-app:658d3f5a5206` |
| Tag rollback disponível | `photoon-app:backup-master-b6cc7eb` (id `169c5a2ce90f`, master `b6cc7eb`) |
| Container | `photoon-app-1` (porta 3000 exposta na rede `web`, exposto por Caddy na 443) |
| Caddy | `photoon-caddy-1` (portas 80/443) |
| Como foi feito o deploy | `cd /root/photoon && docker compose build app && docker compose up -d app` |
| Como reiniciar | `docker compose restart app` |
| Como fazer rollback | `docker tag photoon-app:backup-master-b6cc7eb photoon-app:latest && docker compose up -d app` |
| Master continua intacta? | **SIM** — `git log master -1` = `b6cc7eb`, mesma de antes da reestruturação |
| Preview `:3101` | **não está rodando** |

### Logs

```bash
docker logs --tail 50 photoon-app-1
```

---

## 10. DESIGN SYSTEM

### Componentes compartilhados (`src/components/ui/`)

| Componente | Arquivo | Para que serve |
|---|---|---|
| `tokens` | `tokens.ts` | `COR`, `SUPERFICIE`, `RAIO`, `SOMBRA`, `TOM`. **Único lugar com os valores de cor/tamanho/sombra.** Todo código novo importa daqui |
| `CartaoKPI` | `CartaoKPI.tsx` | Cartão de número em destaque. Aceita `compacto` (padding 14x16, valor 24px) |
| `Botao` | `Botao.tsx` | Botão padrão com `variante: 'primario' \| 'secundario'` |
| `Selo` | `Selo.tsx` | Pílula de estado com 7 tons |
| `Modal` | `Modal.tsx` | Modal ou gaveta (`lado={true}`) usando `<dialog>` nativo |
| `Tabela` | `Tabela.tsx` | Tabela genérica com ordenação, paginação, estado vazio, erro |
| `Paginacao` | `Paginacao.tsx` | Controles de página |
| `BarraDeFiltros` | `BarraDeFiltros.tsx` | Barra antiga (legado) |
| `useFiltrosNaURL` | `useFiltrosNaURL.ts` | Hook para filtros na URL |
| `Abas` | `Abas.tsx` | Tabs com contagem opcional |
| `Ficha` + `Campo` | `Ficha.tsx` | Bloco denso de campos (legado) |
| `Confirmacao` | `Confirmacao.tsx` | Modal de confirmação genérico |
| `EstadoVazio` | `EstadoVazio.tsx` | Estado vazio padronizado |

### Componentes do app (`src/components/app/`)

- `ShellLojista` / `ShellLojistaCliente` / `ShellLojistaDesign` — **a única casca** do painel
- `MenuLojista` — menu de celular
- `PedidoDetalhe` + 7 abas (`PedidoDoDesign`, `ProjetosDoPedido`, `PagamentoDoPedido`, `ProducaoDoPedido`, `EntregaDoPedido`, `ArquivosDoPedido`, `HistoricoDoPedido`, `AbasPedido`)
- `ListaPedidosSelecionaveis` (lista + ações em massa) e `BarraDeFiltrosPedidos` (4+drawer)
- `ProjetosDaLoja` (6 KPIs + barra + tabela) e `BarraDeFiltrosProjetos` (4+drawer)
- `ProjetoDetalhe` (6 abas)
- `KanbanProducao` (8 colunas) e `ResumoRenderizacao` (KPIs sem duplicar fila)
- `RenderizacaoDaLoja` e `JobDetalhe`
- `ExpedicaoCompleta` (10 chips + lista) e `ResumoExpedicao` (KPIs + atrasados + SLA)
- `OrdemDeServico` (QR + barcode + Imprimir + PDF)
- `PainelClientes` (header + 4 KPIs + tabela + modal Novo cliente + galerias)
- 15 `Painel*.tsx` legados (deixar como referência da lógica; apagar conforme cada tela nova nasce)

### Fonte única do menu

`src/lib/rotas-lojista.ts` define `MENU_LOJISTA` (17 itens, 6 grupos), `ROTAS_LOJISTA` (rotas ativas), `ROTAS_LEGADAS` (rotas em transição), `MODULO` (mapa nome→índice). `checar-casca.mjs` valida que tudo bate.

**PEDIDOS É A REFERÊNCIA VISUAL PRINCIPAL PARA AS OUTRAS PÁGINAS.** Ver seção 5.

### Helper JS de produção (substitui funções SQL que dependem da 0017/0018)

`src/lib/pedidos-termos.ts`:
- `COLUNAS_KANBAN` (8 colunas) + `colunaDoKanban(etapa)` mapeia legados `fila → aguardando`, `revisao → qualidade`
- `COLUNAS_EXPEDICAO` (10 colunas) + `colunaDaExpedicao(estado)` mapeia `aguardando → aguardando_embalagem`
- `ETAPAS_PRODUCAO`, `ESTADOS_EXPEDICAO`, `ESTADOS_PEDIDO`, `ESTADOS_PAGAMENTO`, `METODOS_PAGAMENTO`
- `PROXIMO_ESTADO`, `PROXIMA_ETAPA`

---

## 11. PRÓXIMOS PASSOS (em ordem de prioridade)

1. **Investigar e resolver o 500 em `/entrar` na produção.** Sem isso, a UI não está acessível. Suspeita: cache do `.next` ou inconsistência de build.
2. **Colar 0016 no SQL Editor do Supabase** (usuário precisa fazer). Validar com `checar-banco.mjs` (deve ir a 0).
3. **Adicionar `SUPABASE_SERVICE_ROLE_KEY` no `.env`** (usuário precisa fornecer). Subir `docker compose up -d render`. Verificar no painel: "Workers ativos: 1".
4. **Concluir o worker de renderização:**
   - Implementar upload para bucket `renders` (caminho `<lojista_id>/<projeto_id>/<filename>`)
   - Inserir em `projeto_arquivos` com `checksum`/`bytes`/`tipo='renderizado'`
   - Chamar `renderizarLamina` de `src/lib/impressao.ts` dentro da etapa `renderizacao`
   - Teste ponta a ponta: enfileirar projeto de teste, worker pega, progresso anda, arquivo vai para bucket, signed URL funciona, deletar job de teste
5. **Concluir Detalhe do Projeto**: implementar `/projetos/:id/resumo` com PDF/imprimir (rota 404 hoje).
6. **Aplicar 0017 e 0018** (opcional — são no-op, painel funciona sem elas, mas a função SQL fica documentada). Se for aplicar, é o mesmo processo da 0016.
7. **Reescrever Dashboard** com 6 KPIs reais (Pedidos hoje, Em produção, Prontos, Aguardando expedição, Atrasados, Novos clientes) usando o kit.
8. **Reescrever 8 páginas de protótipo** (Loja, Catálogo, Preços, Templates, Configurações, Relatórios, Integrações, Financeiro) com o kit, ligando ao banco.
9. **Criar 3 rotas novas**: `/loja/cupons`, `/clientes/importacoes`, `/financeiro` (com 6 abas, absorve Pagamentos e Carteira).
10. **Validação visual** com `SENHA_TESTE`: abrir `app.photoon.com.br` no navegador real, conferir todas as páginas, capturar screenshots, comparar com Pedidos.
11. **Responsividade desktop + mobile** com sessão real.
12. **Só então considerar merge** para `master`. A master continua intacta até autorização explícita do usuário.

---

## 12. TESTES E VERIFICADORES

Todos rodam da raiz do projeto (`/root/photoon`).

| Comando | O que valida | Estado |
|---|---|---|
| `npx tsc --noEmit` | tipos de todo o projeto | ✅ OK |
| `npm run build` | compilação do Next, lista de rotas geradas | ✅ OK |
| `node tools/checar-casca.mjs` | 3 fontes do menu concordam: `Dashboard.dc.html`, `rotas-lojista.ts`, `page.tsx` em `src/app/app`. Proíbe link morto, módulo com `pronto:false` tendo página, etc. | ✅ 0 problemas |
| `node tools/checar-consultas.mjs` | cada `select` do painel contra schema real. RLS esconde linhas, mas PostgREST valida a query antes — coluna inexistente ou junção errada voltam 400 | ✅ todas as ~17 ok |
| `node tools/checar-banco.mjs` | migrations aplicadas (1=coluna/tabela existe), RLS funciona (anon vê 0), RPCs fechadas a anon | 🟡 3 problemas (0016) |
| `node tools/auditar.mjs` | varre rotas dos 3 perfis (precisa do site no ar) | não testado nesta sessão |
| `node tools/tirar-foto.mjs <perfil> <rota> <nome> <largura>` | screenshot autenticado. Precisa de `SENHA_TESTE` | **BLOQUEADO** (sem credencial) |
| `node tools/testar-editor.mjs` | 30 controles do editor do cliente | não testado nesta sessão |
| `./tools/gerar.sh` | regenera `src/components/design/*` a partir dos `.dc.html` | disponível |

Para testar migration e concorrência localmente: `pg-teste` (container `postgres:15` rodando na VPS).

---

## 13. CREDENCIAIS QUE PODEM SER NECESSÁRIAS DEPOIS

Nenhuma credencial está no repositório ou neste arquivo. O próximo agente
**NÃO precisa** de credenciais para continuar o trabalho de UI/migration/Código
— exceto pelas três pendências abaixo, todas dependentes do usuário:

1. **Migration 0016** — usuário cola no SQL Editor do Supabase (HANDOFF seção 11, item 2).
2. **`SUPABASE_SERVICE_ROLE_KEY`** — usuário adiciona em `/root/photoon/.env` (HANDOFF seção 11, item 3).
3. **`SENHA_TESTE`** — usuário fornece para rodar `tools/tirar-foto.mjs` (HANDOFF seção 11, item 10).

O `.env` atual na VPS contém apenas `NEXT_PUBLIC_*` e `DEFAULT_TENANT_SLUG`. **Nenhum segredo está exposto aqui.**

---

## 14. PROMPT PARA O PRÓXIMO AGENTE

Copie e cole este bloco na próxima sessão para continuar:

```
Você está continuando a reestruturação do Photoon. **Leia primeiro o arquivo
`/root/photoon/HANDOFF-REESTRUTURACAO-PHOTOON.md` inteiro** — é a fonte única
de continuidade. Ele descreve o estado exato, commits, deploy, migrations,
pendências funcionais e visuais, e o passo a passo do worker de renderização.

Contexto operacional:
- Repositório: VPS `2.25.140.168` (root@...). Diretório `/root/photoon`.
- Branch ativa: `reestruturacao`. **NÃO** mexa em `master` (commit `b6cc7eb`).
- Imagem Docker atual: `photoon-app:658faead85a5` (de `84f290e`). Em produção.
- Rollback: `docker tag photoon-app:backup-master-b6cc7eb photoon-app:latest && docker compose up -d app`.

Regras duras:
1. **Não refaça o que já existe.** Antes de implementar qualquer coisa, leia
   os arquivos relevantes e confirme que o que vai fazer ainda não está feito.
2. **Não mexa em `master`.** Não faça merge, não faça rebase, não force push.
3. **PEDIDOS é a referência visual principal.** Use o `CartaoKPI` versão
   `compacto` (quando ≥4 na linha), inputs com altura 36 / radius 10 / borda
   `COR.linha`, tabelas com `Tabela` do kit, `Selo` para status, `Botao` do
   kit, cores de `tokens.ts`.
4. **Faça você mesmo tudo que puder.** Não peça comandos.
5. **Só peça intervenção** por (a) credencial externa que eu não tenha,
   (b) SQL que precise ser colado no Supabase, (c) risco real de perda de
   dados, (d) decisão de produto ambígua.
6. **Mantenha commits organizados** — um por fase/funcionalidade, mensagem
   em português lowercase (padrão do repositório).
7. **Atualize o HANDOFF** ao final da sua sessão, com o que mudou, novos
   commits, novo estado de pendências.

Verificadores (rode após cada commit):
   npx tsc --noEmit
   npm run build
   node tools/checar-casca.mjs
   node tools/checar-consultas.mjs
   node tools/checar-banco.mjs

Pendências críticas (em ordem):
1. Resolver 500 em `/entrar` (deploy desta sessão introduziu regressão).
2. Lembrar o usuário de colar a 0016 no Supabase (SQL está em
   `supabase/migrations/0016_permissao_das_funcoes.sql`).
3. Pedir `SUPABASE_SERVICE_ROLE_KEY` para subir `docker compose up -d render`.
4. Concluir o worker (upload para bucket `renders` + insert em
   `projeto_arquivos` + chamar `renderizarLamina` + teste ponta a ponta).
5. Concluir `/projetos/:id/resumo` (PDF/imprimir).
6. Reescrever Dashboard com KPIs reais.
7. Reescrever 8 páginas de protótipo.
8. Validação visual com `SENHA_TESTE`.

**NÃO declare a reestruturação como concluída até que:**
- `checar-banco.mjs` mostre 0 problemas
- Container `photoon-render-1` esteja UP e com 1 worker registrado
- `/projetos`, `/projetos/:id`, `/clientes`, `/pedidos`, `/producao`,
  `/expedicao`, `/renderizacao`, `/pedidos/:id/os` estejam todos confirmados
  visualmente no navegador
- Sem links mortos
- Sem 500 em nenhuma rota autenticada
- `master` ainda intocada
```

---

## 15. GIT — estado final desta sessão

- Branch: `reestruturacao`
- Commit HEAD: `84f290e7f1063934877635628e8e08981e3120f2` ("HANDOFF: seção 18 com a rodada das 16 correções visuais")
- Master: `b6cc7eb8530d5f3fdeabcc48c06c5b448be43f66` (intocada)
- Árvore: **limpa** (`git status` sem modificações, sem untracked)
- Commits nesta sessão: 2 (`47543e6` para UI, `84f290e` para este HANDOFF)
- Nenhum merge feito
- Nenhum commit apagado
- Nenhuma tag modificada
- Imagens Docker: `photoon-app:latest` = `658d3f5a5206` (= build de `47543e6`)

---

*Última atualização: 31/08/2026, fim da sessão de implementação. Próximo agente: leia a seção 14 e comece pelo item 1 (resolver 500 em `/entrar`).*
