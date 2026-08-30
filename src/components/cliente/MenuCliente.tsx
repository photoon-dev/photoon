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
 * Sem ação central: quem cria álbum é o lojista. Item sem `href` é tela que
 * ainda não existe — criar com IA, revisão e compartilhar.
 */
const PRINCIPAIS: ItemMenu[] = [
  { rotulo: 'Projetos', href: '/meus-projetos', icone: <IconGrade size={30} /> },
  { rotulo: 'Galeria', href: '/galeria', icone: <IconGaleria size={30} /> },
  { rotulo: 'Criar', icone: <IconSparkle size={30} /> },
];

const EXTRAS: ItemMenu[] = [
  { rotulo: 'Revisão', icone: <IconCheck size={26} /> },
  { rotulo: 'Editor', icone: <IconLapis size={26} /> },
  { rotulo: 'Compartilhar', icone: <IconCompartilhar size={26} /> },
  { rotulo: 'Ajuda', href: '/ajuda', icone: <IconInfo size={26} /> },
  { rotulo: 'Minha conta', href: '/minha-conta', icone: <IconUsuario size={26} /> },
];

export default function MenuCliente() {
  return <MenuInferior principais={PRINCIPAIS} extras={EXTRAS} onSair />;
}
