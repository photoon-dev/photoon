'use client';

import { useState } from 'react';
import type { DadosVitrine } from '@/lib/comercial';
import { reais } from '@/lib/preco';

const CARD = 'rounded-[18px] border border-line bg-surface';
const BOTAO =
  'flex h-11 items-center justify-center gap-2 rounded-[14px] border border-line bg-surface px-4 text-[13.5px] font-semibold text-ink hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue';
const BOTAO_PRIMARIO =
  'flex h-11 items-center justify-center gap-2 rounded-[14px] bg-lente px-4 text-[13.5px] font-bold text-white shadow-card hover:brightness-[1.06]';

/**
 * A vitrine: o que o cliente encontra ao abrir a loja.
 *
 * Tela de leitura de propósito. Marca, cores e textos de apoio já têm dono em
 * Configurações; duplicar os campos aqui criaria dois formulários gravando na
 * mesma linha de `lojistas`, e um deles ficaria para trás.
 */
export default function PainelLoja({
  dados,
  dominio,
}: {
  dados: DadosVitrine;
  dominio: string;
}) {
  const [copiado, setCopiado] = useState(false);
  const { loja } = dados;
  const endereco = `https://${loja.slug}.${dominio}`;

  const primaria = loja.cor_primaria || '#2563EB';
  const secundaria = loja.cor_secundaria || '#06B6D4';

  async function copiar() {
    try {
      await navigator.clipboard.writeText(`${endereco}/entrar`);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Sem permissão de área de transferência o link continua visível na tela;
      // não vale quebrar a página por isso.
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="m-0 text-[12.5px] font-semibold uppercase tracking-[1.2px] text-muted-2">
            Loja e catálogo · Loja
          </p>
          <h1 className="m-0 mt-1.5 text-[26px] font-extrabold tracking-[-.9px]">
            Sua vitrine
          </h1>
          <p className="m-0 mt-1.5 text-[13.5px] text-muted">
            É assim que o seu cliente vê a loja quando abre o link.
          </p>
        </div>
        <div className="flex gap-2">
          <a href="/configuracoes" className={BOTAO}>
            Editar marca e cores
          </a>
          <a href={`${endereco}/entrar`} target="_blank" rel="noreferrer" className={BOTAO_PRIMARIO}>
            Abrir a loja
          </a>
        </div>
      </div>

      {!loja.ativo && (
        <p className="m-0 rounded-[14px] bg-coral-surface px-4 py-3 text-[13px] font-semibold text-coral">
          Esta loja está desativada na plataforma — o link não abre para os clientes.
        </p>
      )}

      {/* ---------------- link de acesso ---------------- */}
      <section className={`${CARD} p-6`}>
        <p className="m-0 mb-1 text-[15px] font-bold">Link de acesso</p>
        <p className="m-0 mb-4 text-[12.5px] text-muted">
          Mande este endereço para o cliente. Ele entra com o e-mail que você cadastrou em Clientes.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <code className="rounded-[12px] border border-line bg-surface-2 px-3.5 py-2.5 text-[13.5px] font-semibold text-ink">
            {endereco}/entrar
          </code>
          <button onClick={copiar} className={BOTAO}>
            {copiado ? 'Copiado' : 'Copiar link'}
          </button>
        </div>
        <p className="m-0 mt-4 text-[12.5px] text-muted">
          {dados.clientes} cliente{dados.clientes === 1 ? '' : 's'} cadastrado
          {dados.clientes === 1 ? '' : 's'} · {dados.clientesQueEntraram} já entrou
          {dados.clientes - dados.clientesQueEntraram > 0 &&
            ` · ${dados.clientes - dados.clientesQueEntraram} nunca acessou`}
        </p>
      </section>

      {/* ---------------- prévia da marca ---------------- */}
      <section className={`${CARD} overflow-hidden`}>
        <div
          className="flex flex-wrap items-center gap-4 px-6 py-7"
          style={{ background: `linear-gradient(135deg,${primaria},${secundaria})` }}
        >
          {loja.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- logo do lojista vem do Storage, fora do otimizador
            <img
              src={loja.logo_url}
              alt={loja.nome}
              className="h-14 w-14 flex-none rounded-[16px] bg-white object-contain p-1.5"
            />
          ) : (
            <span className="flex h-14 w-14 flex-none items-center justify-center rounded-[16px] bg-white/25 text-[18px] font-extrabold text-white">
              {loja.nome.slice(0, 2).toUpperCase()}
            </span>
          )}
          <span className="min-w-0">
            <span className="block text-[19px] font-extrabold tracking-[-.4px] text-white">
              {loja.nome}
            </span>
            <span className="block text-[13px] text-white/85">
              {loja.descricao || 'Sem descrição — o cliente vê só o nome da loja.'}
            </span>
          </span>
        </div>

        <div className="flex flex-wrap gap-6 px-6 py-5">
          {[
            ['Cor primária', primaria, loja.cor_primaria],
            ['Cor secundária', secundaria, loja.cor_secundaria],
          ].map(([rotulo, valor, definida]) => (
            <span key={rotulo as string} className="flex items-center gap-2.5">
              <span
                className="h-8 w-8 flex-none rounded-[10px] border border-line"
                style={{ background: valor as string }}
              />
              <span>
                <span className="block text-[12.5px] font-semibold text-ink-3">{rotulo}</span>
                <span className="block text-[12px] text-muted-2">
                  {valor}
                  {!definida && ' · padrão da plataforma'}
                </span>
              </span>
            </span>
          ))}
          <span className="min-w-[180px]">
            <span className="block text-[12.5px] font-semibold text-ink-3">Suporte</span>
            <span className="block text-[12px] text-muted-2">
              {loja.email_suporte || loja.telefone_suporte || 'nenhum contato configurado'}
            </span>
          </span>
        </div>
      </section>

      {/* ---------------- produtos publicados ---------------- */}
      <section>
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <p className="m-0 text-[13px] font-bold uppercase tracking-[1.2px] text-muted-2">
            Produtos na vitrine
          </p>
          <p className="m-0 text-[12.5px] text-muted-2">
            {dados.produtosOcultos > 0 && `${dados.produtosOcultos} produto(s) fora da vitrine · `}
            <a href="/catalogo" className="font-semibold text-blue">
              gerenciar catálogo
            </a>
          </p>
        </div>

        {dados.produtosPublicados.length === 0 ? (
          <div className={`${CARD} p-8 text-center`}>
            <p className="m-0 text-[15px] font-bold">A vitrine está vazia</p>
            <p className="mx-auto m-0 mt-2 max-w-[520px] text-[13.5px] text-muted">
              {dados.produtosOcultos > 0
                ? 'Você tem produtos cadastrados, mas nenhum está ativo. Publique-os no Catálogo para que apareçam aqui.'
                : 'Cadastre um produto no Catálogo e ative-o. É o que o cliente vai poder comprar.'}
            </p>
            <a href="/catalogo" className={`${BOTAO_PRIMARIO} mx-auto mt-5 w-fit`}>
              Ir para o Catálogo
            </a>
          </div>
        ) : (
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
            {dados.produtosPublicados.map((p) => (
              <div key={p.id} className={`${CARD} p-5`}>
                <p className="m-0 text-[14.5px] font-bold">{p.nome}</p>
                <p className="m-0 mt-1 text-[12.5px] text-muted">
                  {p.descricao || p.categoria}
                </p>
                <p className="m-0 mt-3 text-[17px] font-extrabold tracking-[-.5px]">
                  {reais(p.preco_base)}
                </p>
                <p className="m-0 mt-0.5 text-[12px] text-muted-2">
                  entrega em {p.prazo_producao_dias} dia{p.prazo_producao_dias === 1 ? '' : 's'}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---------------- modelos publicados ---------------- */}
      <section>
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <p className="m-0 text-[13px] font-bold uppercase tracking-[1.2px] text-muted-2">
            Modelos que o cliente pode montar
          </p>
          <p className="m-0 text-[12.5px] text-muted-2">
            {dados.modelosOcultos > 0 && `${dados.modelosOcultos} não publicado(s) · `}
            <a href="/templates" className="font-semibold text-blue">
              temas e templates
            </a>
          </p>
        </div>

        {dados.modelosPublicados.length === 0 ? (
          <div className={`${CARD} p-6`}>
            <p className="m-0 text-[13.5px] text-muted">
              Nenhum modelo publicado. Sem modelo o cliente não consegue começar um álbum — publique
              um em Temas e templates.
            </p>
          </div>
        ) : (
          <div className={`${CARD} flex flex-wrap gap-x-6 gap-y-3 p-5`}>
            {dados.modelosPublicados.map((m) => (
              <span key={m.id} className="text-[13px]">
                <span className="font-semibold">{m.nome}</span>
                <span className="text-muted-2">
                  {' '}
                  · {m.largura_mm / 10}×{m.altura_mm / 10} cm
                </span>
              </span>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
