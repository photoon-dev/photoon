-- 0011 — perfil do cliente: foto e preferências.
--
-- `clientes` é por LOJA (o mesmo e-mail pode ser cliente de vários lojistas),
-- então a foto fica aqui e não em auth.users: a pessoa pode querer uma foto no
-- estúdio de casamento e outra no de formatura.
alter table public.clientes
  add column if not exists avatar_url text,
  add column if not exists preferencias jsonb not null default '{}'::jsonb;

-- Bucket público das fotos de perfil.
--
-- Público de propósito: o avatar aparece no cabeçalho a cada carregamento, e
-- assinar URL para isso gastaria uma chamada por visita. Não há dado sensível
-- numa foto que a própria pessoa escolheu — diferente da galeria, que é
-- privada e continua assinada.
insert into storage.buckets (id, name, public)
values ('avatares', 'avatares', true)
on conflict (id) do update set public = true;

drop policy if exists avatares_leitura_publica on storage.objects;
create policy avatares_leitura_publica on storage.objects for select
  using (bucket_id = 'avatares');

-- Escrita só na própria pasta: o caminho começa com o id do usuário, então
-- ninguém sobrescreve o avatar de outra pessoa.
drop policy if exists avatares_escrita_propria on storage.objects;
create policy avatares_escrita_propria on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatares' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists avatares_atualiza_propria on storage.objects;
create policy avatares_atualiza_propria on storage.objects for update
  to authenticated
  using (bucket_id = 'avatares' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists avatares_apaga_propria on storage.objects;
create policy avatares_apaga_propria on storage.objects for delete
  to authenticated
  using (bucket_id = 'avatares' and (storage.foldername(name))[1] = auth.uid()::text);
