'use client';

import MenuInferior, { type ItemMenu, type AcaoCentral } from '@/components/MenuInferior';
import { MENU_LOJISTA } from '@/lib/rotas-lojista';
import {
  IconGrade,
  IconUsuario,
  IconGaleria,
  IconRelogio,
  IconInfo,
  IconCompartilhar,
  IconAlerta,
  IconOlho,
  IconMais,
} from '@/components/icons';

/**
 * Navegação de celular do painel do lojista.
 *
 * Dois destinos de cada lado da ação central. Pedidos é o que o lojista mais
 * abre no telefone; cadastrar cliente é o que ele mais faz, então é ela que
 * ganha o botão em destaque.
 *
 * O `href` de cada extra sai de `MENU_LOJISTA`, e módulo ainda sem tela fica
 * sem href — o `MenuInferior` já trata isso como item inativo. Antes esta
 * lista tinha rótulos escritos à mão sem href nenhum: seis itens que não
 * levavam a lugar algum.
 */
const rota = (rotulo: string) => MENU_LOJISTA.find((m) => m.rotulo === rotulo && m.pronto)?.rota;

const PRINCIPAIS: ItemMenu[] = [
  { rotulo: 'Início', href: rota('Dashboard'), icone: <IconGrade size={30} /> },
  { rotulo: 'Pedidos', href: rota('Pedidos'), icone: <IconCompartilhar size={30} /> },
  { rotulo: 'Clientes', href: rota('Clientes'), icone: <IconUsuario size={30} /> },
];

const ACAO: AcaoCentral = {
  rotulo: 'Novo cliente',
  href: '/clientes',
  icone: <IconMais size={28} />,
};

const EXTRAS: ItemMenu[] = [
  { rotulo: 'Projetos', href: rota('Projetos'), icone: <IconGaleria size={26} /> },
  { rotulo: 'Produção', href: rota('Produção'), icone: <IconRelogio size={26} /> },
  { rotulo: 'Renderização', href: rota('Renderização'), icone: <IconAlerta size={26} /> },
  { rotulo: 'Expedição', href: rota('Expedição'), icone: <IconOlho size={26} /> },
  { rotulo: 'Catálogo', href: rota('Catálogo'), icone: <IconGaleria size={26} /> },
  { rotulo: 'Financeiro', href: rota('Financeiro'), icone: <IconInfo size={26} /> },
  { rotulo: 'Relatórios', href: rota('Relatórios'), icone: <IconInfo size={26} /> },
  { rotulo: 'Configurações', href: rota('Configurações'), icone: <IconRelogio size={26} /> },
];

export default function MenuLojista() {
  return <MenuInferior principais={PRINCIPAIS} extras={EXTRAS} acao={ACAO} onSair />;
}
