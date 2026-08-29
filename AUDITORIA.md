# Auditoria do painel — 29/08/2026

Levantamento do que funciona com dado real, do que é desenho preenchido à mão
e do que não existe. A IA ficou de fora, como combinado.

Método: cada rota foi aberta num navegador de verdade, autenticada, e o texto
renderizado foi comparado com o banco. Nada aqui vem de leitura de código.

---

## 1. Painel do cliente — `<loja>.photoon.com.br`

| Tela | Rota | Estado |
|---|---|---|
| Entrar | `/entrar` | **funciona**, dado real |
| Meus projetos | `/meus-projetos` | **funciona**, dado real |
| Detalhe do projeto | `/projetos/[id]` | **funciona**, dado real |
| Editor | `/editor/[id]` | **funciona** — 28 de 30 controles confirmados |
| Galeria de fotos | `/galeria` | **404** — não existe, e o `.dc.html` não veio no zip |
| Minha conta | `/minha-conta` | **404** — o cabeçalho oferece o link |
| Ajuda | `/ajuda` | **404** — o cabeçalho oferece o link |

O painel do cliente é o mais completo. As três ausências são links que o
cabeçalho já mostra e que levam a lugar nenhum.

---

## 2. Painel do lojista — `app.photoon.com.br`

**4 dos 20 itens do menu têm tela.** Os outros 16 não respondem.

| Tela | Rota | Estado |
|---|---|---|
| Clientes | `/clientes` | **funciona**, dado real: cadastro, link da loja, galeria, envio de fotos, detecção de rostos |
| Configurações | `/configuracoes` | **funciona**, dado real |
| Temas e templates | `/templates` | **funciona**, dado real |
| Dashboard | `/` | **carrega, mas quase todo o conteúdo é inventado** — ver abaixo |
| Pedidos, Produção, Expedição | — | **404** |
| Loja, Catálogo, Preços | — | **404** |
| CRM, Vendedores, Marketing | — | **404** |
| Pagamentos, Carteira | — | **404** |
| Relatórios, Automações, Integrações, Auditoria, Suporte | — | **404** |

### 2.1. O que o dashboard inventa

Isto é o mais grave da auditoria, porque **parece** informação:

| O que aparece | Verdade |
|---|---|
| "Lab Cores" na marca | fixo; a loja é "Estúdio Photoon" |
| Avatar "MR", cargo "Administradora" | fixo |
| **"Bom dia, Marta. O laboratório está indo bem."** | fixo — o lojista lê o nome de outra pessoa |
| "TERÇA, 25 DE AGOSTO · 09:12" | data fixa, não é hoje |
| "14 pedidos entraram desde ontem, 3 lotes saem hoje" | fixo |
| Selo "14" em Pedidos | fixo |
| "Armazenamento 72% · 1,44 TB de 2 TB" | fixo; não medimos armazenamento |
| "SLA no prazo 96%", "Na fila de render 27" | fixo |
| GMV R$ 184.320 · Pedidos 1 248 · Ticket R$ 147,70 · Conversão 3,8% | **todos fixos** |
| Gráfico "Vendas e pedidos" | curva desenhada |
| Tabela "Pedidos recentes" (Studio Lume, Colégio Farol, Rita Nunes) | **clientes que não existem** |

Um lojista que abrir o painel hoje vê faturamento de R$ 184 mil que não é dele.
Isso é pior que uma tela vazia.

---

## 3. Super admin — `admin.photoon.com.br`

| Tela | Rota | Estado |
|---|---|---|
| Plataforma | `/` | **funciona**, dado real |
| Planos | `/planos` | **funciona**, dado real |

---

## 4. O que já foi verificado funcionando

- multi-inquilino por subdomínio, com TLS emitido na primeira visita
- login dos três perfis; sair funciona e respeita o subdomínio
- editor: gravação automática, layouts, enquadramento, ajustes, efeitos,
  texto, elementos, fundos, espaçamento, prévia com reprodução
- detecção e agrupamento de rostos (22 rostos → 13 pessoas em 24 fotos)
- preço do álbum, planos e limites
- RLS isolando lojas, verificada de forma adversarial

## 5. Ordem recomendada

1. **Tirar a mentira do dashboard** — é o que um cliente seu veria hoje.
2. **Minha conta e Ajuda** no painel do cliente — links que já existem e falham.
3. **Galeria de fotos** (U04) — a tela que falta para fechar o cliente.
4. **Pedidos** — é o coração do lojista e o que dá sentido a Produção e
   Expedição.
5. O resto do menu, por valor decrescente.
