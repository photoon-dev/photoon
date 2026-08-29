'use client';

import { useCallback, useMemo, useState } from 'react';
import CardProjetoDesign from '@/components/design/CardProjetoDesign';
import type { Notificacao, Projeto } from '@/lib/data';
import { STATUS } from '@/lib/status';

/**
 * Porte de `Component extends DCLogic` de Cliente Meus projetos.dc.html.
 *
 * Mantém os mesmos nomes e as mesmas strings de estilo do design. O que muda
 * é a origem: as notificações e os álbuns vêm do banco, não da lista fixa
 * que estava no arquivo.
 */

const TOM: Record<string, { tone: string; bg: string }> = {
  Galeria: { tone: '#2563EB', bg: '#F1F5FD' },
  Aviso: { tone: '#B45309', bg: '#FEF3E2' },
  Pendência: { tone: '#B45309', bg: '#FEF3E2' },
  Produção: { tone: '#0891B2', bg: '#E4F8FC' },
  Pronto: { tone: '#059669', bg: '#E6F8F1' },
  Concluído: { tone: '#059669', bg: '#E6F8F1' },
};

const CHIP_STATUS: Record<string, { bg: string; cor: string }> = {
  nao_iniciado: { bg: '#F1F5FD', cor: '#6B7A90' },
  em_edicao: { bg: '#EAF0FF', cor: '#2563EB' },
  com_pendencias: { bg: '#FEF3E2', cor: '#B45309' },
  pronto: { bg: '#E6F8F1', cor: '#059669' },
  finalizado: { bg: '#E4F8FC', cor: '#0891B2' },
};

const quando = (iso: string) => {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 60) return `há ${Math.max(min, 1)} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'ontem' : `há ${d} dias`;
};

export function useMeusProjetosDesign({
  projetos,
  notificacoes,
  totalFotos,
  capas,
  eventos = 1,
  cliente,
  nomeLoja,
  enderecoLoja,
  emailLoja,
  telefoneLoja,
  nomeGaleria,
  galeriaAtualizada,
}: {
  projetos: Projeto[];
  notificacoes: Notificacao[];
  totalFotos: number;
  capas: string[];
  eventos?: number;
  cliente: { nome: string | null; email: string; avatarUrl?: string | null };
  /** Marca da loja: é ela que o cliente final vê, não a da plataforma. */
  nomeLoja: string;
  enderecoLoja: string;
  emailLoja: string;
  telefoneLoja: string;
  nomeGaleria: string;
  galeriaAtualizada: string;
}) {
  const [menu, setMenu] = useState(false);
  const [rail, setRail] = useState(false);
  const [filters, setFilters] = useState(false);
  const [notif, setNotif] = useState(false);
  const [sel, setSel] = useState<number | null>(null);
  const [read, setRead] = useState<string[]>(() =>
    notificacoes.filter((n) => n.lida).map((n) => n.id),
  );

  const escolher = useCallback((i: number, id: string) => {
    setSel(i);
    setRead((r) => (r.includes(id) ? r : r.concat(id)));
  }, []);

  return useMemo(() => {
    const list = notificacoes.map((n, i) => {
      const t = TOM[n.tag] ?? TOM.Galeria;
      const lida = read.includes(n.id);
      return {
        ...n,
        tag: n.tag,
        title: n.titulo,
        time: `${quando(n.criada_em)} · Photoon`,
        body: n.corpo ? n.corpo.split('\n').filter(Boolean) : [],
        rowStyle:
          `display:flex;gap:12px;padding:14px 16px;border-radius:14px;` +
          `border:1px solid ${sel === i ? '#D6E2FC' : '#EEF1F7'};` +
          `background:${sel === i ? '#F7FAFF' : '#FFFFFF'};cursor:pointer;` +
          `text-align:left;font-family:inherit;width:100%`,
        tagStyle:
          `display:inline-block;padding:3px 9px;border-radius:999px;` +
          `background:${t.bg};color:${t.tone};font-size:11px;font-weight:700`,
        titleStyle:
          `margin:8px 0 0;font-size:13.5px;font-weight:${lida ? 600 : 800};` +
          `color:#0B1220;line-height:1.4`,
        dotStyle:
          `width:8px;height:8px;border-radius:999px;` +
          `background:${lida ? 'transparent' : t.tone};flex:0 0 auto;margin-top:6px`,
        pick: () => escolher(i, n.id),
      };
    });

    const detail = sel === null ? null : list[sel];
    const unread = notificacoes.length - read.length;

    const primeiroNome = (cliente.nome ?? cliente.email.split('@')[0]).split(' ')[0];
    const prontos = projetos.filter((p) => p.status === 'pronto').length;

    // Progresso do pedido = média do quanto cada álbum já foi montado.
    const progresso = projetos.length
      ? Math.round(projetos.reduce((t, p) => t + p.progresso, 0) / projetos.length)
      : 0;

    const indicador = (n: number, rotulo: string) => (
      <div key={rotulo} style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: '24px', fontWeight: 800, letterSpacing: '-.8px', color: '#FFFFFF' }}>
          {n}
        </p>
        <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'rgba(255,255,255,.66)', lineHeight: 1.3 }}>
          {rotulo}
        </p>
      </div>
    );

    return {
      // --- textos que o design trazia escritos à mão ---
      nomeCliente: cliente.nome ?? cliente.email.split('@')[0],
      emailCliente: cliente.email,
      /**
       * Avatar do cabeçalho: a foto do cliente quando existe, as iniciais
       * quando não. O design só previa iniciais, e a foto do perfil ficava
       * invisível fora da tela de conta.
       */
      avatarFoto:
        'width:34px;height:34px;border-radius:11px;display:flex;align-items:center;' +
        'justify-content:center;font-size:12.5px;font-weight:700;flex:0 0 auto;overflow:hidden;' +
        (cliente.avatarUrl
          ? `background-image:url('${cliente.avatarUrl}');background-size:cover;background-position:center;color:transparent`
          : 'background:#0B1220;color:#FFFFFF'),
      // O design dizia "Formatura 2026" fixo abaixo do nome.
      subNome: 'Minha conta',
      iniciais: (cliente.nome ?? cliente.email)
        .split(/[\s@.]+/)
        .slice(0, 2)
        .map((p) => p[0])
        .join('')
        .toUpperCase(),
      nomeLoja,
      enderecoLoja,
      emailLoja,
      telefoneLoja,
      nomeGaleria,
      // O design trazia "Formatura 2026 · sessão Julia" escrito à mão em três
      // lugares: no selo do banner, no cartão da galeria e na notificação.
      galeriaNome: nomeGaleria,
      galeriaAtualizada,
      progressoTexto: `${progresso}%`,
      progressoLargura: `${progresso}%`,
      indicadores: [
        indicador(projetos.length, projetos.length === 1 ? 'projeto' : 'projetos'),
        indicador(totalFotos, 'fotos liberadas'),
        indicador(prontos, prontos === 1 ? 'pronto' : 'prontos'),
      ],
      saudacao:
        prontos > 0
          ? `Olá, ${primeiroNome}. Falta pouco para o seu álbum.`
          : `Olá, ${primeiroNome}. Vamos montar seu álbum?`,
      resumo:
        ` liberou ${totalFotos} foto${totalFotos === 1 ? '' : 's'} e ${projetos.length} ` +
        `projeto${projetos.length === 1 ? '' : 's'}.` +
        (prontos > 0
          ? ` ${prontos} já ${prontos === 1 ? 'está pronto' : 'estão prontos'} para finalizar.`
          : ''),

      // --- notificações ---
      notifOpen: notif && !detail,
      toggleNotif: () => {
        setNotif((a) => !a);
        setSel(null);
      },
      closeNotif: () => {
        setNotif(false);
        setSel(null);
      },
      backToList: () => setSel(null),
      notifList: list,
      notifDetail: detail,
      hasDetail: !!detail,
      unreadCount: unread > 0 ? String(unread) : '',
      bellStyle:
        `position:relative;width:42px;height:42px;border-radius:14px;` +
        `border:1px solid ${notif ? '#D6E2FC' : '#E6EAF2'};` +
        `background:${notif ? '#F1F5FD' : '#FFFFFF'};display:flex;align-items:center;` +
        `justify-content:center;color:${notif ? '#2563EB' : '#46536A'};flex:0 0 auto;` +
        `cursor:pointer;font-family:inherit;transition:background .15s,border-color .15s,color .15s`,
      bellDotStyle:
        `position:absolute;top:6px;right:6px;min-width:17px;height:17px;padding:0 4px;` +
        `border-radius:999px;background:#E11D48;color:#FFFFFF;font-size:9.5px;font-weight:800;` +
        `display:${unread > 0 ? 'flex' : 'none'};align-items:center;justify-content:center;` +
        `border:2px solid #FFFFFF`,
      drawerStyle:
        `position:fixed;top:0;right:0;bottom:0;width:420px;max-width:92vw;z-index:70;` +
        `background:#FFFFFF;border-left:1px solid #E6EAF2;box-shadow:-24px 0 60px rgba(11,18,32,.18);` +
        `display:flex;flex-direction:column;transform:translateX(${notif ? '0' : '104%'});` +
        `transition:transform .26s cubic-bezier(.2,.8,.2,1)`,
      scrimStyle:
        `position:fixed;inset:0;z-index:65;background:rgba(11,18,32,.34);` +
        `opacity:${notif ? 1 : 0};pointer-events:${notif ? 'auto' : 'none'};transition:opacity .22s ease`,

      // --- filtros ---
      filtersOpen: filters,
      toggleFilters: () => setFilters((a) => !a),
      filtersBtnStyle:
        `white-space:nowrap;height:44px;padding:0 18px;display:flex;align-items:center;` +
        `justify-content:center;gap:9px;border:1px solid ${filters ? '#D6E2FC' : '#E6EAF2'};` +
        `border-radius:12px;background:${filters ? '#F1F5FD' : '#FFFFFF'};` +
        `color:${filters ? '#2563EB' : '#0B1220'};font-family:inherit;font-size:14px;` +
        `font-weight:600;cursor:pointer;transition:background .15s,border-color .15s,color .15s`,
      filtersCaretStyle: `display:flex;transition:transform .2s ease;transform:rotate(${filters ? 180 : 0}deg)`,

      // --- menu do avatar ---
      toggleMenu: () => setMenu((a) => !a),
      avatarBtn:
        `display:flex;align-items:center;gap:11px;padding:5px 12px 5px 5px;` +
        `border:1px solid ${menu ? '#D6E2FC' : '#E6EAF2'};border-radius:14px;background:#FFFFFF;` +
        `cursor:pointer;transition:border-color .15s`,
      menuStyle:
        `position:absolute;top:56px;right:0;width:250px;background:#FFFFFF;` +
        `border:1px solid #E6EAF2;border-radius:20px;box-shadow:0 24px 50px rgba(11,18,32,.16);` +
        `overflow:hidden;z-index:50;animation:menuIn .16s ease both;${menu ? '' : 'display:none'}`,

      // --- barra lateral que expande no hover ---
      openRail: () => setRail(true),
      closeRail: () => setRail(false),
      railStyle:
        `position:fixed;top:50%;left:18px;transform:translateY(-50%);z-index:45;display:flex;` +
        `flex-direction:column;gap:6px;padding:12px 10px;width:${rail ? 244 : 68}px;` +
        `border-radius:26px;background:rgba(255,255,255,.94);backdrop-filter:blur(14px);` +
        `border:1px solid #E6EAF2;box-shadow:0 20px 44px rgba(11,18,32,${rail ? '.2' : '.14'});` +
        `overflow:hidden;transition:width .22s cubic-bezier(.2,.8,.2,1),box-shadow .22s`,
      mainStyle:
        `flex:1;padding:30px 28px 56px ${rail ? 272 : 96}px;` +
        `transition:padding-left .22s cubic-bezier(.2,.8,.2,1)`,
      railLabel:
        `font-size:14px;font-weight:600;white-space:nowrap;opacity:${rail ? 1 : 0};` +
        `transform:translateX(${rail ? 0 : -6}px);` +
        `transition:opacity .18s ease,transform .22s cubic-bezier(.2,.8,.2,1);pointer-events:none`,

      // --- álbuns reais no lugar dos três cards fixos do design ---
      // O cabeçalho do design já oferecia Ajuda e Minha conta; nenhum dos dois
      // tinha destino, e o link ia para `undefined`. Agora existem as telas.
      hrefAjuda: '/ajuda',
      hrefConta: '/minha-conta',
      hrefGaleria: '/galeria',
      cardsProjetos: projetos.map((p, i) => {
        const s = STATUS[p.status];
        const chip = CHIP_STATUS[p.status] ?? CHIP_STATUS.nao_iniciado;
        return (
          <CardProjetoDesign
            key={p.id}
            p={{
              titulo: p.titulo,
              produto: [
                [p.produto_nome, p.produto_tamanho].filter(Boolean).join(' '),
                `${p.total_paginas} páginas`,
              ]
                .filter(Boolean)
                .join(' · '),
              statusRotulo: s.rotulo,
              statusBg: chip.bg,
              statusCor: chip.cor,
              progresso: p.progresso,
              fotos: `${p.fotos_usadas} de ${totalFotos} fotos`,
              aviso: p.avisos[0]?.titulo ?? 'Nenhuma pendência',
              acao: s.acao,
              capa: p.capa_url ?? capas[i % Math.max(capas.length, 1)],
              hrefEditar: `/editor/${p.id}`,
              hrefVer: `/projetos/${p.id}`,
            }}
          />
        );
      }),
    };
  }, [
    notificacoes, read, sel, notif, filters, menu, rail, projetos, totalFotos,
    capas, eventos, cliente, nomeLoja, enderecoLoja, emailLoja, telefoneLoja,
    nomeGaleria, galeriaAtualizada, escolher,
  ]);
}
