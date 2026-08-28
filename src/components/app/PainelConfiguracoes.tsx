'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { salvarLoja } from '@/app/app/actions';

const CARD = 'rounded-[18px] border border-line bg-surface p-6';
const CAMPO =
  'h-11 w-full rounded-[14px] border border-line bg-surface px-3.5 text-[14px] text-ink outline-none focus:border-blue';
const ROTULO = 'text-[12.5px] font-semibold text-ink-3';
const AJUDA = 'text-[11.5px] text-muted-2';

export type DadosLoja = {
  id: string;
  slug: string;
  nome: string;
  logo_url: string | null;
  cor_primaria: string | null;
  cor_secundaria: string | null;
  descricao: string | null;
  telefone_suporte: string | null;
  email_suporte: string | null;
  url_politica: string | null;
  url_contato: string | null;
};

export default function PainelConfiguracoes({
  loja,
  dominio,
}: {
  loja: DadosLoja;
  dominio: string;
}) {
  const [slug, setSlug] = useState(loja.slug);
  const [logo, setLogo] = useState(loja.logo_url ?? '');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  /** Logo vai para o bucket público de marcas, com a sessão do lojista. */
  async function enviarLogo(arquivo: File) {
    setErro(null);
    setEnviando(true);
    try {
      const supabase = createClient();
      const caminho = `${loja.id}/logo-${Date.now()}-${arquivo.name.replace(/[^\w.\-]/g, '_')}`;
      const { error } = await supabase.storage
        .from('marcas')
        .upload(caminho, arquivo, { contentType: arquivo.type, upsert: true });
      if (error) throw new Error(error.message);

      const { data } = supabase.storage.from('marcas').getPublicUrl(caminho);
      setLogo(data.publicUrl);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao enviar a logo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form action={salvarLoja} className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="m-0 text-[12.5px] font-semibold uppercase tracking-[1.2px] text-muted-2">
            Sistema · Configurações
          </p>
          <h1 className="m-0 mt-1.5 text-[26px] font-extrabold tracking-[-.9px]">
            Configurações da loja
          </h1>
          <p className="m-0 mt-1.5 text-[13.5px] text-muted">
            O que você define aqui é o que o seu cliente vê ao entrar na loja.
          </p>
        </div>
        <button
          type="submit"
          className="flex h-11 items-center gap-2 rounded-[14px] bg-lente px-5 text-[13.5px] font-bold text-white shadow-card hover:brightness-[1.06]"
        >
          Salvar alterações
        </button>
      </div>

      {erro && (
        <p className="m-0 rounded-[14px] bg-coral-surface px-4 py-3 text-[13px] font-semibold text-coral">
          {erro}
        </p>
      )}

      {/* ---------------- identidade ---------------- */}
      <section className={CARD}>
        <p className="m-0 mb-4 text-[15px] font-bold">Identidade</p>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={ROTULO}>Nome da loja</span>
            <input name="nome" defaultValue={loja.nome} required className={CAMPO} />
            <span className={AJUDA}>Aparece no cabeçalho e no login do cliente.</span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={ROTULO}>Endereço da loja</span>
            <div className="flex items-center gap-1.5">
              <input
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                required
                className={`${CAMPO} text-right`}
              />
              <span className="whitespace-nowrap text-[13.5px] font-semibold text-muted">
                .{dominio}
              </span>
            </div>
            <span className={AJUDA}>
              Mudar o endereço quebra os links já enviados aos clientes.
            </span>
          </label>

          <label className="flex flex-col gap-1.5 md:col-span-2">
            <span className={ROTULO}>Descrição</span>
            <input
              name="descricao"
              defaultValue={loja.descricao ?? ''}
              placeholder="Uma linha sobre o estúdio"
              className={CAMPO}
            />
          </label>
        </div>
      </section>

      {/* ---------------- marca ---------------- */}
      <section className={CARD}>
        <p className="m-0 mb-4 text-[15px] font-bold">Marca</p>

        <div className="flex flex-wrap items-start gap-6">
          <div>
            <span className={`${ROTULO} mb-2 block`}>Logotipo</span>
            <div className="flex h-[88px] w-[180px] items-center justify-center overflow-hidden rounded-[14px] border border-dashed border-line bg-surface-2">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt="" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-[12px] text-muted-2">sem logo</span>
              )}
            </div>
            <input type="hidden" name="logo_url" value={logo} />
            <div className="mt-2 flex items-center gap-2">
              <label className="cursor-pointer rounded-[12px] border border-line px-3 py-2 text-[12.5px] font-semibold text-ink-3 hover:bg-blue-soft hover:text-blue">
                {enviando ? 'Enviando…' : logo ? 'Substituir' : 'Enviar'}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="hidden"
                  disabled={enviando}
                  onChange={(e) => e.target.files?.[0] && enviarLogo(e.target.files[0])}
                />
              </label>
              {logo && (
                <button
                  type="button"
                  onClick={() => setLogo('')}
                  className="text-[12.5px] font-semibold text-[#E11D48] hover:underline"
                >
                  Remover
                </button>
              )}
            </div>
            <span className={`${AJUDA} mt-1.5 block`}>PNG, SVG ou WEBP · fundo transparente</span>
          </div>

          <div className="flex gap-4">
            <label className="flex flex-col gap-1.5">
              <span className={ROTULO}>Cor principal</span>
              <input
                type="color"
                name="cor_primaria"
                defaultValue={loja.cor_primaria ?? '#2563EB'}
                className="h-11 w-24 cursor-pointer rounded-[14px] border border-line bg-surface"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ROTULO}>Cor de destaque</span>
              <input
                type="color"
                name="cor_secundaria"
                defaultValue={loja.cor_secundaria ?? '#06B6D4'}
                className="h-11 w-24 cursor-pointer rounded-[14px] border border-line bg-surface"
              />
            </label>
          </div>
        </div>
      </section>

      {/* ---------------- contato ---------------- */}
      <section className={CARD}>
        <p className="m-0 mb-1 text-[15px] font-bold">Contato e links</p>
        <p className="m-0 mb-4 text-[12.5px] text-muted">
          Aparecem no rodapé e no cartão de ajuda da tela de login.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={ROTULO}>Telefone de suporte</span>
            <input
              name="telefone_suporte"
              defaultValue={loja.telefone_suporte ?? ''}
              placeholder="(11) 90000-0000"
              className={CAMPO}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={ROTULO}>E-mail de suporte</span>
            <input
              name="email_suporte"
              type="email"
              defaultValue={loja.email_suporte ?? ''}
              placeholder="contato@estudio.com.br"
              className={CAMPO}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={ROTULO}>Política de privacidade</span>
            <input
              name="url_politica"
              type="url"
              defaultValue={loja.url_politica ?? ''}
              placeholder="https://…"
              className={CAMPO}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={ROTULO}>Página de contato</span>
            <input
              name="url_contato"
              type="url"
              defaultValue={loja.url_contato ?? ''}
              placeholder="https://…"
              className={CAMPO}
            />
          </label>
        </div>
      </section>
    </form>
  );
}
