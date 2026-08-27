-- Lojista de teste. Rode no SQL Editor do Supabase.
insert into public.lojistas (slug, nome, telefone_suporte, email_suporte)
values ('demo', 'Estúdio Demo', '(11) 98844-2210', 'contato@photoon.com.br')
on conflict (slug) do nothing;

-- Galeria vinculada ao cliente, criada depois que ele fizer o primeiro login.
-- Troque o e-mail pelo da conta de teste:
--
--   insert into public.galerias (lojista_id, cliente_id, nome)
--   select l.id, c.id, 'Formatura 2026 · sessão de teste'
--   from public.clientes c
--   join public.lojistas l on l.id = c.lojista_id
--   join auth.users u on u.id = c.user_id
--   where u.email = 'admin@photoon.com.br' and l.slug = 'demo';
