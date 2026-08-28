# Plano — segunda rodada do editor

Pedidos do Fábio em 28/08/2026, para depois de fechar a Fase 5 (rostos).
Ainda **não implementados**. Ordem sugerida no fim.

---

## 1. Menu de contexto na foto (botão direito)

Ao clicar com o botão direito sobre uma imagem já colocada:

| Opção | Comportamento |
|---|---|
| **Excluir** | tira a foto do quadro (o quadro continua) |
| **Excluir borda** | zera a borda daquela imagem |
| **Definir como fundo** | a foto vira **fundo da página inteira**; a foto que estava por cima **continua aparecendo** sobre ela. São camadas distintas: fundo ≠ quadro |
| **Aplicar esta borda a todas** | propaga largura e cor da borda para todas as imagens do álbum |

Implicação no modelo: `Pagina` ganha `fundoFoto?: { fotoId, opacidade }`, separado
de `fundo` (cor). Não reaproveitar o quadro — o fundo não é um quadro.

## 2. Borda por imagem, editável

No inspetor: **largura** e **cor** da borda de cada imagem.
`QuadroFoto` ganha `borda?: { px: number; cor: string }`.
Precisa valer também na impressão (`sharp`), como o resto do inspetor.

## 3. Mais efeitos além de P&B

Hoje só existe `pb`. Acrescentar **sépia** e outros.
`Ajustes` ganha `efeito: 'nenhum' | 'pb' | 'sepia' | ...` no lugar do booleano
`pb` — com migração tolerante (`pb: true` → `efeito: 'pb'`).
Fórmula em `src/lib/imagem.ts`, para CSS e `sharp` saírem da mesma conta.

## 4. Fundo com transparência

Fundo de foto precisa de controle de opacidade, para clarear e não competir com
as fotos por cima. É o `opacidade` do item 1.

## 5. Linhas-guia ao arrastar

Ao arrastar uma foto pela página, mostrar guias de alinhamento:
- centralização em relação à página;
- alinhamento com as outras fotos (bordas e centros).

É o comportamento que todo editor gráfico tem. Cálculo local, sem estado no
documento: compara o retângulo arrastado com os demais e com o centro da página,
com tolerância de alguns pixels.

## 6. Área de corte com fundo distinto

As linhas de margem de corte já existem. Falta a **região** fora delas ter fundo
levemente diferente, para o cliente ver o que será cortado.
Casa com o pedido anterior de mostrar a foto **clareada** na sangria em vez de
sumir.

## 7. Numeração nas miniaturas

Bullet numeral nas fotos da listagem do álbum, para o cliente referir-se a uma
foto por número.

## 8. Reordenar páginas arrastando

Na tira de miniaturas de baixo, arrastar para reposicionar: puxar a lâmina 2
para o fim faz dela a última. Hoje só dá para adicionar.
`useDocumento` ganha `moverLamina(de, para)`; a tira vira alvo de arrasto.

---

## Ordem sugerida

1. **2 e 3** (borda por imagem, sépia) — mexem só em `album.ts` + `imagem.ts` +
   inspetor, que já estão prontos para receber.
2. **8** (reordenar páginas) — isolado, alto valor, baixo risco.
3. **1 e 4** (menu de contexto e fundo de foto) — exigem a camada de fundo nova.
4. **5 e 6** (guias e área de corte) — trabalho de canvas.
5. **7** (numeração) — cosmético.

**Regra que continua valendo:** todo binding novo nasce em
`design/extraido/Cliente Editor.dc.html` e depois `./tools/gerar.sh editor`.
Nunca editar `src/components/design/*Design.tsx`.
