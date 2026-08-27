'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  IconEmail,
  IconCadeado,
  IconSeta,
  IconTique,
  IconBalao,
  IconFechar,
  IconInfo,
} from '@/components/icons';

const CAMPO =
  'flex h-11 items-center gap-[11px] rounded-field border border-line bg-surface px-[15px] focus-within:border-blue';
const INPUT =
  'min-w-0 flex-1 border-0 bg-transparent font-[inherit] text-[14.5px] text-ink outline-none';

export default function FormEntrar({
  next,
  telefoneSuporte,
}: {
  next: string;
  telefoneSuporte: string | null;
}) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [manter, setManter] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [modal, setModal] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setAviso(null);
    setCarregando(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setCarregando(false);

    if (error) return setErro('E-mail ou senha inválidos.');
    router.replace(next);
    router.refresh();
  }

  async function linkPorEmail() {
    setErro(null);
    setAviso(null);
    if (!email) return setErro('Informe seu e-mail primeiro.');

    setCarregando(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setCarregando(false);

    if (error) return setErro(error.message);
    // Mensagem neutra: nao revela se a conta existe.
    setAviso('Se houver uma conta com esse e-mail, enviamos um link de acesso.');
  }

  async function recuperarSenha(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const alvo = new FormData(e.currentTarget).get('email');
    if (typeof alvo !== 'string' || !alvo) return;

    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(alvo, {
      redirectTo: `${window.location.origin}/auth/callback?next=/meus-projetos`,
    });
    setModal(false);
    setAviso('Se houver uma conta com esse e-mail, enviamos o link de redefinição.');
  }

  return (
    <>
      <form onSubmit={entrar} className="flex flex-col gap-[18px]">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-[12.5px] font-semibold text-ink-3">
            E-mail
          </label>
          <div className={CAMPO}>
            <span className="flex-none text-muted-2">
              <IconEmail />
            </span>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="voce@email.com"
              className={INPUT}
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="senha" className="text-[12.5px] font-semibold text-ink-3">
              Senha
            </label>
            <button
              type="button"
              onClick={() => setModal(true)}
              className="text-[12.5px] font-semibold text-blue hover:text-blue-hover"
            >
              Esqueci minha senha
            </button>
          </div>
          <div className={`${CAMPO} pr-[5px]`}>
            <span className="flex-none text-muted-2">
              <IconCadeado />
            </span>
            <input
              id="senha"
              type={verSenha ? 'text' : 'password'}
              required
              minLength={6}
              autoComplete="current-password"
              placeholder="Sua senha"
              className={INPUT}
              value={senha}
              onChange={(ev) => setSenha(ev.target.value)}
            />
            <button
              type="button"
              onClick={() => setVerSenha((v) => !v)}
              className="h-[34px] flex-none whitespace-nowrap rounded-full px-3 text-[12.5px] font-semibold text-muted hover:bg-blue-soft hover:text-blue"
            >
              {verSenha ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setManter((m) => !m)}
          className="flex w-max cursor-pointer items-center gap-2.5"
          aria-pressed={manter}
        >
          <span
            className={`flex h-[19px] w-[19px] flex-none items-center justify-center rounded-md border-[1.5px] transition-all ${
              manter
                ? 'border-blue bg-blue text-white'
                : 'border-[#CBD5E6] bg-surface text-transparent'
            }`}
          >
            <IconTique />
          </span>
          <span className="text-[13.5px] text-ink-3">Manter conectado neste dispositivo</span>
        </button>

        {erro && (
          <p className="m-0 rounded-control bg-coral-surface px-4 py-3 text-[13px] font-semibold text-coral">
            {erro}
          </p>
        )}
        {aviso && (
          <p className="m-0 rounded-control bg-green-surface px-4 py-3 text-[13px] font-semibold text-green">
            {aviso}
          </p>
        )}

        <button
          type="submit"
          disabled={carregando}
          className="flex h-[50px] items-center justify-center gap-2.5 rounded-field bg-lente text-[15px] font-bold text-white shadow-cta hover:brightness-[1.06] disabled:opacity-60"
        >
          {carregando ? 'Aguarde…' : 'Entrar e ver meus projetos'}
          {!carregando && <IconSeta />}
        </button>

        <div className="flex items-center gap-3.5">
          <span className="h-px flex-1 bg-line" />
          <span className="text-[11.5px] font-bold uppercase tracking-[1.2px] text-muted-2">ou</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <button
          type="button"
          onClick={linkPorEmail}
          disabled={carregando}
          className="flex h-12 w-full items-center justify-center gap-2.5 rounded-field border border-line bg-surface text-[14.5px] font-semibold text-ink hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue disabled:opacity-60"
        >
          <IconEmail />
          Receber link de acesso por e-mail
        </button>

        {telefoneSuporte && (
          <div className="flex items-center gap-[13px] rounded-control border border-line bg-surface px-[17px] py-[15px]">
            <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-xl bg-blue-soft text-blue">
              <IconBalao />
            </span>
            <div className="min-w-0 flex-1">
              <p className="m-0 text-[13.5px] font-bold">Problemas para acessar?</p>
              <p className="m-0 mt-[3px] text-[12.5px] text-muted">Fale conosco · {telefoneSuporte}</p>
            </div>
            <a
              href={`tel:${telefoneSuporte.replace(/\D/g, '')}`}
              className="flex-none text-[12.5px] font-bold"
            >
              Chamar
            </a>
          </div>
        )}
      </form>

      {modal && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-ink/50 backdrop-blur-[3px]"
            onClick={() => setModal(false)}
          />
          <div className="fixed inset-0 z-[61] flex items-center justify-center p-6">
            <form
              onSubmit={recuperarSenha}
              className="max-h-[86vh] w-[min(460px,100%)] overflow-y-auto rounded-control bg-surface shadow-modal"
            >
              <div className="flex items-start justify-between gap-5 border-b border-line-2 px-[26px] pb-[18px] pt-6">
                <div className="min-w-0">
                  <h2 className="m-0 text-[19px] font-extrabold tracking-[-.4px]">
                    Recuperar acesso
                  </h2>
                  <p className="m-0 mt-1.5 text-[13.5px] text-muted">
                    Enviaremos um link de redefinição para o e-mail cadastrado.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  aria-label="Fechar"
                  className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-xl border border-line text-muted hover:bg-blue-soft hover:text-blue"
                >
                  <IconFechar />
                </button>
              </div>

              <div className="flex flex-col gap-4 px-[26px] py-[22px]">
                <div className="flex flex-col gap-2">
                  <label htmlFor="rec-email" className="text-[12.5px] font-semibold text-ink-3">
                    E-mail
                  </label>
                  <input
                    id="rec-email"
                    name="email"
                    type="email"
                    required
                    defaultValue={email}
                    placeholder="voce@email.com"
                    className="h-11 rounded-field border border-line px-[15px] text-[14.5px] text-ink focus:border-blue"
                  />
                </div>
                <div className="flex items-start gap-3 rounded-field border border-[#EEF1F7] bg-surface-2 px-4 py-3.5">
                  <span className="mt-px flex-none text-blue">
                    <IconInfo />
                  </span>
                  <p className="m-0 text-[12.5px] leading-[1.55] text-ink-3">
                    Por segurança, a mensagem de confirmação é sempre a mesma, exista ou não uma
                    conta com esse dado.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 border-t border-line-2 bg-surface-2 px-[26px] py-[18px]">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="h-11 whitespace-nowrap rounded-field border border-line bg-surface px-[18px] text-sm font-semibold text-ink-3 hover:bg-blue-soft hover:text-blue"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="h-11 whitespace-nowrap rounded-field bg-lente px-5 text-sm font-bold text-white shadow-card hover:brightness-[1.06]"
                >
                  Enviar link
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}
