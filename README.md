# Photoon — área do cliente final (SaaS multi-tenant)

Next.js 15 (App Router) + Supabase. Um app serve todos os lojistas por
subdomínio: `<lojista>.photoon.com.br`.

Visual e modelo de dados vêm do projeto Claude Design (`design/extraido/`):
`Design System.dc.html` e as quatro telas `Cliente *.dc.html`, mais a
`Especificacao_Editor_Usuario_Photoon.md`.

## Rotas

| Rota | Tela |
|---|---|
| `/entrar` | Cliente Entrar |
| `/meus-projetos` | Cliente Meus projetos |
| `/projetos/[id]` | Cliente Detalhe do projeto |
| `/editor/[id]` | Cliente Editor — **URL própria** (rota da spec, U08) |

Editar abre uma navegação de verdade, com histórico e URL compartilhável — não
um painel empilhado sobre a tela de detalhe.

`/` no subdomínio redireciona para `/entrar` ou `/meus-projetos` conforme a
sessão. O domínio raiz `photoon.com.br` não serve telas de cliente final.

O painel do lojista (Dashboard, Pedidos, Financeiro, CRM, …) ficou de fora de
propósito — só a área do cliente final foi implementada.

## Multi-tenant

`middleware.ts` lê o `Host`, extrai o slug (`joao.photoon.com.br` → `joao`),
injeta no header `x-photoon-tenant` e protege as rotas privadas. Subdomínios
reservados (`www`, `app`, `admin`, `api`, …) nunca viram lojista.

O isolamento real é no banco: a policy de `projetos` exige que o projeto seja do
cliente logado **e** que ele tenha vínculo com aquele lojista.

## Links que o lojista compartilha

```
https://<slug>.photoon.com.br/entrar
```

O vínculo `cliente ↔ lojista` nasce no primeiro acesso a `/meus-projetos`
(`garantirCliente`). O mesmo e-mail pode ser cliente de vários lojistas.

## Modelo de dados

`lojistas` → `clientes` → `galerias` (fotos liberadas pela empresa) →
`projetos` (álbuns) → `projeto_fotos` (seleção do cliente).
Mais `projeto_eventos` (histórico) e `notificacoes`.

O cliente final **não faz upload e não apaga originais** (regra da spec): as
policies de `galerias` e `galeria_fotos` são somente leitura.

As lâminas do álbum ficam em `projetos.paginas` (jsonb), no formato de
`src/lib/album.ts`. O autosave recalcula `progresso`, `avisos` e `status`, então
os cards de "Meus projetos" refletem o estado real do editor.

## Setup

1. Crie o projeto Supabase (**conta nova**, não a antiga).
2. Rode `supabase/migrations/0001_init.sql` no SQL Editor.
3. Authentication → URL Configuration → adicione o redirect
   `https://*.photoon.com.br/auth/callback`.
4. `cp .env.example .env` e preencha.
5. Cadastre um lojista:
   ```sql
   insert into public.lojistas (slug, nome, telefone_suporte)
   values ('demo', 'Estúdio Demo', '(11) 98844-2210');
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

## O que ainda não existe

- **Editor, camadas avançadas.** O núcleo funciona (lâminas, painel de fotos da
  galeria, arrastar foto para o quadro, layouts fixos, texto, fundos, inspetor,
  storyboard, autosave). Ficaram para depois, da spec U09–U19: geração com IA,
  enquadramento com detecção de rosto, biblioteca de elementos, motor de
  layouts automático, revisão inteligente e finalização.
- **Telas do cliente que o design referencia mas não possui arquivo:**
  Galeria de fotos, Criar álbum, Revisão, Compartilhar, Ajuda, Minha conta.
  Os links para elas foram omitidos em vez de apontarem para o vazio.
- Upload de fotos pelo lojista (o cliente final, por regra, não envia fotos).
