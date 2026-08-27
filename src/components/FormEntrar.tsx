'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Modo = 'entrar' | 'criar';

export default function FormEntrar({ next }: { next: string }) {
  const router = useRouter();
  const [modo, setModo] = useState<Modo>('entrar');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setAviso(null);
    setCarregando(true);
    const supabase = createClient();

    if (modo === 'entrar') {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      setCarregando(false);
      if (error) return setErro('E-mail ou senha inválidos.');
      router.replace(next);
      router.refresh();
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { nome },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setCarregando(false);
    if (error) return setErro(error.message);
    setAviso('Enviamos um e-mail de confirmação. Verifique sua caixa de entrada.');
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
    setAviso('Link de acesso enviado para o seu e-mail.');
  }

  const input =
    'w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand';

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {modo === 'criar' && (
        <input
          className={input}
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          autoComplete="name"
        />
      )}

      <input
        className={input}
        type="email"
        required
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />

      <input
        className={input}
        type="password"
        required
        minLength={6}
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        autoComplete={modo === 'entrar' ? 'current-password' : 'new-password'}
      />

      {erro && <p className="text-sm text-red-600">{erro}</p>}
      {aviso && <p className="text-sm text-green-700">{aviso}</p>}

      <button
        type="submit"
        disabled={carregando}
        className="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-brand-fg disabled:opacity-50"
      >
        {carregando ? 'Aguarde…' : modo === 'entrar' ? 'Entrar' : 'Criar conta'}
      </button>

      <button
        type="button"
        onClick={linkMagico}
        disabled={carregando}
        className="w-full rounded-xl border border-border px-4 py-2.5 text-sm disabled:opacity-50"
      >
        Receber link de acesso por e-mail
      </button>

      <p className="pt-2 text-center text-sm text-muted">
        {modo === 'entrar' ? 'Ainda não tem conta?' : 'Já tem conta?'}{' '}
        <button
          type="button"
          className="font-medium underline underline-offset-2"
          onClick={() => {
            setModo(modo === 'entrar' ? 'criar' : 'entrar');
            setErro(null);
            setAviso(null);
          }}
        >
          {modo === 'entrar' ? 'Criar conta' : 'Entrar'}
        </button>
      </p>
    </form>
  );
}
