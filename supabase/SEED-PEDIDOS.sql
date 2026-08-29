-- Dados reais para as telas do lojista.
--
-- Não é enfeite: sem pedido, produto e pagamento no banco, "Pedidos",
-- "Produção", "Financeiro" e "Relatórios" seriam telas vazias e não daria para
-- ver se funcionam. Aqui entram casos que exercitam os caminhos difíceis —
-- pedido cancelado, pagamento recusado, entrega devolvida, chamado aberto.
--
-- Rode DEPOIS de 0012. Pode rodar mais de uma vez: nada aqui duplica.

do $$
declare
  loja      uuid;
  cli       uuid;
  vend      uuid;
  prod_a    uuid; prod_b uuid; prod_c uuid;
  ped       uuid;
  n         int;
  i         int;
  estados   text[] := array['aguardando_pagamento','pago','em_producao','pronto','enviado','entregue','cancelado'];
  est       text;
begin
  select id into loja from public.lojistas order by criado_em limit 1;
  if loja is null then raise notice 'sem loja; nada a fazer'; return; end if;

  select id into cli from public.clientes where lojista_id = loja order by criado_em limit 1;

  ------------------------------------------------------------------ vendedores
  insert into public.vendedores (lojista_id, nome, email, telefone, comissao_pct)
  select loja, v.nome, v.email, v.tel, v.pct
    from (values
      ('Marina Alves','marina@estudio.com.br','(11) 98812-3344', 8.0),
      ('Rafael Lima','rafael@estudio.com.br','(11) 99677-2211', 6.5),
      ('Camila Duarte','camila@estudio.com.br','(21) 98123-9090', 7.0)
    ) as v(nome,email,tel,pct)
   where not exists (select 1 from public.vendedores x where x.lojista_id = loja and x.nome = v.nome);
  select id into vend from public.vendedores where lojista_id = loja limit 1;

  -------------------------------------------------------------------- produtos
  insert into public.produtos (lojista_id, nome, descricao, categoria, sku, preco_base,
                               preco_pagina_extra, preco_foto_extra, prazo_producao_dias, ordem)
  select loja, p.nome, p.desc_, p.cat, p.sku, p.base, p.pag, p.foto, p.prazo, p.ordem
    from (values
      ('Fotolivro 30×30 capa dura','40 páginas, papel fotográfico fosco, capa rígida','album','FL-3030', 1200.00, 45.00,  8.00, 10, 1),
      ('Fotolivro 20×20 capa flex','24 páginas, ideal para presente','album','FL-2020',  680.00, 32.00,  6.00,  7, 2),
      ('Álbum de casamento 35×25','60 páginas, capa em linho, estojo incluso','album','AC-3525', 2400.00, 62.00, 10.00, 15, 3),
      ('Revelação 15×21','Pacote com 50 fotos em papel brilho','revelacao','RV-1521', 120.00,  0.00,  2.20,  3, 4),
      ('Quadro canvas 60×40','Impressão em tela com chassi de madeira','quadro','QC-6040', 380.00,  0.00,  0.00,  8, 5),
      ('Caixa de madeira 30×30','Estojo para fotolivro, gravação a laser','acessorio','CX-3030', 260.00,  0.00,  0.00,  6, 6)
    ) as p(nome,desc_,cat,sku,base,pag,foto,prazo,ordem)
   where not exists (select 1 from public.produtos x where x.lojista_id = loja and x.sku = p.sku);

  select id into prod_a from public.produtos where lojista_id = loja and sku = 'FL-3030';
  select id into prod_b from public.produtos where lojista_id = loja and sku = 'AC-3525';
  select id into prod_c from public.produtos where lojista_id = loja and sku = 'RV-1521';

  ---------------------------------------------------------------------- gateway
  insert into public.lojista_gateways (lojista_id, provedor, aceita_pix, aceita_cartao, aceita_boleto, ativo)
  values (loja, 'mercadopago', true, true, true, false)
  on conflict (lojista_id, provedor) do nothing;

  --------------------------------------------------------------------- pedidos
  -- 24 pedidos espalhados nos últimos 90 dias, cobrindo todos os estados.
  if (select count(*) from public.pedidos where lojista_id = loja) = 0 then
    for i in 1..24 loop
      est := estados[1 + (i % array_length(estados,1))];
      select public.proximo_numero_pedido(loja) into n;

      insert into public.pedidos (lojista_id, cliente_id, vendedor_id, numero, estado, canal,
                                  subtotal, desconto, frete, total, prazo_em, visto_em, criado_em,
                                  motivo_cancelamento, observacao)
      values (
        loja, cli, vend, n, est,
        (array['loja','whatsapp','indicacao','presencial'])[1 + (i % 4)],
        0, 0, 0, 0,
        (now() - (i || ' days')::interval + interval '20 days')::date,
        -- os quatro mais recentes ficam por ver: alimenta o selo de "não vistos"
        case when i <= 4 then null else now() - (i || ' days')::interval end,
        now() - (i * 3 || ' days')::interval,
        case when est = 'cancelado' then
          (array['Cliente desistiu','Prazo não atendia','Erro no pedido, refeito'])[1 + (i % 3)]
        end,
        case when i % 5 = 0 then 'Cliente pediu capa em tom mais escuro.' end
      )
      returning id into ped;

      -- itens
      insert into public.pedido_itens (pedido_id, produto_id, descricao, quantidade, preco_unit, paginas, fotos, total)
      values (ped, prod_a, 'Fotolivro 30×30 capa dura', 1, 1200.00, 40 + (i % 5) * 2, 60 + i, 1200.00 + (i % 5) * 90.00);

      if i % 3 = 0 then
        insert into public.pedido_itens (pedido_id, produto_id, descricao, quantidade, preco_unit, paginas, fotos, total)
        values (ped, prod_c, 'Revelação 15×21', 2, 120.00, 0, 100, 240.00);
      end if;
      if i % 7 = 0 then
        insert into public.pedido_itens (pedido_id, produto_id, descricao, quantidade, preco_unit, paginas, fotos, total)
        values (ped, prod_b, 'Álbum de casamento 35×25', 1, 2400.00, 60, 180, 2400.00);
      end if;

      -- totais a partir dos itens, como um pedido de verdade
      update public.pedidos p set
        subtotal = s.t,
        desconto = case when i % 6 = 0 then round(s.t * 0.1, 2) else 0 end,
        frete    = case when i % 4 = 0 then 0 else 38.00 end,
        total    = s.t - (case when i % 6 = 0 then round(s.t * 0.1, 2) else 0 end)
                       + (case when i % 4 = 0 then 0 else 38.00 end)
      from (select coalesce(sum(total),0) t from public.pedido_itens where pedido_id = ped) s
      where p.id = ped;

      -- pagamento coerente com o estado
      insert into public.pagamentos (pedido_id, lojista_id, provedor, metodo, estado, valor, pago_em, criado_em)
      select ped, loja, 'mercadopago',
             (array['pix','cartao','boleto'])[1 + (i % 3)],
             case est
               when 'aguardando_pagamento' then (case when i % 8 = 0 then 'recusado' else 'pendente' end)
               when 'cancelado' then (case when i % 2 = 0 then 'estornado' else 'pendente' end)
               else 'aprovado' end,
             p.total,
             case when est not in ('aguardando_pagamento','cancelado') then now() - (i * 3 || ' days')::interval end,
             now() - (i * 3 || ' days')::interval
        from public.pedidos p where p.id = ped;

      -- produção para quem já pagou
      if est in ('em_producao','pronto','enviado','entregue') then
        insert into public.producao (pedido_id, etapa, responsavel, iniciada_em, concluida_em)
        values (ped,
          case est when 'em_producao' then (array['impressao','acabamento','revisao'])[1 + (i % 3)] else 'pronto' end,
          (array['Marina','Rafael','Camila'])[1 + (i % 3)],
          now() - (i * 3 - 1 || ' days')::interval,
          case when est <> 'em_producao' then now() - (i * 3 - 2 || ' days')::interval end);
      end if;

      -- expedição para quem saiu
      if est in ('enviado','entregue') then
        insert into public.expedicao (pedido_id, transportadora, rastreio, estado, postado_em, entregue_em, endereco)
        values (ped,
          (array['Correios','Jadlog','Loggi'])[1 + (i % 3)],
          'BR' || lpad((100000 + i * 137)::text, 9, '0') || 'BR',
          case when est = 'entregue' then 'entregue'
               when i % 9 = 0 then 'devolvido' else 'em_transito' end,
          now() - (i * 3 - 3 || ' days')::interval,
          case when est = 'entregue' then now() - (i * 3 - 5 || ' days')::interval end,
          jsonb_build_object('cep','01310-100','cidade','São Paulo','uf','SP',
                             'rua','Av. Paulista','numero', 1000 + i));
      end if;
    end loop;
  end if;

  --------------------------------------------------------------------- chamados
  insert into public.chamados (lojista_id, cliente_id, assunto, mensagem, estado, prioridade)
  select loja, cli, c.assunto, c.msg, c.est, c.pri
    from (values
      ('Prazo de entrega','O álbum chega antes do dia 20?','aberto','alta'),
      ('Cor da capa','A capa saiu mais clara que na tela.','respondido','normal'),
      ('Troca de foto','Posso trocar uma foto depois de finalizar?','resolvido','baixa')
    ) as c(assunto,msg,est,pri)
   where not exists (select 1 from public.chamados x where x.lojista_id = loja and x.assunto = c.assunto);

  -------------------------------------------------------------------- auditoria
  insert into public.auditoria (lojista_id, acao, entidade, detalhe)
  select loja, a.acao, a.ent, a.det::jsonb
    from (values
      ('pedido.criado','pedidos','{"origem":"loja"}'),
      ('pagamento.aprovado','pagamentos','{"metodo":"pix"}'),
      ('producao.iniciada','producao','{"etapa":"impressao"}'),
      ('pedido.cancelado','pedidos','{"motivo":"Cliente desistiu"}'),
      ('produto.criado','produtos','{"sku":"FL-3030"}')
    ) as a(acao,ent,det)
   where not exists (select 1 from public.auditoria x where x.lojista_id = loja and x.acao = a.acao);

  raise notice 'pronto: % pedidos, % produtos, % vendedores',
    (select count(*) from public.pedidos where lojista_id = loja),
    (select count(*) from public.produtos where lojista_id = loja),
    (select count(*) from public.vendedores where lojista_id = loja);
end $$;
