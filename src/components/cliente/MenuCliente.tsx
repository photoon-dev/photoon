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

/**
 * Navegação de celular da área do cliente final.
 *
 * Sem ação central: quem cria álbum é o lojista, e as telas de galeria,
 * criação e revisão ainda não existem.
 */
const PRINCIPAIS: ItemMenu[] = [
  { rotulo: 'Projetos', href: '/meus-projetos', icone: <IconGrade size={30} /> },
  { rotulo: 'Galeria', icone: <IconGaleria size={30} /> },
  { rotulo: 'Criar', icone: <IconSparkle size={30} /> },
];

const EXTRAS: ItemMenu[] = [
  { rotulo: 'Revisão', icone: <IconCheck size={26} /> },
  { rotulo: 'Editor', icone: <IconLapis size={26} /> },
  { rotulo: 'Compartilhar', icone: <IconCompartilhar size={26} /> },
  { rotulo: 'Ajuda', icone: <IconInfo size={26} /> },
  { rotulo: 'Minha conta', icone: <IconUsuario size={26} /> },
];

export default function MenuCliente() {
  return <MenuInferior principais={PRINCIPAIS} extras={EXTRAS} onSair />;
}
