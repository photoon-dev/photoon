'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { IconEmail, IconCadeado, IconSeta, IconTique } from '@/components/icons';

const IconEscudo = ({ size = 15, cor }: { size?: number; cor: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke={cor}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3.5 5 6.5v5c0 4.3 2.9 7.6 7 9 4.1-1.4 7-4.7 7-9v-5z" />
    <path d="m9.3 12 1.9 1.9 3.6-3.9" />
  </svg>
);

export default function FormEntrarLojista({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [manter, setManter] = useState(true);
  const [foco, setFoco] = useState<'email' | 'senha' | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const campo = (ativo: boolean) =>
    `flex h-[52px] items-center gap-2.5 rounded-2xl border-[1.5px] bg-surface pl-4 pr-2 transition-all ${
      ativo ? 'border-blue shadow-[0_0_0_4px_rgba(37,99,235,.12)]' : 'border-line shadow-[0_1px_3px_rgba(11,18,32,.04)]'
    }`;
  const input =
    'min-w-0 flex-1 border-0 bg-transparent text-[14.5px] text-ink outline-none';

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setAviso(null);
    setCarregando(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

    if (error) {
      setCarregando(false);
      return setErro('E-mail ou senha inválidos.');
    }

    // Autenticar não basta: o painel é só para quem administra alguma loja.
    // Um cliente final com senha certa não pode entrar aqui.
    const { data: membro } = await supabase.from('lojista_membros').select('id').limit(1);
    const { data: superAdmin } = await supabase.from('super_admins').select('user_id').limit(1);

    if ((!membro || membro.length === 0) && (!superAdmin || superAdmin.length === 0)) {
      await supabase.auth.signOut();
      setCarregando(false);
      return setErro('Esta conta não administra nenhuma loja.');
    }

    router.replace(next);
    router.refresh();
  }

  async function linkMagico() {
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
    setAviso('Se houver uma conta com esse e-mail, enviamos um link de acesso.');
  }

  return (
    <form onSubmit={entrar}>
      <div className="mb-4 flex flex-col gap-2">
        <label htmlFor="email" className="text-[12.5px] font-semibold text-ink-3">
          E-mail corporativo
        </label>
        <div className={campo(foco === 'email')}>
          <span className="flex-none text-muted-2">
            <IconEmail />
          </span>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="voce@laboratorio.com"
            className={input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFoco('email')}
            onBlur={() => setFoco(null)}
          />
        </div>
      </div>

      <div className="mb-[18px] flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <label htmlFor="senha" className="text-[12.5px] font-semibold text-ink-3">
            Senha
          </label>
          <button
            type="button"
            onClick={linkMagico}
            className="text-[12.5px] font-semibold text-blue hover:text-blue-hover"
          >
            Esqueci minha senha
          </button>
        </div>
        <div className={campo(foco === 'senha')}>
          <span className="flex-none text-muted-2">
            <IconCadeado />
          </span>
          <input
            id="senha"
            type={verSenha ? 'text' : 'password'}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className={input}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onFocus={() => setFoco('senha')}
            onBlur={() => setFoco(null)}
          />
          <button
            type="button"
            onClick={() => setVerSenha((v) => !v)}
            className="rounded-full px-2.5 py-1.5 text-[12.5px] font-semibold text-muted hover:bg-blue-soft hover:text-blue"
          >
            {verSenha ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setManter((m) => !m)}
          aria-pressed={manter}
          className="flex items-center gap-2.5"
        >
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-[7px] border-[1.5px] transition-all ${
              manter ? 'border-blue bg-lente text-white' : 'border-[#CBD5E6] bg-surface text-transparent'
            }`}
          >
            <IconTique />
          </span>
          <span className="text-[13.5px] text-ink-2">Continuar conectado</span>
        </button>

        <span className="flex items-center gap-[7px] text-[12.5px] text-muted">
          <IconEscudo cor="#10B981" />
          Conexão protegida
        </span>
      </div>

      {erro && (
        <p className="mb-4 rounded-2xl bg-coral-surface px-4 py-3 text-[13px] font-semibold text-coral">
          {erro}
        </p>
      )}
      {aviso && (
        <p className="mb-4 rounded-2xl bg-green-surface px-4 py-3 text-[13px] font-semibold text-green">
          {aviso}
        </p>
      )}

      <button
        type="submit"
        disabled={carregando}
        className="flex h-[54px] w-full items-center justify-center gap-2.5 rounded-2xl bg-lente text-[15.5px] font-bold text-white shadow-[0_12px_26px_rgba(37,99,235,.3)] hover:brightness-[1.06] disabled:opacity-60"
      >
        {carregando ? 'Aguarde…' : 'Entrar na plataforma'}
        {!carregando && <IconSeta size={18} />}
      </button>

      <div className="my-5 flex items-center gap-3.5">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[11.5px] font-semibold tracking-[1.4px] text-muted-2">OU</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      {/* O design traz também "Entrar com SSO"; entra quando houver provedor. */}
      <button
        type="button"
        onClick={linkMagico}
        disabled={carregando}
        className="flex h-[50px] w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-2xl border border-line bg-surface text-[13.5px] font-semibold text-ink hover:border-[#D6E2FC] hover:bg-blue-soft disabled:opacity-60"
      >
        <span className="text-cyan">
          <IconEmail />
        </span>
        Link mágico
      </button>
    </form>
  );
}
