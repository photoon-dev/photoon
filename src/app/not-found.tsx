import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-xl font-semibold">Página não encontrada</h1>
      <p className="max-w-sm text-sm text-muted">
        O endereço não existe ou este álbum não pertence à sua conta.
      </p>
      <Link href="/meus-projetos" className="rounded-xl border border-border px-4 py-2 text-sm">
        Ir para meus projetos
      </Link>
    </main>
  );
}
