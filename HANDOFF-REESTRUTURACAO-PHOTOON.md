# Handoff — reestruturação do Photoon

Documento de passagem para outra sessão do Claude Code continuar de onde este
trabalho parou, **sem precisar reler a conversa**.

Escrito em 31/08/2026, sobre o commit `2c6c7d7` da branch `reestruturacao`.

Documentos irmãos, que continuam valendo:
`ESTADO.md` (estado verificado do produto), `PLANO-REESTRUTURACAO.md`
(inventário e plano completo), `AUDITORIA.md`, `PLANO-PAGAMENTOS.md`.

---

## 1. Contexto do projeto

### Objetivo da reestruturação

Reorganizar o painel administrativo e a área do cliente do Photoon segundo um
briefing de 16 fases. Três exigências mandam em tudo:

1. **Não recriar a aplicação.** Preservar autenticação, banco, rotas e
   funcionalidades que continuam sendo usadas.
2. **Separar seis entidades que hoje se confundem** — visualmente, no banco e
   nas regras de negócio:

   ```
   CLIENTE → PROJETO → PEDIDO → RENDERIZAÇÃO → PRODUÇÃO → EXPEDIÇÃO
   ```

   Um projeto existe sem pedido. Um pedido tem vários projetos. Um projeto tem
   vários arquivos, várias versões e vários jobs de renderização.
3. **Nada de dado fictício.** Tela sem dado explica o que falta; nunca mostra
   exemplo inventado.

### Arquitetura

SaaS multi-inquilino de álbuns de foto, com três painéis no mesmo app Next,
separados por host e reescritos pelo middleware:

| Host | Quem | Onde vive |
|---|---|---|
| `admin.photoon.com.br` | dono da plataforma | `src/app/admin/**` |
| `app.photoon.com.br` | lojista (estúdio) | `src/app/app/**` |
| `<loja>.photoon.com.br` | cliente final | `src/app/**` (raiz) |

O visitante vê `app.photoon.com.br/pedidos`; o Next resolve `/app/pedidos`.
Isso está em `src/middleware.ts` e `src/lib/tenant.ts`.

### Stack

Next.js 15 (App Router) · React 19 · Supabase (`@supabase/ssr`) · Tailwind 3.4
· `sharp` (render 300 dpi) · `@vladmandic/face-api` (rostos, no navegador) ·
`zod` · TypeScript 5.6.

### Banco

Supabase `whsrcrqyoblulpqsjxmq`, externo. 16 migrações em
`supabase/migrations/`. RLS por loja em todas as tabelas, apoiada em auxiliares
do schema `private` (que o PostgREST não expõe): `private.is_membro_do_lojista`,
`private.meus_clientes`, `private.is_cliente_do_lojista`, `private.is_super_admin`.

### Ambiente

- **VPS** `2.25.140.168` (`srv1934934`), 4 vCPU / 16 GB / 200 GB NVMe.
  Roda Next + Caddy em Docker.
- **GitHub** `photoon-dev/photoon`.
- O `.env` **não** está no Git e contém apenas `NEXT_PUBLIC_*` e
  `DEFAULT_TENANT_SLUG`. **Não há `SUPABASE_SERVICE_ROLE_KEY` nem string de
  conexão do Postgres neste ambiente** — ver seção 12 e 14.

### Branch

```
reestruturacao   ← todo o trabalho está aqui
master           ← intocada
```

**Não fazer merge na master.** O usuário pediu isso explicitamente e mais de
uma vez. Não faça merge, não faça rebase sobre a master, não faça push que
altere a master.

---

## 2. Estado atual

**Fase 7 concluída. A próxima é a Fase 8.**

| Fase | Assunto | Estado |
|---|---|---|
| 1 | Inventário | ✅ concluída |
| 2 | Plano de migração | ✅ concluída |
| 3 | Retirar módulos eliminados | ✅ concluída (transição, ver 7) |
| 4 | App Shell e menu | ✅ concluída |
| 5 | Central de Projetos | ✅ concluída |
| 6 | Detalhe do Projeto | ✅ concluída |
| 7 | Central de Renderização | ✅ concluída (worker sem credencial) |
| 8 | Pedidos e relação Pedido × Projeto | ⬜ não iniciada |
| 9 | Produção | ⬜ não iniciada |
| 10 | Expedição | ⬜ não iniciada |
| 11–16 | Templates, Financeiro, Configurações, Relatórios, área do cliente, fluxo ponta a ponta | ⬜ não iniciadas |

### Parcialmente concluído

- **Worker de renderização** (`tools/worker-render.ts`): escrito, com sintaxe
  verificada e o serviço `render` já no `docker-compose.yml`. **Nunca executou**
  — precisa de `SUPABASE_SERVICE_ROLE_KEY`. A etapa de renderização em si é uma
  máquina de estados completa com um ponto marcado onde `renderizarLamina` de
  `src/lib/impressao.ts` entra.
- **Migração 0016**: escrita, testada em Postgres local, **não aplicada no
  Supabase**. Fecha uma vulnerabilidade real — ver seção 6.
- **As 12 telas de protótipo** (Loja, Catálogo, Preços, Integrações,
  Relatórios, CRM, Vendedores, Marketing, Carteira, Pagamentos, Auditoria,
  Suporte) continuam com conteúdo do protótipo. Já passam pela casca única e
  pelo menu novo, mas o conteúdo não está ligado ao banco.

---

## 3. Commits da branch `reestruturacao`

Em ordem, do mais antigo para o mais novo:

| Hash | Descrição |
|---|---|
| `9f594da` | Expedição e Galeria: trabalho em andamento **antes** da reestruturação |
| `72c7321` | Fases 1 e 2: inventário do projeto e plano de migração |
| `77d4700` | Fase 4: o gerador recorta só o conteúdo, e a casca vira uma só |
| `11edc23` | Fase 4: menu novo, 17 itens em 6 grupos, com uma fonte única |
| `bb60923` | Fase 4: as 20 telas passam pela casca única |
| `44bf499` | Fase 3: Suporte sai do menu e vira o botão Ajuda |
| `c62d349` | Fase 4: kit de componentes compartilhados |
| `29e8bdd` | Fase 4: migração 0014 — filiais e códigos amigáveis |
| `6e79f5c` | Fase 4: checagem automática da casca |
| `5016b2f` | Fase 4: verificador de estrutura do banco sem credencial privilegiada |
| `8b14806` | Fase 4: código de projeto e número de pedido passam a ser atômicos |
| `c7e6a01` | Fases 5 a 10: migração 0015 — projeto, renderização, produção, expedição |
| `52ba42e` | Fase 5: Central de Projetos em `/projetos` |
| `a6ae4d8` | Fase 5: 0016 — os revokes da 0015 não surtiam efeito |
| `57a06dd` | Fase 6: detalhe administrativo do projeto em `/projetos/:id` |
| `2c6c7d7` | Fase 7: Central de Renderização, com fila fora da requisição HTTP |

**Sobre `9f594da`:** é o trabalho que já estava na árvore (Expedição e Galeria)
quando a reestruturação começou, commitado à parte a pedido do usuário. Cinco
dos arquivos foram **reconstruídos** revertendo edições que já tinham sido
feitas por cima deles; o usuário revisou e aprovou manter assim.

---

## 4. Fases concluídas, em detalhe

### Fase 1 e 2 — inventário e plano

Nenhum código alterado. Produziu `PLANO-REESTRUTURACAO.md`. Três achados que
mudaram a ordem do briefing:

- **Não existia App Shell único**: 22 cópias da mesma sidebar, uma por
  `.dc.html`.
- **"Carteira" não era carteira**: `carteiraDaLoja()` é extrato de
  recebimentos, não saldo de crédito por cliente. São funcionalidades
  diferentes e ambas cabem em Financeiro.
- **Filial não existia** em lugar nenhum, e é citada em 6 telas.

Por isso filiais e a casca entraram na Fase 4, antes de Projetos.

### Fase 3 — retirar módulos

Regra 17 do briefing: migrar a funcionalidade primeiro, remover a página
depois. **Nenhuma tabela foi apagada.**

- **Suporte** saiu do menu e virou o botão **Ajuda** na topbar +
  `/ajuda` (`src/app/app/ajuda/page.tsx`, `src/components/app/PainelAjuda.tsx`).
  Três blocos de dado real: contato da Photoon (do ambiente), canais que a loja
  publica (do banco) e quantas mensagens os clientes abriram.
- **CRM, Marketing, Vendedores, Carteira, Pagamentos, Auditoria** saíram do
  menu e continuam respondendo, com uma faixa (`AvisoRotaLegada`) dizendo para
  onde a funcionalidade vai. Ver seção 7.
- **Automações** já era link morto (item 15 do menu, sem rota) e sumiu.

### Fase 4 — App Shell, menu, kit e banco

**A casca virou uma só.** `tools/dc2tsx.py` ganhou o modo `somenteConteudo`
(ligado por `tools/telas/conteudo.json`): descarta tudo entre `<aside>` e
`</header>` e devolve só o miolo do `<main>`. As 19 telas do painel viraram
conteúdo puro e `src/components/design/ShellLojistaDesign.tsx` é o **único
componente com menu**. Pedidos caiu de 678 para 305 linhas.

Dois defeitos apareceram e foram corrigidos **no gerador**, não à mão:

- `Pedidos.dc.html` abre uma `<div>` dentro do `<main>` que só fecha depois de
  `</main>`. Inofensivo no documento inteiro, fatal num recorte. A função
  `equilibrar()` fecha o que sobra e avisa em qual arquivo.
- Uma troca de `tools/telas/dashboard.json` nunca casava (um `alignItems` no
  meio da string), então a classe responsiva do cabeçalho da tabela do
  Dashboard **nunca havia sido aplicada**.

**Menu novo**, 17 itens em 6 grupos, escrito uma vez em
`design/extraido/Dashboard.dc.html`. `src/lib/rotas-lojista.ts` é a fonte
única: gera `ROTAS_LOJISTA`, o mapa `MODULO` (fim dos `ativo={9}` mágicos) e
alimenta o menu de celular, que tinha seis itens sem destino.

**Kit compartilhado** em `src/components/ui/`: `tokens.ts`, `Tabela`,
`BarraDeFiltros`, `useFiltrosNaURL`, `Paginacao`, `Modal` (serve de caixa e de
gaveta), `Confirmacao`, `Selo`, `CartaoKPI`, `EstadoVazio`, `Botao`, e mais
tarde `Abas` e `Ficha`.

**Uma consulta a menos por página**: `molduraDaLoja()` era chamada pela página
e de novo pela moldura, e `numerosDaLoja` lê 200 projetos.

Migrações **0014** e **0016** nasceram aqui. Ver seção 5.

### Fase 5 — Central de Projetos

Rota `/projetos`. Arquivos: `src/lib/projetos-termos.ts`, `src/lib/projetos.ts`,
`src/components/app/ProjetosDaLoja.tsx`, `src/app/app/projetos/page.tsx`.
Detalhe na seção 8.

### Fase 6 — Detalhe do Projeto

Rota `/projetos/:id`, seis abas. Arquivos:
`src/components/app/ProjetoDetalhe.tsx`, `src/app/app/projetos/[id]/page.tsx`,
mais `src/components/ui/Abas.tsx` e `src/components/ui/Ficha.tsx`.
Detalhe na seção 9.

### Fase 7 — Central de Renderização

Rotas `/renderizacao` e `/renderizacao/:id`. Arquivos:
`src/lib/render-termos.ts`, `src/lib/render.ts`,
`src/app/app/actions-render.ts`, `src/components/app/RenderizacaoDaLoja.tsx`,
`src/components/app/JobDetalhe.tsx`, `tools/worker-render.ts`.
Detalhe na seção 10.

---

## 5. Banco de dados

### Migração 0014 — `0014_filiais_e_codigos.sql` · **APLICADA** ✅

**Tabela nova:** `public.filiais` (id, lojista_id, nome, cnpj, endereco jsonb,
responsavel, telefone, email, produz, retirada, padrao, ativo, criado_em,
atualizado_em).

**Colunas novas (7):**

| Tabela | Coluna |
|---|---|
| `pedidos` | `filial_id` uuid → filiais, `on delete set null` |
| `pedidos` | `codigo` — **coluna gerada** `'PT-' \|\| numero` |
| `projetos` | `filial_id` |
| `projetos` | `codigo` text, preenchida por trigger |
| `clientes` | `filial_id` |
| `vendedores` | `filial_id` |
| `producao` | `filial_id` |

**Triggers (3):** `filiais_touch` (atualizado_em), `lojistas_filial_padrao`
(loja nova ganha "Matriz"), `projetos_codigo` (projeto novo ganha código).

**Funções:** `criar_filial_padrao`, `letra_do_produto`,
`proximo_codigo_projeto`, `projeto_recebe_codigo`, e (na versão final)
`private.proximo_sequencial` + `public.proximo_numero_pedido` reescrita.

**Índices (8):** `filiais_loja_idx`, `filiais_padrao_por_loja` (único parcial —
uma padrão por loja), `pedidos_filial_idx`, `projetos_filial_idx`,
`clientes_filial_idx`, `projetos_codigo_por_loja` (único),
`pedidos_codigo_idx`, `projetos_titulo_busca` (GIN).

**RLS/policies:** `filiais_equipe` (for all, equipe ou super admin) e
`filiais_do_cliente` (for select, filial ativa da loja do cliente — alimenta a
escolha de retirada). Nenhuma policy existente foi alterada.

### Códigos amigáveis e sequências

- **Projeto:** letra do tipo + 7 dígitos (`L4512367`). L = fotolivro,
  R = revelação, F = fotoproduto, P = outros. Sequencial **por loja**, não por
  categoria. Começa em 4.500.001.
- **Pedido:** `PT-` + o `numero` que já existia. Coluna gerada, nada a migrar,
  nenhum pedido mudou de número.
- **O UUID continua sendo a chave primária.** O código é coluna única indexada.

**Atomicidade.** `max(...) + 1` tinha corrida: entre o SELECT e o INSERT, outra
transação lê o mesmo máximo. Medido num Postgres 15 local com 40 inserções
simultâneas em 40 conexões:

```
versão antiga (max+1)   37 de 40 morreram com duplicate key; 3 nasceram
contador                40 de 40, L4500001..L4500040, zero colisão
```

A solução é `private.loja_sequencias` (lojista_id, escopo, valor) +
`private.proximo_sequencial`, que usa `update ... returning` — isso tranca a
**linha** do contador, então duas transações entram em fila e saem com valores
diferentes. Vale mesmo em transações separadas, que é o caso de um RPC pelo
PostgREST (onde um advisory lock seria solto ao retornar, reabrindo a corrida).

Uma `SEQUENCE` do Postgres **não** serviria: é não-transacional e pula número
quando a transação aborta. Verificado que o contador volta atrás junto com o
insert.

### Migração 0015 — `0015_projeto_render_producao.sql` · **APLICADA** ✅

Cobre as Fases 5 a 10 de uma vez. Aditiva e idempotente (verificado: aplica
três vezes seguidas sem erro).

**`projetos.status` deixou de ser enum e virou texto com CHECK.** Motivo:
`alter type ... add value` não roda dentro de transação em todo servidor e o
valor novo não pode ser usado na mesma transação em que nasce — quebraria o
arquivo no meio. Os cinco valores antigos continuam válidos; nenhuma linha
mudou. Valores aceitos: `nao_iniciado`, `em_edicao`, `com_pendencias`,
`pronto`, `finalizado`, `aguardando_cliente`, `fechado`, `em_renderizacao`,
`renderizado`, `com_erro`, `arquivado`.

**Tabelas novas (8):**

| Tabela | Para quê |
|---|---|
| `projeto_arquivos` | originais, renderizados, previews, auxiliares. `removido_em` marca a saída — regra 14, nada some em silêncio |
| `projeto_versoes` | `paginas` jsonb guarda o documento inteiro daquele momento |
| `projeto_validacoes` | pré-flight, **uma linha por problema** (a Central conta sem abrir cada documento) |
| `render_jobs` | a fila. Aponta para o PROJETO; `pedido_id` é opcional |
| `render_logs` | log técnico por job |
| `render_workers` | quem está vivo |
| `producao_historico` | preenchido por trigger — regra 12 |
| `eventos` | o que sobrou de Automações, sem interface |

**Colunas novas em `projetos` (13):** `criado_por`, `fechado_em`,
`finalizado_em`, `arquivado_em` (soft delete), `bytes_total`, `capa_tipo`,
`dorso_mm`, `formato_aberto`, `formato_fechado`, `largura_mm`, `altura_mm`,
`fotos_enviadas`, `fotos_usadas`.

**Colunas novas em `expedicao` (11):** `modalidade`, `volumes`, `peso_kg`,
`largura_cm`, `altura_cm`, `profundidade_cm`, `coleta_em`, `previsao_em`,
`sla_dias`, `responsavel`, `etiqueta_url`.

**`producao`:** etapas 5 → 10 aceitas no CHECK (as cinco antigas mais
`aguardando`, `preflight`, `arquivos_prontos`, `qualidade`, `embalagem`), mais
`prioridade` e `entrou_na_etapa_em`.

**Triggers novos:** `render_jobs_touch`, `producao_historico_ins` (after
insert), `producao_historico_upd` (before update — também atualiza
`entrou_na_etapa_em`).

**Função nova:** `public.projetos_busca(loja uuid, termo text) returns setof
uuid` — a busca universal. Ver seção 8.

**Storage:** bucket **privado** `renders`, com policy `renders_da_equipe`
exigindo que a **primeira pasta do caminho seja o id de uma loja de que o
usuário é membro** (regra 19). Nada de URL pública permanente — o app assina na
hora, por 1 h (`urlAssinada` em `src/lib/projetos.ts`).

**RLS:** todas as 8 tabelas novas com RLS ligada. Policies `<tabela>_equipe`
para as que têm `lojista_id`; `render_logs` e `producao_historico` herdam da
linha-pai; `render_workers` é leitura livre (é da plataforma, não de uma loja);
o cliente lê `projeto_arquivos` e `render_jobs` do próprio projeto e não
escreve em nenhum.

### Migração 0016 — `0016_permissao_das_funcoes.sql` · **NÃO APLICADA** ⚠️

**Esta é a pendência de banco mais importante.** Ver seção 6.

---

## 6. Segurança

### Vulnerabilidade encontrada — EXECUTE / PUBLIC

**O problema.** `public.lojistas` tem leitura pública (a vitrine precisa
disso), então o id de qualquer loja é descobrível por qualquer visitante. E o
PostgREST expõe como RPC **toda função do schema `public`**.

Enquanto `proximo_numero_pedido` era um `max(numero)+1` puro, chamá-la não
fazia mal — só devolvia um número. Depois da 0014 ela **consome** da sequência:
um visitante sem conta poderia chamá-la em laço e empurrar a numeração de
pedidos de uma loja para onde quisesse.

**A primeira correção não funcionou.** A 0015 tentou fechar com
`revoke execute ... from anon, authenticated`. Medido contra o banco real
depois de aplicada:

```
rpc proximo_numero_pedido   -> HTTP 409  (passou pela permissão)
rpc proximo_codigo_projeto  -> HTTP 409  (passou pela permissão)
rpc projetos_busca          -> HTTP 200  (anon executou)
```

**Causa:** no Postgres toda função nasce com EXECUTE concedido a **PUBLIC**.
`anon` e `authenticated` nunca tiveram concessão direta, então não havia o que
revogar deles — continuavam executando pela herança. A ACL confirmava:
`=X/postgres`, com o grantee vazio, que é PUBLIC.

**A correção certa está na 0016**, testada papel a papel num Postgres local:

```
anon           barrado na sequência e na busca
authenticated  barrado na sequência, chama a busca (o painel precisa)
triggers       continuam atribuindo código — são security definer, e o
               privilégio é checado ao criar o trigger, não ao dispará-lo
40 inserções simultâneas como authenticated: 40 códigos distintos, zero colisão
```

A 0016 também fecha o padrão com `alter default privileges ... revoke execute
on functions from public`, senão a próxima função criada nasce aberta de novo.

**Estado: pendente de aplicação no Supabase.** Enquanto não for aplicada, o
`tools/checar-banco.mjs` acusa 3 problemas — é o sinal esperado.

### Funções que não podem ficar expostas

`proximo_numero_pedido`, `proximo_codigo_projeto`, `projeto_recebe_codigo`,
`pedido_recebe_numero`, `criar_filial_padrao`, `producao_registra_troca`,
`private.proximo_sequencial` — nenhuma delas deve ser chamável de fora. Os
triggers não precisam do privilégio.

`projetos_busca` fica disponível a `authenticated` (o painel usa) e **não** a
`anon`.

### Isolamento entre lojistas

- Toda tabela tem RLS por loja via `private.is_membro_do_lojista(lojista_id)`.
- Toda consulta do painel **também** filtra `.eq('lojista_id', …)`
  explicitamente, porque a mesma conta pode ser membro de mais de uma loja e o
  painel mostra uma de cada vez. Isso é defesa em profundidade: mesmo que a
  função de busca devolvesse ids de outra loja, eles não passariam.
- Storage: o caminho começa pelo id da loja e a policy verifica a primeira
  pasta.

**Verificado no banco real:** `anon` vê 0 linhas em `filiais`, `projetos`,
`pedidos`, `clientes`, `render_jobs`, `projeto_arquivos` e `eventos`.

**Verificado no banco real:** a `projetos_busca` implantada **filtra por loja**
(loja inexistente devolve 0, loja real devolve 3). O usuário editou o SQL antes
de executar — removeu o que julgou ser um `WHERE` duplicado — e a edição **não**
removeu o filtro de inquilino.

### Impersonation

Não existe e não está planejada. Se for pedida, precisa nascer com registro em
`auditoria` e escopo explícito — hoje não há nada disso.

### Pendências de segurança fora do escopo desta reestruturação

- A senha das contas de teste circulou em texto puro no chat e **precisa ser
  trocada antes de produção** (registrado no `ESTADO.md`).
- `src/lib/cripto.ts` existe e **nunca foi verificado**. Credencial de gateway
  de pagamento não pode ficar em texto puro. Verificar antes de qualquer tela
  de Pagamentos ir ao ar.

---

## 7. Rotas e menu

### Menu final — 17 itens em 6 grupos

Fonte única: `src/lib/rotas-lojista.ts` (`MENU_LOJISTA`), casado por índice com
`pick<n>` de `design/extraido/Dashboard.dc.html`.

| # | Item | Rota | Estado |
|---|---|---|---|
| 0 | Dashboard | `/` | ativo |
| 1 | Pedidos | `/pedidos` | ativo |
| 2 | Projetos | `/projetos` | ativo |
| 3 | Produção | `/producao` | ativo |
| 4 | Renderização | `/renderizacao` | ativo |
| 5 | Expedição | `/expedicao` | ativo |
| 6 | Loja | `/loja` | ativo |
| 7 | Catálogo | `/catalogo` | ativo |
| 8 | Preços | `/precos` | ativo |
| 9 | Templates e Design | `/templates` | ativo |
| 10 | Cupons | `/loja/cupons` | **esmaecido** |
| 11 | Clientes | `/clientes` | ativo |
| 12 | Importações | `/clientes/importacoes` | **esmaecido** |
| 13 | Financeiro | `/financeiro` | **esmaecido** |
| 14 | Relatórios | `/relatorios` | ativo |
| 15 | Integrações | `/integracoes` | ativo |
| 16 | Configurações | `/configuracoes` | ativo |

**Esmaecido** = `pronto: false` em `MENU_LOJISTA`. O item aparece cinza e não
navega — em vez de virar link morto. Quando a tela nascer, virar `pronto: true`.

Fora do menu, na topbar: **Ajuda** → `/ajuda`.

### Páginas de transição (fora do menu, ainda de pé)

`ROTAS_LEGADAS` em `src/lib/rotas-lojista.ts` guarda o destino e um `migrado`.
Cada uma responde com a faixa `AvisoRotaLegada`, que só oferece o botão quando
o destino já existe.

| Rota antiga | Vai para | Destino pronto? |
|---|---|---|
| `/crm` | ficha do cliente (`/clientes`) | sim |
| `/marketing` | `/loja/cupons` + Configurações > Comunicação | não |
| `/vendedores` | `/configuracoes?aba=equipe` | sim (a aba, não) |
| `/carteira` | `/financeiro?aba=carteira` | não |
| `/pagamentos` | `/financeiro` | não |
| `/auditoria` | `/configuracoes?aba=auditoria` | sim (a aba, não) |
| `/suporte` | `/ajuda` | sim |

**Regra:** só apagar a página antiga quando a funcionalidade estiver de fato no
destino. Aí virar `migrado: true` e trocar a página por um redirect.

### Rotas que ainda faltam

`/loja/cupons` · `/clientes/importacoes` · `/financeiro` ·
`/pedidos/:id/os` (ordem de serviço) · `/projetos/:id/resumo` (o botão
"Resumo" já aponta para lá e hoje dá 404) · `/conta/pedidos` e
`/conta/pedidos/:id` na área do cliente.

---

## 8. Fase 5 — Central de Projetos

**Estado: concluída e verificada.** Rota `/projetos`, item de menu ativo.

### Arquivos

- `src/lib/projetos-termos.ts` — vocabulário sem `next/headers` (as telas são
  componentes de navegador). Os 11 status com rótulo e tom, os 11 estados de
  render, `laminas()`, `tamanho()`, `dataCurta()`, `dataHora()`.
- `src/lib/projetos.ts` — `listarProjetos`, `pedidoDosProjetos`,
  `renderDosProjetos`, `cardsDeProjetos`, `opcoesDeFiltro`, e (Fase 6)
  `getProjeto`, `urlAssinada`.
- `src/components/app/ProjetosDaLoja.tsx` — a tela, sobre o kit.
- `src/app/app/projetos/page.tsx` — a rota.

**Não há `Projetos.dc.html` no design.** A tela foi montada com o kit
(`src/components/ui`), que usa os mesmos valores do Design System das telas
transliteradas. Preferiu-se isso a inventar um `.dc.html` que ninguém desenhou.

### Consultas

Tudo parte de `projetos`, nunca de `pedidos`. O pedido entra por
`pedido_itens.projeto_id` numa consulta separada, pelos ids da página — é o que
permite um pedido ter vários projetos e um projeto existir sem nenhum.

### Cartões

Projetos abertos · Aguardando finalização · Finalizados hoje · Com problemas ·
Sem pedido · Armazenamento.

### Filtros (12, todos na URL)

busca · status · cliente · produto · filial · criadoDe · criadoAte · editadoDe ·
pedido (com/sem) · capa (com/sem) · render · arquivados. Mais ordenação por
6 colunas e paginação de 25.

`useFiltrosNaURL` guarda tudo em query string: o link de "com erro, da filial
Centro" é guardável e o botão de voltar funciona.

### Busca universal

Um campo só que acha por **código, nome do projeto, cliente, e-mail, pedido ou
produto**. Isso é um OU entre colunas de tabelas diferentes, e **o PostgREST
não monta `or` atravessando um recurso embutido** — dois `.or()` viram um E e
devolvem quase nada. Resolvido pela função `projetos_busca` no banco, que
devolve ids; a consulta principal continua paginando com `.in('id', ids)`.

### Problemas corrigidos durante a fase

1. A busca fazia **E** em vez de **OU** (acima).
2. O cartão "sem pedido" subtraía contagens, e `pedido_itens` também aponta
   para projeto arquivado, que não entra no total de vivos. Virou diferença de
   conjuntos.
3. `tools/checar-casca.mjs` pegou um terceiro: o alinhamento de coluna em
   `rotas-lojista.ts` fez o próprio verificador perder um item do menu. A regex
   passou a tolerar espaçamento.

### Dependências da 0015

`arquivado_em`, `bytes_total`, `fotos_enviadas`, `fotos_usadas` e a função
`projetos_busca`. Sem a 0015 a tela mostra o estado de erro da `Tabela` com a
frase "esta tela precisa da migração 0015" — em vez de lista vazia, que faria
concluir que não há projeto nenhum. **A 0015 está aplicada, então isso não
acontece mais.**

---

## 9. Fase 6 — Detalhe do Projeto

**Estado: concluída e verificada.** Rota `/projetos/:id`.

### Abas (6)

| Aba | Lê de | Estado vazio |
|---|---|---|
| Resumo | `projetos` + `filiais` + `galerias` + `clientes` | — |
| Capa | `projetos.capa_url/capa_tipo/dorso_mm` + arquivos com "capa" no nome | "Este projeto está sem uma capa ativa" |
| Arquivos | `projeto_arquivos` | explica que nascem do envio e da renderização |
| Validação | `projeto_validacoes` | explica que o pré-flight roda antes da renderização |
| Histórico | `projeto_eventos` **+** `render_jobs`, mesclados e ordenados | explica o que a timeline guarda |
| Versões | `projeto_versoes` | explica quando uma versão é gravada |

A aba ativa fica na URL (`?aba=arquivos`).

### Consultas

`getProjeto(lojistaId, id)` traz tudo numa ida só — trocar de aba não vai ao
banco de novo. As seis leituras são paralelas.

### Componentes novos no kit

`Abas` (contagem no rótulo só quando há o que olhar) e `Ficha` + `Campo` (campo
vazio diz "—", não some: rótulo ausente faz pensar que o dado não existe no
sistema).

### Problema corrigido

`tools/checar-consultas.mjs` — criado nesta fase — pegou na estreia que a
consulta usava `galerias.titulo`, e a coluna chama-se `nome`.

### O que ainda falta na Fase 6

- **`/projetos/:id/resumo`** não existe. O botão "Resumo" no cabeçalho aponta
  para lá e hoje dá 404. O briefing pede: código, cliente, produto, pedido,
  formato, páginas, fotos, miniatura da capa, miniaturas de todas as páginas,
  características técnicas, e para revelação a lista de fotos com papel e
  acabamento. Mais botões Imprimir / Gerar PDF / Baixar PDF.
- **Ações do cabeçalho que ainda não existem:** Abrir projeto, Visualizar,
  Reabrir, Duplicar, Baixar arquivos, Arquivar. Só "Renderizar", "Resumo" e
  "Ver pedido" estão ligados.
- **Restaurar versão** (com confirmação) não está implementado.
- **Download de arquivo** — `urlAssinada()` existe em `src/lib/projetos.ts` e
  ainda não está ligada a nenhum botão.

---

## 10. Fase 7 — Central de Renderização

**Estado: telas concluídas e verificadas. Worker escrito e nunca executado.**

### Rotas

- `/renderizacao` — 6 cartões, estado do serviço, filtros, tabela com barra de
  progresso, reprocessar e cancelar.
- `/renderizacao/:id` — régua das sete etapas, ficha do job, bloco de erro com
  a stack atrás de um `<details>`, arquivos gerados, log técnico.

### Arquivos

`src/lib/render-termos.ts` · `src/lib/render.ts` ·
`src/app/app/actions-render.ts` · `src/components/app/RenderizacaoDaLoja.tsx` ·
`src/components/app/JobDetalhe.tsx` · `src/app/app/renderizacao/page.tsx` ·
`src/app/app/renderizacao/[id]/page.tsx` · `tools/worker-render.ts`.

### Ações (`actions-render.ts`)

- `enfileirarProjeto(projetoId, pedidoId?)` — cria o job em `na_fila`. Recusa
  se já houver um em andamento para o mesmo projeto: dois workers escrevendo o
  mesmo arquivo é como um PDF sai pela metade.
- `reprocessar(jobId)` — cria job **novo** com `tentativa` somada, em vez de
  reabrir o antigo (regra 32): apagar a falha apagaria a informação de que ela
  existiu.
- `cancelarJob(jobId, motivo)` — só nos estados canceláveis; exige motivo, que
  vai para `render_logs`.

Nenhuma delas renderiza nada. Regra 9: renderização pesada não roda dentro da
requisição HTTP.

### Três decisões que valem lembrar

- **"Online" é medido, não declarado:** worker sem sinal há dois minutos
  aparece offline, mesmo que a coluna `estado` diga outra coisa — processo
  morto não atualiza a própria linha.
- **Tempo médio é mediana, não média:** um job travado de duas horas puxaria a
  média para um número que não descreve nenhuma renderização real.
- A tela não executa renderização; ela lê a fila e enfileira.

### Worker — `tools/worker-render.ts`

Roda com `node --experimental-strip-types tools/worker-render.ts` (Node 22.23
neste ambiente; type stripping verificado). Serviço `render` já está no
`docker-compose.yml`, em container separado do `app`.

**Reivindicação sem colisão:**

```sql
update render_jobs set estado='preparando'
 where id = <o mais antigo da fila> and estado = 'na_fila'
```

O `and estado = 'na_fila'` é a trava: o segundo worker atualiza zero linhas e
volta para a fila. Sem lock, sem fila de espera, sem job duplicado.

SIGINT/SIGTERM não matam o job no meio — marcam a saída e deixam o atual
terminar.

### O que falta no worker

1. **`SUPABASE_SERVICE_ROLE_KEY`.** É a única peça do sistema que atravessa
   lojas, e a RLS é por sessão de usuário. Sem a chave ele sobe, diz exatamente
   o que falta e sai com código 1. **Credencial que não existe neste ambiente.**
2. **A renderização de verdade.** A máquina de estados está completa e há um
   ponto marcado na etapa `renderizacao` onde `renderizarLamina` de
   `src/lib/impressao.ts` entra. `impressao.ts` é puro (só `sharp` e libs
   locais, sem `next/headers`), então pode ser importado direto.
3. **Upload para o bucket `renders`** — o caminho tem de começar pelo id da
   loja (`renders/<lojista_id>/<projeto_id>/...`), senão a policy barra.
4. **Escrever em `projeto_arquivos`** ao fim do upload, com `checksum` e
   `bytes`.

---

## 11. Fases 8, 9 e 10 — o que falta

### Fase 8 — Pedidos e relação Pedido × Projeto

**Banco: pronto.** Nada a migrar. `pedido_itens.projeto_id` já existe e a 0015
criou `pedido_itens_projeto_idx`.

**Arquivos que provavelmente mudam:**
`src/lib/pedidos.ts`, `src/lib/pedidos-termos.ts`,
`src/components/app/PedidoDoDesign.tsx`, `src/components/app/PedidosDoDesign.tsx`,
`src/app/app/pedidos/page.tsx`, `src/app/app/pedidos/[id]/page.tsx`,
`design/extraido/Pedidos.dc.html` e `Pedido.dc.html` (lembrar:
`src/components/design/*` é **gerado**, editar o `.dc.html` e rodar
`./tools/gerar.sh telas`).

**O que fazer:**

1. **Aba Projetos no detalhe do pedido** — é o item mais importante da fase.
   Tabela com Projeto, Produto, Formato, Páginas, Status, Renderização e ações.
   Um pedido pode ter vários projetos.
2. Reorganizar o detalhe em 7 abas: Resumo, Projetos, Pagamento, Produção,
   Entrega, Arquivos, Histórico.
3. Ampliar os filtros da lista (o briefing lista ~15, incluindo filial, canal,
   status de pagamento, de produção e de entrega).
4. Ações em massa: confirmar pagamento, enviar para produção, alterar status,
   adicionar ao lote, gerar OS, gerar etiqueta, exportar.
5. **`/pedidos/:id/os`** — ordem de serviço, layout de impressão, com QR Code e
   código de barras. Molde: a etiqueta de expedição, que já imprime com o
   endereço real do banco.
6. Botão "Renderizar" no pedido, que enfileira **todos** os projetos dele
   (`enfileirarProjeto` já existe e aceita `pedidoId`).

**Critério de conclusão:** abrir um pedido com dois projetos e ver os dois,
cada um com seu status de renderização e link para `/projetos/:id`; gerar a OS.

### Fase 9 — Produção

**Banco: pronto.** A 0015 já criou as 10 etapas aceitas, `producao_historico`
(preenchido por trigger), `prioridade` e `entrou_na_etapa_em`.

**Arquivos:** `src/components/app/ProducaoDoDesign.tsx`,
`src/app/app/producao/page.tsx`, `src/app/app/actions-pedidos.ts`,
`design/extraido/Producao.dc.html`.

**O que fazer:**

1. Kanban de 8 estágios: Aguardando, Pré-flight, Arquivos prontos, Impressão,
   Acabamento, Qualidade, Embalagem, Pronto. Hoje são 5.
2. **Card de Renderização** com "N na fila / N com erro" e botão "Abrir Central
   de Renderização". *A Produção nunca teve fila de renderização ligada — as
   colunas do design nunca existiram no banco —, então não há o que remover.*
3. Card do pedido no kanban: Pedido, Cliente, Produto, Projeto, Prazo,
   Prioridade, **Tempo no estágio** (usar `entrou_na_etapa_em`).
4. Ações: mover estágio, abrir pedido, abrir projeto, gerar OS, adicionar
   observação.
5. O histórico já é gravado pelo trigger — a tela só precisa mostrá-lo.

**Critério de conclusão:** arrastar um pedido entre os 8 estágios e ver a
transição registrada em `producao_historico` sem nenhuma escrita explícita da
tela.

### Fase 10 — Expedição

**Banco: pronto.** A 0015 já criou as 11 colunas e os 11 estados aceitos.

**Arquivos:** `src/components/app/ExpedicaoDoDesign.tsx`,
`src/app/app/expedicao/page.tsx`, `src/lib/rastreio.ts`,
`design/extraido/Expedicao.dc.html`.

**Atenção:** esta tela recebeu trabalho substancial **antes** da reestruturação
(commit `9f594da`): estação de embalagem, abas por recorte real, etiqueta com
endereço do banco. **Ampliar, não reescrever.**

**O que fazer:**

1. Ligar os campos novos: modalidade, volumes, peso, dimensões, data de coleta,
   previsão, SLA, responsável.
2. Os 8 estados do briefing (Aguardando embalagem, Pronto para envio, Etiqueta
   gerada, Aguardando coleta, Em trânsito, Entregue, Problema na entrega,
   Retornado) — o CHECK já os aceita.
3. Ações: gerar etiqueta, imprimir etiqueta, informar rastreio, marcar coleta,
   marcar entregue. Gravar em `etiqueta_url`.
4. `src/lib/rastreio.ts` já existe (veio do trabalho anterior) — conferir antes
   de escrever qualquer integração de transportadora.

**Critério de conclusão:** um envio percorre os 8 estados, gera etiqueta e
registra rastreio, tudo com dado do banco.

### Ordem recomendada

8 → 9 → 10, na ordem do usuário. Fase 8 primeiro porque a relação Pedido ×
Projeto é o que amarra as duas entidades centrais, e as Fases 9 e 10 leem dela.

---

## 12. Deploy

### Como roda hoje

Docker Compose na VPS: `docker compose up -d --build app`. Serviços:

- `app` — Next em modo `standalone` (`output: 'standalone'` em
  `next.config.mjs`). **`next start` não funciona com standalone**; use o
  Docker, ou `node .next/standalone/server.js` depois de copiar `public/` e
  `.next/static/` para dentro de `.next/standalone/`.
- `caddy` — TLS on-demand, para que subdomínio novo de lojista funcione sem
  configurar DNS.
- `render` — **novo, nunca subiu.** Worker de renderização.

Não há Vercel nem PM2.

### Deploy da branch `reestruturacao`

**Não houve.** Nada desta branch está no ar. A VPS roda o `photoon-app-1`
construído antes da reestruturação.

### Como criar um preview sem tocar na master

O `docker-compose.yml` é um só e não tem override de porta. O caminho mais
curto, sem mexer na master:

1. Na VPS, clonar a branch em outro diretório (`git worktree add ../photoon-rev
   reestruturacao`).
2. Copiar o `.env` para lá (**ele não está no Git**).
3. Subir com nome de projeto e porta diferentes:
   `docker compose -p photoon-rev up -d --build app`.
4. Apontar um subdomínio de teste para essa porta no Caddyfile, ou acessar por
   IP com `DEFAULT_TENANT_SLUG` definido.

### Variáveis de ambiente

Sem segredo neste arquivo. O que precisa existir:

| Variável | Para quê | Já existe? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | endereço do projeto Supabase | sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | chave pública | sim |
| `NEXT_PUBLIC_ROOT_DOMAIN` | domínio raiz do SaaS | sim |
| `NEXT_PUBLIC_PROTOCOL` | http em dev, https em produção | sim |
| `DEFAULT_TENANT_SLUG` | acesso por IP cru / preview | sim |
| `SUPABASE_SERVICE_ROLE_KEY` | **worker de renderização** | **não** |
| `RENDER_WORKER_NOME` | nome do worker no painel (opcional) | não |
| `RENDER_INTERVALO_MS` | intervalo da fila (opcional, 3000) | não |
| `NEXT_PUBLIC_SUPORTE_EMAIL` | bloco de contato em `/ajuda` (opcional) | não |
| `NEXT_PUBLIC_SUPORTE_WHATSAPP` | idem (opcional) | não |
| `NEXT_PUBLIC_DOCS_URL` | idem (opcional) | não |

`NEXT_PUBLIC_*` são embutidas no build: mudou o `.env`, reconstrua a imagem.

---

## 13. Testes e verificadores

Todos rodam da raiz do projeto.

| Comando | O que valida |
|---|---|
| `npx tsc --noEmit` | tipos de todo o projeto |
| `npm run build` | compilação do Next e a lista de rotas geradas |
| `node tools/checar-casca.mjs` | **novo.** Que as três fontes do menu concordam: o menu desenhado em `Dashboard.dc.html`, o índice em `rotas-lojista.ts` e as telas em `src/app/app`. Proíbe item sem `pick`, módulo marcado pronto sem `page.tsx` (link morto), módulo com página ainda esmaecido, rota antiga removida antes de o destino existir, e qualquer tela do design que volte a trazer o menu junto. Sai com código 1 se algo estiver incoerente |
| `node tools/checar-banco.mjs` | **novo.** Que as migrações chegaram ao banco real, usando só a chave anônima: distingue "tabela/coluna não existe" (PGRST205 / 42703) de "existe e a RLS esconde as linhas". Também confere que as RPC de sequência estão fechadas a `anon` e que a RLS devolve 0 linhas em 7 tabelas |
| `node tools/checar-consultas.mjs` | **novo.** Roda cada `select` do painel contra o schema real. A RLS esconde as linhas, mas o PostgREST valida a consulta antes disso, então coluna inexistente ou junção errada voltam 400 |
| `./tools/gerar.sh` | regenera `src/components/design/*` a partir dos `.dc.html`. `tudo`, `telas`, `lojista`, `cliente` ou `editor` |
| `node tools/auditar.mjs` | varre as rotas dos três perfis (precisa do site no ar) |
| `node tools/tirar-foto.mjs <perfil> <rota> <nome> <largura>` | screenshot autenticado. **Precisa de `SENHA_TESTE`, que não está em arquivo versionado** |
| `node tools/testar-editor.mjs` | os 30 controles do editor do cliente |

Para testar migração e concorrência sem tocar em produção, o caminho usado
nesta sessão foi um Postgres 15 em Docker com stubs de `auth` e `storage`:
subir `postgres:15`, criar `auth.users`, `auth.uid()`, `storage.buckets`,
`storage.objects`, `storage.foldername()` e os papéis `anon`/`authenticated`/
`service_role`, e então aplicar `supabase/migrations/*.sql` em ordem (a 0003
pede senha real e é pulada).

---

## 14. Problemas conhecidos

### Pendências de banco

1. **A migração 0016 não foi aplicada.** É a correção da vulnerabilidade de
   EXECUTE/PUBLIC (seção 6). Enquanto não for, `tools/checar-banco.mjs` acusa
   3 problemas e as funções de sequência ficam chamáveis por qualquer
   visitante. **Este é o item mais urgente.**

### Credenciais que faltam

2. **`SUPABASE_SERVICE_ROLE_KEY`** — sem ela o worker de renderização não roda,
   e a Fase 7 fica sem execução real.
3. **`SENHA_TESTE`** — sem ela não há screenshot autenticado, então **nenhuma
   tela desta reestruturação foi conferida visualmente no navegador**. Tudo o
   que se sabe vem de `tsc`, `build`, dos três verificadores e de testes em
   Postgres local.
4. **Não há acesso de escrita ao banco real.** A concorrência de códigos foi
   provada em Postgres local com a migração idêntica, não em produção.

### Bugs abertos

5. **`/projetos/:id/resumo` não existe** e o botão "Resumo" aponta para lá —
   404 hoje. Fase 6 incompleta nesse ponto.
6. **As 12 telas de protótipo** seguem com conteúdo do protótipo. Cinco delas
   ainda mostram nomes fictícios (CRM, Pagamentos, Carteira, Relatórios,
   Suporte). As consultas já existem em `src/lib/comercial.ts` e
   `src/lib/financeiro.ts` — é ligar, não desenhar.
7. **Os 15 `Painel*.tsx` mortos** em `src/components/app/` continuam no
   repositório. Servem de referência da lógica; apagar cada um quando a tela
   correspondente for ligada, nunca antes.

### Riscos

8. **Reexportar o design** traz as telas com a moldura junto de novo. O recorte
   (`somenteConteudo`) a descarta sozinho, mas o `equilibrar()` avisa em qual
   arquivo fechou tag — se esse aviso aparecer para um arquivo novo, conferir.
9. **URL assinada expira em 1 h** (`urlAssinada`). Sessão longa com canvas
   aberto pode ficar com imagem quebrada. Já era pendência conhecida do editor
   com 6 h.
10. **`src/lib/cripto.ts` nunca foi verificado** e guarda credencial de gateway.

### Decisões já tomadas (não reabrir)

- Worker de renderização: **container no docker-compose**, não Edge Function.
- Filial: **entidade real desde a Fase 4**, com filial padrão automática.
- Código do projeto: **letra do tipo + 7 dígitos**, sequencial por loja.
- As 12 telas de protótipo: **ligar**, e reconstruir só Financeiro (6 abas),
  Configurações (14 abas) e Templates (5 abas), que mudam de forma.

---

## 15. Próximos passos, em ordem

1. **Aplicar a migração 0016** (`supabase/migrations/0016_permissao_das_funcoes.sql`).
   É a correção de segurança. Entregar o conteúdo do arquivo em um bloco único
   para o usuário colar no SQL Editor do Supabase — ele não é programador e
   pediu para não receber comandos.
2. **Rodar `node tools/checar-banco.mjs`** e confirmar que as 3 RPC passam a
   aparecer fechadas a `anon`.
3. **Rodar `npx tsc --noEmit`, `npm run build`, `node tools/checar-casca.mjs` e
   `node tools/checar-consultas.mjs`** para confirmar que a árvore está sã.
4. **Fechar a Fase 6:** criar `/projetos/:id/resumo` e ligar as ações do
   cabeçalho que ainda não existem (duplicar, arquivar, baixar arquivos,
   restaurar versão).
5. **Fase 8 — Pedidos e relação Pedido × Projeto.** Começar pela aba Projetos
   no detalhe do pedido; depois as 7 abas, os filtros, as ações em massa e a
   ordem de serviço em `/pedidos/:id/os`.
6. **Fase 9 — Produção.** Kanban de 8 estágios, card de renderização, tempo no
   estágio, e mostrar `producao_historico`.
7. **Fase 10 — Expedição.** Ampliar (não reescrever) a tela que já existe, com
   os campos e estados novos.
8. Commitar cada fase separadamente, na branch `reestruturacao`. **Sem merge na
   master.**

---

## 16. Prompt para continuar

```
Leia primeiro o arquivo HANDOFF-REESTRUTURACAO-PHOTOON.md na raiz do projeto
/root/photoon. Ele tem todo o contexto da reestruturação e você não precisa
reler nenhuma conversa anterior.

Depois de ler:

1. Confirme a branch e o estado do git. Deve estar em `reestruturacao`, árvore
   limpa, com o commit do handoff no topo. NÃO faça merge na master, nem agora
   nem depois.
2. Rode os verificadores do projeto (tsc, build, checar-casca, checar-banco,
   checar-consultas) e me diga o que encontrou.
3. Não refaça o que já está pronto. As Fases 1 a 7 estão concluídas — a única
   pendência delas é a rota /projetos/:id/resumo e as ações de cabeçalho do
   detalhe do projeto.
4. A primeira coisa a resolver é aplicar a migração 0016, que corrige uma
   vulnerabilidade real de permissão de funções. Eu não sou programador: me
   entregue o SQL completo em UM único bloco e diga apenas "cole este bloco no
   SQL Editor do Supabase e clique em Run". Não me mande caminho de arquivo
   nem comando de terminal.
5. Fora isso, execute sozinho tudo que você conseguir executar no ambiente:
   build, testes, git, scripts, migrações locais de teste. Não me peça para
   rodar nada que você mesmo possa rodar.
6. Corrija qualquer bug que encontrar antes de seguir para a fase seguinte.
7. Continue automaticamente pelas Fases 8, 9 e 10 (Pedidos e relação Pedido ×
   Projeto, Produção, Expedição), na ordem, sem parar para me pedir
   autorização.
8. Mantenha os commits organizados, um por fase, na branch reestruturacao.
9. Ao terminar cada fase, me dê só um resumo curto: o que foi feito, o que foi
   corrigido, se está funcionando, e qual fase começou em seguida.

Só me interrompa se houver risco real de perda de dados, necessidade de uma
credencial que você não possui, ou uma decisão de produto que não dê para
inferir do briefing.
```

---

## 17. Estado do Git

Branch `reestruturacao`, com o commit deste handoff no topo. Árvore limpa —
nenhum arquivo modificado ou não rastreado pendente. Sem merge na master.
