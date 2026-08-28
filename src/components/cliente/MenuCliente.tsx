'use client';

import MenuInferior, { type ItemMenu } from '@/components/MenuInferior';
import {
  IconGrade,
  IconGaleria,
  IconLapis,
  IconSparkle,
  IconCheck,
  IconCompartilhar,
  IconInfo,
  IconUsuario,
} from '@/components/icons';

/** Navegação de celular da área do cliente final. */
const PRINCIPAIS: ItemMenu[] = [
  { rotulo: 'Projetos', href: '/meus-projetos', icone: <IconGrade size={26} /> },
  { rotulo: 'Galeria', icone: <IconGaleria size={26} /> },
  { rotulo: 'Criar', icone: <IconSparkle size={26} /> },
  { rotulo: 'Revisão', icone: <IconCheck size={26} /> },
];

const EXTRAS: ItemMenu[] = [
  { rotulo: 'Editor', icone: <IconLapis size={24} /> },
  { rotulo: 'Compartilhar', icone: <IconCompartilhar size={24} /> },
  { rotulo: 'Ajuda', icone: <IconInfo size={24} /> },
  { rotulo: 'Minha conta', icone: <IconUsuario size={24} /> },
];

export default function MenuCliente() {
  return <MenuInferior principais={PRINCIPAIS} extras={EXTRAS} onSair />;
}
