import { criarProjeto } from '@/app/actions';

export default function BotaoNovoProjeto() {
  return (
    <form action={criarProjeto}>
      <button
        type="submit"
        className="rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-brand-fg"
      >
        Novo projeto
      </button>
    </form>
  );
}
