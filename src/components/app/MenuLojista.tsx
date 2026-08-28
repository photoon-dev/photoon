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
  { rotulo: 'Início', href: '/', icone: <IconGrade size={26} /> },
  { rotulo: 'Clientes', href: '/clientes', icone: <IconUsuario size={26} /> },
  { rotulo: 'Modelos', href: '/templates', icone: <IconGaleria size={26} /> },
  { rotulo: 'Ajustes', href: '/configuracoes', icone: <IconRelogio size={26} /> },
];

const EXTRAS: ItemMenu[] = [
  { rotulo: 'Pedidos', icone: <IconCompartilhar size={24} /> },
  { rotulo: 'Produção', icone: <IconRelogio size={24} /> },
  { rotulo: 'Expedição', icone: <IconOlho size={24} /> },
  { rotulo: 'Catálogo', icone: <IconGaleria size={24} /> },
  { rotulo: 'Financeiro', icone: <IconAlerta size={24} /> },
  { rotulo: 'Relatórios', icone: <IconInfo size={24} /> },
];

export default function MenuLojista() {
  return <MenuInferior principais={PRINCIPAIS} extras={EXTRAS} onSair />;
}
