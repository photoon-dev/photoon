# Photoon — área do cliente final (SaaS multi-tenant)

Next.js 15 (App Router) + Supabase, um app servindo todos os lojistas por
subdomínio: `<lojista>.photoon.com.br`.

## Escopo atual

Somente as telas do **cliente final**, conforme pedido:

| Rota | Tela |
|---|---|
| `/entrar` | Cliente Entrar |
| `/meus-projetos` | Cliente Meus projetos |
| `/projetos/[id]` | Cliente Detalhe do projeto |
| `/projetos/[id]/editor` | Cliente Editor — **URL própria** |

O painel do lojista (Dashboard, Pedidos, Financeiro, CRM, …) ficou de fora
de propósito.

`/` no subdomínio redireciona para `/entrar` ou `/meus-projetos` conforme a
sessão. O domínio raiz `photoon.com.br` não serve telas de cliente final.

## Multi-tenant

`middleware.ts` lê o `Host`, extrai o slug (`joao.photoon.com.br` → `joao`),
injeta no header `x-photoon-tenant` e protege as rotas privadas. Subdomínios
reservados (`www`, `app`, `admin`, `api`, …) nunca viram lojista.

O isolamento real é no banco: RLS em `projetos` exige que o projeto seja do
cliente logado **e** que o cliente tenha vínculo com aquele lojista.

## Links que o lojista compartilha

```
https://<slug>.photoon.com.br/entrar
```

O cliente cria conta ali; o vínculo `cliente ↔ lojista` é criado no primeiro
acesso a `/meus-projetos` (`garantirCliente`). O mesmo e-mail pode ser cliente
de vários lojistas.

## Setup

1. Crie o projeto Supabase (**conta nova**, não a antiga).
2. Rode `supabase/migrations/0001_init.sql` no SQL Editor.
3. Em Authentication → URL Configuration, adicione como redirect:
   `https://*.photoon.com.br/auth/callback`
4. `cp .env.example .env` e preencha.
5. Cadastre um lojista:
   ```sql
   insert into public.lojistas (slug, nome) values ('demo', 'Estúdio Demo');
   ```

## Rodar

```bash
npm install
npm run dev     # http://demo.localhost:3000/entrar
```

Em dev use `NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000` e `NEXT_PUBLIC_PROTOCOL=http`.

## Deploy na VPS

```bash
docker compose up -d --build
```

Caddy termina o TLS e faz proxy para o app. DNS necessário:

```
A     photoon.com.br      2.25.140.168
A     *.photoon.com.br    2.25.140.168
```

O wildcard TLS exige DNS-01 — veja o comentário em `deploy/Caddyfile`.

## Pendente

- **Design.** As telas estão com layout estrutural e tokens provisórios; o
  visual real vem dos `.dc.html` do Claude Design (ver `design/LEIA-ME.md`).
- **Editor.** `/projetos/[id]/editor` é o shell da rota; a mecânica de edição
  segue `Especificacao_Editor_Usuario_Photoon.md`.
- Upload de fotos para o bucket `projetos` (policy já criada).
