'use client';

import { useRef, useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { salvarAvatar, salvarPerfil } from '@/app/actions-perfil';
import type { PerfilCliente } from '@/lib/cliente';

const CARTAO = 'rounded-[18px] border border-line bg-surface';
const CAMPO =
  'h-11 w-full rounded-[14px] border border-line bg-surface px-3.5 text-[14px] text-ink outline-none focus:border-blue';
const ROTULO = 'text-[12.5px] font-semibold text-ink-3';

export default function PainelMinhaConta({
  perfil,
  resumo,
}: {
  perfil: PerfilCliente;
  resumo: { projetos: number; prontos: number; emAndamento: number; galerias: number };
}) {
  const [avatar, setAvatar] = useState(perfil.avatar_url);
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [pendente, iniciar] = useTransition();
  const arquivo = useRef<HTMLInputElement>(null);

  const iniciais =
    (perfil.nome ?? perfil.email)
      .split(/[ @.]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || '?';

  /**
   * Envia a foto direto ao Storage, com a sessão do próprio cliente.
   *
   * Passar a imagem pelo servidor dobraria a transferência sem ganho: a política
   * do bucket já limita a escrita à pasta do usuário.
   */
  async function enviarFoto(f: File) {
    setAviso(null);
    if (!f.type.startsWith('image/')) return setAviso('Escolha uma imagem.');
    if (f.size > 5 * 1024 * 1024) return setAviso('A imagem precisa ter até 5 MB.');

    setEnviando(true);
    try {
      const supabase = createClient();
      const { data: s } = await supabase.auth.getUser();
      if (!s.user) throw new Error('sem sessão');

      // O caminho começa com o id do usuário porque é o que a política exige.
      // O sufixo de tempo evita o cache do navegador servir a foto antiga.
      const ext = (f.name.split('.').pop() || 'jpg').toLowerCase().slice(0, 5);
      const caminho = `${s.user.id}/perfil-${Date.now()}.${ext}`;

      const { error } = await supabase.storage.from('avatares').upload(caminho, f, { upsert: true });
      if (error) throw error;

      const { data } = supabase.storage.from('avatares').getPublicUrl(caminho);
      await salvarAvatar(perfil.id, data.publicUrl);
      setAvatar(data.publicUrl);
    } catch (e) {
      setAviso(e instanceof Error ? e.message : 'Não consegui enviar a foto.');
    } finally {
      setEnviando(false);
    }
  }

  const numeros: [string, number][] = [
    ['Álbuns', resumo.projetos],
    ['Em andamento', resumo.emAndamento],
    ['Prontos', resumo.prontos],
    ['Galerias', resumo.galerias],
  ];

  return (
    <div className="mx-auto flex max-w-[860px] flex-col gap-5">
      <div>
        <h1 className="m-0 text-[26px] font-extrabold tracking-[-.9px]">Minha conta</h1>
        <p className="m-0 mt-1.5 text-[13.5px] text-muted">
          Seus dados {perfil.loja ? `em ${perfil.loja.nome}` : 'nesta loja'}. Só você e a loja veem
          isto.
        </p>
      </div>

      {/* ------------------------------ foto ------------------------------ */}
      <section className={`${CARTAO} flex flex-wrap items-center gap-5 p-6`}>
        <span className="relative flex h-[92px] w-[92px] flex-none items-center justify-center overflow-hidden rounded-full bg-blue-soft text-[26px] font-extrabold text-blue">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            iniciais
          )}
        </span>

        <div className="min-w-[220px] flex-1">
          <p className="m-0 text-[15px] font-bold">Foto de perfil</p>
          <p className="m-0 mt-1 text-[12.5px] leading-[1.55] text-muted">
            Aparece no cabeçalho e ajuda a loja a reconhecer você. Imagem de até 5 MB.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => arquivo.current?.click()}
              disabled={enviando}
              className="h-10 rounded-[12px] bg-lente px-4 text-[13px] font-bold text-white shadow-card hover:brightness-[1.06] disabled:opacity-60"
            >
              {enviando ? 'Enviando…' : avatar ? 'Trocar foto' : 'Escolher foto'}
            </button>
            {avatar && (
              <button
                type="button"
                disabled={enviando}
                onClick={() =>
                  iniciar(async () => {
                    await salvarAvatar(perfil.id, null);
                    setAvatar(null);
                  })
                }
                className="h-10 rounded-[12px] border border-line px-4 text-[13px] font-semibold text-ink-3 hover:bg-coral-surface hover:text-[#E11D48]"
              >
                Remover
              </button>
            )}
          </div>
          {aviso && <p className="m-0 mt-2 text-[12.5px] font-semibold text-[#E11D48]">{aviso}</p>}
          <input
            ref={arquivo}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && enviarFoto(e.target.files[0])}
          />
        </div>
      </section>

      {/* ------------------------------ dados ----------------------------- */}
      <form action={(fd) => iniciar(() => salvarPerfil(perfil.id, fd))} className={`${CARTAO} p-6`}>
        <p className="m-0 mb-4 text-[15px] font-bold">Seus dados</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={ROTULO}>Nome</span>
            <input name="nome" defaultValue={perfil.nome ?? ''} placeholder="Como quer ser chamado" className={CAMPO} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={ROTULO}>Telefone</span>
            <input name="telefone" defaultValue={perfil.telefone ?? ''} placeholder="(11) 90000-0000" className={CAMPO} />
          </label>
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className={ROTULO}>E-mail</span>
            <input value={perfil.email} readOnly className={`${CAMPO} bg-page text-muted`} />
            <span className="text-[11.5px] text-muted-2">
              É por ele que você entra, e por isso não pode ser trocado aqui. Fale com a loja se
              precisar mudar.
            </span>
          </label>
        </div>
        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={pendente}
            className="h-11 rounded-[14px] bg-lente px-5 text-[13.5px] font-bold text-white shadow-card hover:brightness-[1.06] disabled:opacity-60"
          >
            {pendente ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>

      {/* ----------------------------- números ---------------------------- */}
      <section className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
        {numeros.map(([rot, val]) => (
          <div key={rot} className={`${CARTAO} px-5 py-4`}>
            <p className="m-0 text-[12.5px] text-muted-2">{rot}</p>
            <p className="m-0 mt-1 text-[26px] font-extrabold tracking-[-1px]">{val}</p>
          </div>
        ))}
      </section>

      <section className={`${CARTAO} p-6`}>
        <p className="m-0 text-[15px] font-bold">Sair</p>
        <p className="m-0 mt-1 text-[12.5px] leading-[1.55] text-muted">
          Você continua na loja; é só entrar de novo com o mesmo e-mail.
        </p>
        <form action="/auth/sair" method="post" className="mt-3">
          <button
            type="submit"
            className="h-11 rounded-[14px] border border-line px-5 text-[13.5px] font-bold text-[#E11D48] hover:bg-coral-surface"
          >
            Sair da conta
          </button>
        </form>
      </section>
    </div>
  );
}
