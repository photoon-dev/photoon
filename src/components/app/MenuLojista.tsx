'use client';

import MenuInferior, { type ItemMenu, type AcaoCentral } from '@/components/MenuInferior';
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
 * Dois destinos de cada lado da ação central. Cadastrar cliente é o que o
 * lojista mais faz, então é ela que ganha o botão em destaque.
 */
const PRINCIPAIS: ItemMenu[] = [
  { rotulo: 'Início', href: '/', icone: <IconGrade size={30} /> },
  { rotulo: 'Clientes', href: '/clientes', icone: <IconUsuario size={30} /> },
  { rotulo: 'Modelos', href: '/templates', icone: <IconGaleria size={30} /> },
];

const ACAO: AcaoCentral = {
  rotulo: 'Novo cliente',
  href: '/clientes',
  icone: <IconMais size={28} />,
};

const EXTRAS: ItemMenu[] = [
  { rotulo: 'Ajustes', href: '/configuracoes', icone: <IconRelogio size={26} /> },
  { rotulo: 'Pedidos', icone: <IconCompartilhar size={26} /> },
  { rotulo: 'Produção', icone: <IconRelogio size={26} /> },
  { rotulo: 'Expedição', icone: <IconOlho size={26} /> },
  { rotulo: 'Catálogo', icone: <IconGaleria size={26} /> },
  { rotulo: 'Financeiro', icone: <IconAlerta size={26} /> },
  { rotulo: 'Relatórios', icone: <IconInfo size={26} /> },
];

export default function MenuLojista() {
  return <MenuInferior principais={PRINCIPAIS} extras={EXTRAS} acao={ACAO} onSair />;
}
