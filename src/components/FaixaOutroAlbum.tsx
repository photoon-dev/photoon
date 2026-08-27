import { criarProjeto } from '@/app/actions';
import { IconMais } from '@/components/icons';

/**
 * Faixa do rodapé de Meus projetos: convida a montar outro álbum com as
 * mesmas fotos, respeitando o limite que o lojista definiu na galeria.
 */
export default function FaixaOutroAlbum({
  galeriaId,
  restantes,
  maximo,
}: {
  galeriaId: string;
  restantes: number;
  maximo: number;
}) {
  if (restantes <= 0) return null;

  return (
    <section className="flex flex-wrap items-center justify-between gap-4 rounded-control border border-line bg-surface px-6 py-5">
      <div className="min-w-0">
        <p className="m-0 text-[15px] font-bold">Quer montar outro álbum com as mesmas fotos?</p>
        <p className="m-0 mt-1 text-[12.5px] text-muted">
          A Photoon liberou a criação de até {maximo} {maximo === 1 ? 'álbum' : 'álbuns'} nesta
          galeria — {restantes} ainda {restantes === 1 ? 'disponível' : 'disponíveis'}.
        </p>
      </div>

      <form action={criarProjeto} className="flex-none">
        <input type="hidden" name="galeria_id" value={galeriaId} />
        <input type="hidden" name="titulo" value="Novo álbum" />
        <button
          type="submit"
          className="flex h-11 items-center gap-2 rounded-field bg-lente px-5 text-[13.5px] font-bold text-white shadow-card hover:brightness-[1.06]"
        >
          <IconMais size={16} />
          Criar outro álbum
        </button>
      </form>
    </section>
  );
}
