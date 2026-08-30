'use client';

import { useMemo, useState } from 'react';
import type { Notificacao } from '@/lib/data';

/**
 * A casca das telas do cliente: cabeçalho, trilho lateral, menu da conta,
 * gaveta de avisos e rodapé.
 *
 * Porte de `Component extends DCLogic` de `Cliente Minha conta.dc.html` —
 * mesmos nomes de valor e mesmas strings de estilo. As três telas do cliente
 * que não vieram no zip (Minha conta, Ajuda e Galeria de fotos) compartilham
 * esta casca; sem isso cada uma repetia as mesmas 60 linhas e elas saíam de
 * sincronia ao primeiro ajuste.
 *
 * O zip trazia "Julia Martins", "Formatura 2026" e "Photoon" escritos à mão no
 * cabeçalho. `tools/telas/cliente-casca.json` troca isso por binding; os
 * valores reais entram por aqui.
 */

export type LojaDaCasca = {
  nome: string;
  /** O endereço que o cliente vê sob o nome da loja: `<loja>.photoon.com.br`. */
  endereco: string;
  email: string | null;
  telefone: string | null;
  politica: string | null;
};

export type DonoDaCasca = {
  nome: string;
  email: string;
  /** Segunda linha do avatar: a turma, o evento — o que situa o cliente. */
  sub: string;
};

const quando = (iso: string) => {
  const d = new Date(iso);
  const min = Math.round((Date.now() - d.getTime()) / 60000);
  if (min < 2) return 'agora';
  if (min < 60) return `há ${min} min`;
  if (min < 60 * 24) return `há ${Math.round(min / 60)} h`;
  return (
    d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }) +
    `, ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
  );
};

export const iniciaisDe = (nome: string) =>
  nome
    .split(/[ @.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('') || '?';

/** Rota real de cada item do trilho. As telas que não existem caem em projetos. */
const ROTAS = {
  hrefProjetos: '/meus-projetos',
  hrefGaleria: '/galeria',
  hrefAjuda: '/ajuda',
  hrefConta: '/minha-conta',
  hrefEditor: '/meus-projetos',
  hrefCriarAlbum: '/meus-projetos',
  hrefRevisao: '/meus-projetos',
  hrefCompartilhar: '/meus-projetos',
  hrefDetalhe: '/meus-projetos',
  hrefPreview: '/meus-projetos',
  hrefFinalizar: '/meus-projetos',
  hrefEntrar: '/auth/sair',
};

export function useCascaCliente({
  dono,
  loja,
  notificacoes,
}: {
  dono: DonoDaCasca;
  loja: LojaDaCasca;
  notificacoes: Notificacao[];
}) {
  const [menu, setMenu] = useState(false);
  const [rail, setRail] = useState(false);
  const [notif, setNotif] = useState(false);
  const [sel, setSel] = useState<number | null>(null);
  const [lidas, setLidas] = useState<string[]>(
    notificacoes.filter((n) => n.lida).map((n) => n.id),
  );

  return useMemo(() => {
    const lista = notificacoes.map((n, i) => {
      const tom =
        n.tag === 'Pendência'
          ? ['#FEF3E2', '#B45309']
          : n.tag === 'Pronto'
            ? ['#E6F8F1', '#059669']
            : ['#F1F5FD', '#2563EB'];
      const lida = lidas.includes(n.id);
      return {
        tag: n.tag ?? 'Aviso',
        title: n.titulo,
        time: quando(n.criada_em),
        body: (n.corpo ?? '').split('\n').filter(Boolean),
        rowStyle:
          `display:flex;gap:12px;padding:14px 16px;border-radius:14px;border:1px solid ${sel === i ? '#D6E2FC' : '#EEF1F7'};` +
          `background:${sel === i ? '#F7FAFF' : '#FFFFFF'};cursor:pointer;text-align:left;font-family:inherit;width:100%`,
        tagStyle: `display:inline-block;padding:3px 9px;border-radius:999px;background:${tom[0]};color:${tom[1]};font-size:11px;font-weight:700`,
        titleStyle: `margin:8px 0 0;font-size:13.5px;font-weight:${lida ? 600 : 800};color:#0B1220;line-height:1.4`,
        dotStyle: `width:8px;height:8px;border-radius:999px;background:${lida ? 'transparent' : tom[1]};flex:0 0 auto;margin-top:6px`,
        pick: () => {
          setSel(i);
          setLidas((l) => (l.includes(n.id) ? l : [...l, n.id]));
        },
      };
    });
    const detalhe = sel === null ? null : lista[sel];
    const naoLidas = notificacoes.length - lidas.length;

    return {
      // ---------------------------------------------------------- trilho
      railStyle:
        `position:fixed;top:50%;left:18px;transform:translateY(-50%);z-index:45;display:flex;flex-direction:column;` +
        `gap:6px;padding:12px 10px;width:${rail ? 244 : 68}px;border-radius:26px;background:rgba(255,255,255,.94);` +
        `backdrop-filter:blur(14px);border:1px solid #E6EAF2;box-shadow:0 20px 44px rgba(11,18,32,${rail ? '.2' : '.14'});` +
        `overflow:hidden;transition:width .22s cubic-bezier(.2,.8,.2,1),box-shadow .22s`,
      railLabel:
        `font-size:14px;font-weight:600;white-space:nowrap;opacity:${rail ? 1 : 0};` +
        `transform:translateX(${rail ? 0 : -6}px);transition:opacity .18s ease,transform .22s cubic-bezier(.2,.8,.2,1);pointer-events:none`,
      openRail: () => setRail(true),
      closeRail: () => setRail(false),
      mainStyle: `flex:1;padding:30px 28px 56px ${rail ? 272 : 96}px;transition:padding-left .22s cubic-bezier(.2,.8,.2,1)`,

      // ---------------------------------------------------------- cabeçalho
      nomeLoja: loja.nome,
      enderecoLoja: loja.endereco,
      iniciais: iniciaisDe(dono.nome),
      nomeCliente: dono.nome,
      subCliente: dono.sub,
      emailCliente: dono.email,
      avatarBtn:
        `display:flex;align-items:center;gap:11px;padding:5px 12px 5px 5px;border:1px solid ${menu ? '#D6E2FC' : '#E6EAF2'};` +
        `border-radius:14px;background:#FFFFFF;cursor:pointer;transition:border-color .15s`,
      toggleMenu: () => setMenu((m) => !m),
      menuStyle:
        `position:absolute;top:56px;right:0;width:250px;background:#FFFFFF;border:1px solid #E6EAF2;border-radius:20px;` +
        `box-shadow:0 24px 50px rgba(11,18,32,.16);overflow:hidden;z-index:50;animation:menuIn .16s ease both;${menu ? '' : 'display:none'}`,

      // ---------------------------------------------------------- avisos
      bellStyle:
        `position:relative;width:42px;height:42px;border-radius:14px;border:1px solid ${notif ? '#D6E2FC' : '#E6EAF2'};` +
        `background:${notif ? '#F1F5FD' : '#FFFFFF'};display:flex;align-items:center;justify-content:center;` +
        `color:${notif ? '#2563EB' : '#46536A'};flex:0 0 auto;cursor:pointer;font-family:inherit;transition:background .15s,border-color .15s,color .15s`,
      bellDotStyle:
        `position:absolute;top:6px;right:6px;min-width:17px;height:17px;padding:0 4px;border-radius:999px;background:#E11D48;` +
        `color:#FFFFFF;font-size:9.5px;font-weight:800;display:${naoLidas > 0 ? 'flex' : 'none'};align-items:center;justify-content:center;border:2px solid #FFFFFF`,
      unreadCount: naoLidas > 0 ? String(naoLidas) : '',
      toggleNotif: () => {
        setNotif((n) => !n);
        setSel(null);
      },
      closeNotif: () => {
        setNotif(false);
        setSel(null);
      },
      backToList: () => setSel(null),
      drawerStyle:
        `position:fixed;top:0;right:0;bottom:0;width:420px;max-width:92vw;z-index:70;background:#FFFFFF;` +
        `border-left:1px solid #E6EAF2;box-shadow:-24px 0 60px rgba(11,18,32,.18);display:flex;flex-direction:column;` +
        `transform:translateX(${notif ? '0' : '104%'});transition:transform .26s cubic-bezier(.2,.8,.2,1)`,
      scrimStyle:
        `position:fixed;inset:0;z-index:65;background:rgba(11,18,32,.34);opacity:${notif ? 1 : 0};` +
        `pointer-events:${notif ? 'auto' : 'none'};transition:opacity .22s ease`,
      notifOpen: notif && !detalhe,
      notifList: lista,
      notifDetail: detalhe,
      hasDetail: Boolean(detalhe),

      // ---------------------------------------------------------- rodapé
      lojaNome: loja.nome,
      lojaEmail: loja.email ?? '',
      lojaTelefone: loja.telefone ?? '',
      hrefPolitica: loja.politica ?? '#',

      ...ROTAS,
    };
  }, [menu, rail, notif, sel, lidas, notificacoes, dono, loja]);
}
