# Plano — pagamentos e vendas (para depois)

Pedido do Fábio em 29/08/2026. **Não começar antes de fechar o painel do
cliente.** Registrado aqui para não se perder.

## O que ele quer

Cada lojista conecta o **próprio** gateway com poucas chaves, e escolhe por
alternador o que aceita: **boleto, cartão, Pix**. O cliente paga o álbum ali
mesmo. Dos maiores do mercado: **Mercado Pago, Asaas, PagSeguro, Stripe** e
outros conhecidos.

Com isso aparece a parte comercial: vendas, **oportunidades** (álbum liberado e
ainda não montado é oportunidade), taxa de conversão e taxa de conclusão.

## O que falta antes

Nada disso se sustenta sem o modelo de negócio no banco. Hoje **não existe**
pedido, item de pedido, pagamento, status de produção nem envio. Antes das
telas:

1. `pedidos` — cliente, loja, projeto, valor, estado, datas
2. `pedido_itens` — o que foi comprado e por quanto (o preço já é calculado por
   `src/lib/preco.ts`, falta congelá-lo no pedido)
3. `pagamentos` — gateway, id externo, método, estado, tentativas
4. `lojista_gateways` — credenciais por loja e os alternadores de método

**As credenciais de gateway não podem ficar em `lojista_gateways` em texto
puro.** É chave de dinheiro de terceiro: guardar cifrada, e a chave de
cifragem fora do banco.

## Sequência sugerida

1. modelo de pedido e pagamento no banco, com RLS por loja
2. congelar o preço no pedido (hoje ele é recalculado do template, e mudar o
   preço do modelo mudaria o valor de uma compra já fechada)
3. um gateway só, ponta a ponta — **Mercado Pago** ou **Asaas**, que cobrem
   Pix, boleto e cartão numa API só e são os mais usados no Brasil
4. tela de conexão do gateway, com os alternadores por método
5. checkout do cliente
6. webhook de confirmação — **é o que de fato confirma o pagamento**; nunca
   confiar no retorno do navegador
7. só então as telas comerciais: vendas, oportunidades, conversão

## Oportunidades — a definição que o Fábio deu

Álbum liberado ao cliente e ainda não montado é **oportunidade**. Montado e não
pago, oportunidade quente. Isso dá para medir **hoje**, sem gateway: os dados
já existem em `projetos.status` e `progresso`. É a primeira coisa entregável
desta lista, e não depende de integração nenhuma.
