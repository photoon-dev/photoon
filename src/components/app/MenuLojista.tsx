'use client';

import MenuInferior, { type ItemMenu } from '@/components/MenuInferior';
import {
  IconGrade,
  IconUsuario,
  IconGaleria,
  IconRelogio,
  IconInfo,
  IconCompartilhar,
  IconAlerta,
  IconOlho,
} from '@/components/icons';

/**
 * Navegação de celular do painel do lojista.
 *
 * Quatro destinos no rodapé — os que já existem — e o resto dos 20 módulos
 * do design na folha, esmaecidos enquanto não houver tela.
 */
const PRINCIPAIS: ItemMenu[] = [
  { rotulo: 'Início', href: '/', icone: <IconGrade size={30} /> },
  { rotulo: 'Clientes', href: '/clientes', icone: <IconUsuario size={30} /> },
  { rotulo: 'Modelos', href: '/templates', icone: <IconGaleria size={30} /> },
  { rotulo: 'Ajustes', href: '/configuracoes', icone: <IconRelogio size={30} /> },
];

const EXTRAS: ItemMenu[] = [
  { rotulo: 'Pedidos', icone: <IconCompartilhar size={26} /> },
  { rotulo: 'Produção', icone: <IconRelogio size={26} /> },
  { rotulo: 'Expedição', icone: <IconOlho size={26} /> },
  { rotulo: 'Catálogo', icone: <IconGaleria size={26} /> },
  { rotulo: 'Financeiro', icone: <IconAlerta size={26} /> },
  { rotulo: 'Relatórios', icone: <IconInfo size={26} /> },
];

export default function MenuLojista() {
  return <MenuInferior principais={PRINCIPAIS} extras={EXTRAS} onSair />;
}
