-- ===========================================================================
-- 0015 — Projeto, renderização, produção e expedição
--
-- Cobre de uma vez tudo o que as Fases 5 a 10 pedem, para não fatiar o banco
-- em seis migrações que precisariam ser aplicadas uma a uma.
--
-- A separação que o briefing exige existe aqui, e não é decorativa:
--
--   PROJETO       o que o cliente montou            projetos
--   PEDIDO        a compra, com um ou vários         pedidos + pedido_itens
--   RENDERIZAÇÃO  o job que gera os arquivos         render_jobs
--   PRODUÇÃO      o físico sendo feito               producao
--   EXPEDIÇÃO     o físico saindo                    expedicao
--
-- Um projeto existe sem pedido. Um pedido tem vários projetos. Um projeto tem
-- vários arquivos, várias versões e vários jobs de renderização.
--
-- Aditiva e idempotente: nada é removido, e roda de novo sem efeito.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- Status do projeto: enum vira texto com CHECK
--
-- O briefing pede nove status e as fases seguintes pedirão outros. `alter type
-- ... add value` não roda dentro de transação em todo servidor, e o valor novo
-- não pode ser usado na mesma transação em que nasce — o que quebraria este
-- arquivo no meio. Texto com CHECK aceita valor novo com um `alter constraint`
-- e nenhuma cerimônia.
--
-- Os valores atuais continuam válidos: nenhuma linha muda.
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from information_schema.columns
     where table_schema='public' and table_name='projetos'
       and column_name='status' and data_type='USER-DEFINED'
  ) then
    alter table public.projetos alter column status drop default;
    alter table public.projetos alter column status type text using status::text;
    alter table public.projetos alter column status set default 'nao_iniciado';
  end if;
end $$;

alter table public.projetos drop constraint if exists projetos_status_valido;
alter table public.projetos add constraint projetos_status_valido check (status in (
  -- os cinco que já existiam
  'nao_iniciado', 'em_edicao', 'com_pendencias', 'pronto', 'finalizado',
  -- os que o painel administrativo passa a distinguir
  'aguardando_cliente', 'fechado', 'em_renderizacao', 'renderizado',
  'com_erro', 'arquivado'
));

-- ---------------------------------------------------------------------------
-- A ficha do projeto
--
-- `com_pendencias` é aviso de qualidade e `com_erro` é falha de processo: são
-- coisas diferentes e por isso viraram status diferentes.
-- ---------------------------------------------------------------------------
alter table public.projetos
  add column if not exists criado_por     uuid references auth.users(id) on delete set null,
  add column if not exists fechado_em     timestamptz,
  add column if not exists finalizado_em  timestamptz,
  add column if not exists arquivado_em   timestamptz,   -- soft delete (regra 13)
  add column if not exists bytes_total    bigint not null default 0,
  add column if not exists capa_tipo      text,
  add column if not exists dorso_mm       numeric(5,1),
  add column if not exists formato_aberto text,
  add column if not exists formato_fechado text,
  add column if not exists largura_mm     int,
  add column if not exists altura_mm      int,
  add column if not exists fotos_enviadas int not null default 0,
  add column if not exists fotos_usadas   int not null default 0;

create index if not exists projetos_status_idx    on public.projetos(lojista_id, status);
create index if not exists projetos_ativos_idx    on public.projetos(lojista_id, atualizado_em desc) where arquivado_em is null;

-- Projeto sem pedido é o caso que a Central precisa achar depressa.
create index if not exists pedido_itens_projeto_idx on public.pedido_itens(projeto_id) where projeto_id is not null;

-- ---------------------------------------------------------------------------
-- Arquivos do projeto
--
-- Regra 14: arquivo de projeto nunca é apagado em silêncio. `removido_em`
-- marca a saída e o registro fica.
-- ---------------------------------------------------------------------------
create table if not exists public.projeto_arquivos (
  id          uuid primary key default gen_random_uuid(),
  projeto_id  uuid not null references public.projetos(id) on delete cascade,
  lojista_id  uuid not null references public.lojistas(id) on delete cascade,
  -- original | renderizado | preview | auxiliar
  tipo        text not null default 'original',
  nome        text not null,
  -- Caminho no bucket. A URL é assinada na hora; nunca pública permanente.
  caminho     text not null,
  bucket      text not null default 'renders',
  mime        text,
  bytes       bigint not null default 0,
  checksum    text,
  versao      int not null default 1,
  -- pendente | pronto | erro
  estado      text not null default 'pronto',
  criado_em   timestamptz not null default now(),
  removido_em timestamptz
);
create index if not exists projeto_arquivos_idx on public.projeto_arquivos(projeto_id, tipo) where removido_em is null;
create index if not exists projeto_arquivos_loja_idx on public.projeto_arquivos(lojista_id);

-- ---------------------------------------------------------------------------
-- Versões do projeto
--
-- Regra 30. `paginas` guarda o documento inteiro no estado daquele momento —
-- é o que permite restaurar sem depender de arquivo externo.
-- ---------------------------------------------------------------------------
create table if not exists public.projeto_versoes (
  id         uuid primary key default gen_random_uuid(),
  projeto_id uuid not null references public.projetos(id) on delete cascade,
  lojista_id uuid not null references public.lojistas(id) on delete cascade,
  versao     int not null,
  motivo     text,
  paginas    jsonb not null default '[]'::jsonb,
  bytes      bigint not null default 0,
  criado_por uuid references auth.users(id) on delete set null,
  criado_em  timestamptz not null default now(),
  unique (projeto_id, versao)
);
create index if not exists projeto_versoes_idx on public.projeto_versoes(projeto_id, versao desc);

-- ---------------------------------------------------------------------------
-- Pré-flight
--
-- Uma linha por problema encontrado, não um jsonb solto: a Central precisa
-- contar "projetos com erro crítico" sem abrir cada documento.
-- ---------------------------------------------------------------------------
create table if not exists public.projeto_validacoes (
  id         uuid primary key default gen_random_uuid(),
  projeto_id uuid not null references public.projetos(id) on delete cascade,
  lojista_id uuid not null references public.lojistas(id) on delete cascade,
  -- dpi | imagem_corrompida | imagem_ausente | sangria | area_segura |
  -- rosto_no_corte | texto_fora | fonte_ausente | arquivo_incompativel | pagina_vazia
  regra      text not null,
  -- informacao | aviso | erro
  severidade text not null default 'aviso',
  pagina     int,
  elemento   text,
  descricao  text not null,
  recomendacao text,
  criado_em  timestamptz not null default now(),
  constraint projeto_validacoes_severidade check (severidade in ('informacao','aviso','erro'))
);
create index if not exists projeto_validacoes_idx on public.projeto_validacoes(projeto_id, severidade);

-- ---------------------------------------------------------------------------
-- RENDERIZAÇÃO — entidade própria, não um campo do pedido
--
-- Regras 8 a 10 e 31 a 32: a renderização roda fora da requisição HTTP, em
-- fila, registrando tentativa e erro. O job aponta para o PROJETO; o pedido é
-- opcional, porque projeto sem pedido também se renderiza (prévia, prova).
-- ---------------------------------------------------------------------------
create table if not exists public.render_workers (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null unique,
  -- online | ocioso | ocupado | offline
  estado      text not null default 'offline',
  visto_em    timestamptz not null default now(),
  criado_em   timestamptz not null default now()
);

create table if not exists public.render_jobs (
  id          uuid primary key default gen_random_uuid(),
  lojista_id  uuid not null references public.lojistas(id) on delete cascade,
  projeto_id  uuid not null references public.projetos(id) on delete cascade,
  pedido_id   uuid references public.pedidos(id) on delete set null,
  worker_id   uuid references public.render_workers(id) on delete set null,
  -- na_fila | preparando | validando | renderizando | compactando | enviando |
  -- pronto | baixando | entregue | erro | cancelado
  estado      text not null default 'na_fila',
  -- preflight | preparacao | renderizacao | validacao | compactacao | upload | entrega
  etapa       text not null default 'preflight',
  progresso   int not null default 0 check (progresso between 0 and 100),
  prioridade  int not null default 0,
  tentativa   int not null default 1,
  destino     text,                       -- hot folder, SFTP, bucket
  erro_codigo text,
  erro_mensagem text,
  -- Só para quem tem permissão de ver detalhe técnico.
  erro_stack  text,
  criado_em   timestamptz not null default now(),
  iniciado_em timestamptz,
  concluido_em timestamptz,
  atualizado_em timestamptz not null default now(),
  constraint render_jobs_estado check (estado in (
    'na_fila','preparando','validando','renderizando','compactando','enviando',
    'pronto','baixando','entregue','erro','cancelado'))
);
create index if not exists render_jobs_fila_idx    on public.render_jobs(lojista_id, estado, prioridade desc, criado_em);
create index if not exists render_jobs_projeto_idx on public.render_jobs(projeto_id, criado_em desc);
create index if not exists render_jobs_pedido_idx  on public.render_jobs(pedido_id) where pedido_id is not null;
-- O worker pega o próximo da fila por aqui.
create index if not exists render_jobs_pendentes_idx on public.render_jobs(prioridade desc, criado_em) where estado = 'na_fila';

drop trigger if exists render_jobs_touch on public.render_jobs;
create trigger render_jobs_touch before update on public.render_jobs
  for each row execute function public.touch_atualizado_em();

create table if not exists public.render_logs (
  id         uuid primary key default gen_random_uuid(),
  job_id     uuid not null references public.render_jobs(id) on delete cascade,
  etapa      text,
  severidade text not null default 'info',   -- info | aviso | erro
  mensagem   text not null,
  criado_em  timestamptz not null default now()
);
create index if not exists render_logs_idx on public.render_logs(job_id, criado_em);

-- ---------------------------------------------------------------------------
-- PRODUÇÃO — as oito etapas do briefing, e o histórico de cada troca
--
-- Regra 12: nunca substituir um status sem registrar. O trigger grava sozinho,
-- então nenhuma tela pode esquecer.
-- ---------------------------------------------------------------------------
alter table public.producao drop constraint if exists producao_etapa_valida;
alter table public.producao add constraint producao_etapa_valida check (etapa in (
  -- as cinco que já existiam
  'fila', 'impressao', 'acabamento', 'revisao', 'pronto',
  -- as que o kanban do briefing acrescenta
  'aguardando', 'preflight', 'arquivos_prontos', 'qualidade', 'embalagem'
));

alter table public.producao
  add column if not exists prioridade int not null default 0,
  add column if not exists entrou_na_etapa_em timestamptz not null default now();

create table if not exists public.producao_historico (
  id          uuid primary key default gen_random_uuid(),
  producao_id uuid not null references public.producao(id) on delete cascade,
  de_etapa    text,
  para_etapa  text not null,
  responsavel text,
  user_id     uuid references auth.users(id) on delete set null,
  observacao  text,
  criado_em   timestamptz not null default now()
);
create index if not exists producao_historico_idx on public.producao_historico(producao_id, criado_em desc);

create or replace function public.producao_registra_troca()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into public.producao_historico (producao_id, de_etapa, para_etapa, responsavel)
    values (new.id, null, new.etapa, new.responsavel);
  elsif new.etapa is distinct from old.etapa then
    insert into public.producao_historico (producao_id, de_etapa, para_etapa, responsavel)
    values (new.id, old.etapa, new.etapa, new.responsavel);
    new.entrou_na_etapa_em := now();
  end if;
  return new;
end;
$$;

drop trigger if exists producao_historico_ins on public.producao;
create trigger producao_historico_ins after insert on public.producao
  for each row execute function public.producao_registra_troca();

drop trigger if exists producao_historico_upd on public.producao;
create trigger producao_historico_upd before update on public.producao
  for each row execute function public.producao_registra_troca();

-- ---------------------------------------------------------------------------
-- EXPEDIÇÃO — o que falta para gerar etiqueta e cobrar SLA
-- ---------------------------------------------------------------------------
alter table public.expedicao
  add column if not exists modalidade   text,          -- pac | sedex | expressa | retirada
  add column if not exists volumes      int not null default 1,
  add column if not exists peso_kg      numeric(8,3),
  add column if not exists largura_cm   int,
  add column if not exists altura_cm    int,
  add column if not exists profundidade_cm int,
  add column if not exists coleta_em    timestamptz,
  add column if not exists previsao_em  date,
  add column if not exists sla_dias     int,
  add column if not exists responsavel  text,
  add column if not exists etiqueta_url text;

alter table public.expedicao drop constraint if exists expedicao_estado_valido;
alter table public.expedicao add constraint expedicao_estado_valido check (estado in (
  -- os cinco que já existiam
  'aguardando', 'postado', 'em_transito', 'entregue', 'devolvido',
  -- os do briefing
  'aguardando_embalagem', 'pronto_para_envio', 'etiqueta_gerada',
  'aguardando_coleta', 'problema_na_entrega', 'retornado'
));

-- ---------------------------------------------------------------------------
-- Eventos internos — o que sobrou de "Automações"
--
-- Sem interface. Só o registro do que aconteceu, para quem quiser reagir.
-- ---------------------------------------------------------------------------
create table if not exists public.eventos (
  id         uuid primary key default gen_random_uuid(),
  lojista_id uuid not null references public.lojistas(id) on delete cascade,
  -- pagamento.aprovado | pedido.criado | projeto.finalizado |
  -- renderizacao.concluida | producao.concluida | pedido.enviado
  tipo       text not null,
  entidade   text,
  entidade_id uuid,
  dados      jsonb,
  criado_em  timestamptz not null default now()
);
create index if not exists eventos_idx on public.eventos(lojista_id, tipo, criado_em desc);

-- ---------------------------------------------------------------------------
-- Storage: bucket privado dos arquivos renderizados
--
-- Regra 20: nada de URL pública permanente. O bucket é privado e o app assina
-- a URL na hora. Regra 19: o caminho começa pelo id da loja, e a policy exige
-- que a primeira pasta seja uma loja de que o usuário é membro.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('renders', 'renders', false)
on conflict (id) do nothing;

drop policy if exists renders_da_equipe on storage.objects;
create policy renders_da_equipe on storage.objects for all
  using (
    bucket_id = 'renders'
    and private.is_membro_do_lojista((storage.foldername(name))[1]::uuid)
  )
  with check (
    bucket_id = 'renders'
    and private.is_membro_do_lojista((storage.foldername(name))[1]::uuid)
  );

-- ---------------------------------------------------------------------------
-- RLS
--
-- Mesmo desenho de 0012: a equipe da loja manda no que é dela; o cliente vê
-- só o que é do projeto dele, e não escreve.
-- ---------------------------------------------------------------------------
alter table public.projeto_arquivos   enable row level security;
alter table public.projeto_versoes    enable row level security;
alter table public.projeto_validacoes enable row level security;
alter table public.render_jobs        enable row level security;
alter table public.render_logs        enable row level security;
alter table public.render_workers     enable row level security;
alter table public.producao_historico enable row level security;
alter table public.eventos            enable row level security;

do $$
declare t text;
begin
  foreach t in array array['projeto_arquivos','projeto_versoes','projeto_validacoes','render_jobs','eventos']
  loop
    execute format('drop policy if exists %I_equipe on public.%I', t, t);
    execute format($f$
      create policy %I_equipe on public.%I for all
        using (private.is_membro_do_lojista(lojista_id) or private.is_super_admin())
        with check (private.is_membro_do_lojista(lojista_id) or private.is_super_admin())
    $f$, t, t);
  end loop;
end $$;

-- Tabelas sem lojista_id próprio: a dona é a linha-pai.
drop policy if exists render_logs_pelo_job on public.render_logs;
create policy render_logs_pelo_job on public.render_logs for all
  using (exists (
    select 1 from public.render_jobs j
     where j.id = job_id
       and (private.is_membro_do_lojista(j.lojista_id) or private.is_super_admin())))
  with check (exists (
    select 1 from public.render_jobs j
     where j.id = job_id
       and (private.is_membro_do_lojista(j.lojista_id) or private.is_super_admin())));

drop policy if exists producao_historico_pela_producao on public.producao_historico;
create policy producao_historico_pela_producao on public.producao_historico for all
  using (exists (
    select 1 from public.producao pr join public.pedidos p on p.id = pr.pedido_id
     where pr.id = producao_id
       and (private.is_membro_do_lojista(p.lojista_id) or private.is_super_admin())))
  with check (exists (
    select 1 from public.producao pr join public.pedidos p on p.id = pr.pedido_id
     where pr.id = producao_id
       and (private.is_membro_do_lojista(p.lojista_id) or private.is_super_admin())));

-- Os workers são da plataforma, não de uma loja: qualquer equipe lê o estado
-- do serviço, ninguém escreve pela API.
drop policy if exists render_workers_leitura on public.render_workers;
create policy render_workers_leitura on public.render_workers for select using (true);

-- O cliente acompanha o próprio projeto: vê os arquivos e o andamento da
-- renderização, e não escreve em nenhum dos dois.
drop policy if exists projeto_arquivos_do_cliente on public.projeto_arquivos;
create policy projeto_arquivos_do_cliente on public.projeto_arquivos for select
  using (removido_em is null and exists (
    select 1 from public.projetos p
     where p.id = projeto_id and p.cliente_id in (select private.meus_clientes())));

drop policy if exists render_jobs_do_cliente on public.render_jobs;
create policy render_jobs_do_cliente on public.render_jobs for select
  using (exists (
    select 1 from public.projetos p
     where p.id = projeto_id and p.cliente_id in (select private.meus_clientes())));

-- ---------------------------------------------------------------------------
-- Fecha as funções de sequência para quem chega de fora
--
-- O PostgREST expõe como RPC toda função de `public`, e `lojistas` tem leitura
-- pública (a vitrine precisa) — então o id de uma loja é descobrível. Enquanto
-- `proximo_numero_pedido` era um `max(numero)+1` puro, chamá-la não fazia mal:
-- só devolvia um número. Agora ela CONSOME da sequência, e um visitante sem
-- conta poderia chamá-la em laço e empurrar a numeração de pedidos da loja
-- para onde quisesse.
--
-- Ninguém precisa chamá-las de fora: quem as usa são os triggers, que rodam
-- como `security definer` e não dependem do privilégio de quem inseriu.
--
-- Verificado antes da correção: a chamada por `anon` chegava até a checagem de
-- chave estrangeira (HTTP 409), ou seja, passava pela permissão.
-- ---------------------------------------------------------------------------
revoke execute on function public.proximo_numero_pedido(uuid)          from anon, authenticated;
revoke execute on function public.proximo_codigo_projeto(uuid, text)   from anon, authenticated;
revoke execute on function public.projeto_recebe_codigo()              from anon, authenticated;
revoke execute on function public.pedido_recebe_numero()               from anon, authenticated;
revoke execute on function public.criar_filial_padrao()                from anon, authenticated;
revoke execute on function private.proximo_sequencial(uuid, text, bigint) from anon, authenticated;
