import { identidadeLojista } from '@/lib/lojista';
import ShellLojistaCliente from '@/components/app/ShellLojistaCliente';

/**
 * Moldura do painel do lojista.
 *
 * É componente de SERVIDOR só para buscar quem está logado: o design trazia
 * "Marta Reis" e "marta@labcores.com.br" escritos à mão, então todo lojista
 * via o nome de outra pessoa. Resolver aqui evita passar a identidade por
 * propriedade em cada uma das telas.
 */
export default async function ShellLojista({
  ativo,
  children,
  cartaoPlano,
}: {
  ativo: number;
  children: React.ReactNode;
  cartaoPlano?: React.ReactNode;
}) {
  const identidade = await identidadeLojista();

  return (
    <ShellLojistaCliente ativo={ativo} cartaoPlano={cartaoPlano} identidade={identidade}>
      {children}
    </ShellLojistaCliente>
  );
}
