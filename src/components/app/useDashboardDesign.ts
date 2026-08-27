'use client';

import { useMemo, useState } from 'react';

/**
 * Porte de `Component extends DCLogic` de Dashboard.dc.html.
 *
 * Mantém os mesmos nomes e as mesmas strings de estilo. A navegação do design
 * pulava para outros arquivos .dc.html; aqui `rotas` diz qual módulo já tem
 * tela — os que não têm apenas destacam o item, sem levar a lugar nenhum.
 */

/** Ordem dos itens do menu, igual à do design. */
export const MODULOS = [
  'Dashboard', 'Pedidos', 'Producao', 'Expedicao', 'Loja', 'Catalogo', 'Precos',
  'Temas', 'Clientes', 'CRM', 'Vendedores', 'Marketing', 'Financeiro', 'Carteira',
  'Relatorios', 'Automacoes', 'Integracoes', 'Auditoria', 'Suporte', 'Configuracoes',
] as const;

export function useDashboardDesign({
  ativo = 0,
  rotas = {},
}: {
  ativo?: number;
  /** índice do módulo -> rota real, quando ela existir */
  rotas?: Record<number, string>;
} = {}) {
  const [collapsed, setCollapsed] = useState(false);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState(ativo);
  const [period, setPeriod] = useState(1);

  return useMemo(() => {
    const c = collapsed;

    const navStyle = (i: number) => {
      const on = active === i;
      return (
        `display:flex;align-items:center;gap:13px;height:44px;min-height:44px;flex:0 0 auto;` +
        `padding:0 14px;border-radius:14px;font-size:14px;font-weight:${on ? 600 : 500};` +
        `cursor:pointer;white-space:nowrap;overflow:hidden;transition:background .16s,color .16s;` +
        (on
          ? 'background:linear-gradient(135deg,#2563EB,#06B6D4);color:#FFFFFF;box-shadow:0 8px 18px rgba(37,99,235,.26);'
          : 'background:transparent;color:#46536A;')
      );
    };

    const perStyle = (i: number) => {
      const on = period === i;
      return (
        `padding:8px 16px;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer;` +
        `white-space:nowrap;transition:all .16s;` +
        (on
          ? 'background:linear-gradient(135deg,#2563EB,#06B6D4);color:#FFFFFF;box-shadow:0 6px 14px rgba(37,99,235,.24);'
          : 'background:transparent;color:#6B7A90;')
      );
    };

    const v: Record<string, unknown> = {
      sideStyle:
        `width:${c ? 86 : 262}px;flex:0 0 auto;display:flex;flex-direction:column;` +
        `background:#FFFFFF;border-right:1px solid #E6EAF2;position:sticky;top:0;height:100vh;` +
        `transition:width .24s cubic-bezier(.2,.8,.2,1)`,
      brandStyle: `font-size:17px;font-weight:800;letter-spacing:.6px;transition:opacity .18s;${c ? 'opacity:0' : 'opacity:1'}`,
      labelStyle: `font-size:14px;transition:opacity .18s;${c ? 'opacity:0;width:0;overflow:hidden' : 'opacity:1'}`,
      badgeStyle:
        `margin-left:auto;padding:2px 8px;border-radius:999px;background:rgba(255,255,255,.22);` +
        `font-size:11px;font-weight:700;${c ? 'display:none' : ''}`,
      groupStyle:
        `flex:0 0 auto;margin:14px 0 6px 14px;font-size:10.5px;letter-spacing:1.4px;` +
        `text-transform:uppercase;color:#9AA7BC;font-weight:700;${c ? 'opacity:0' : ''}`,
      tenantStyle:
        `display:flex;align-items:center;gap:11px;margin:0 14px;padding:10px;border-radius:16px;` +
        `background:#F8FAFE;border:1px solid #EEF1F7;cursor:pointer;overflow:hidden;${c ? 'display:none' : ''}`,
      storageCard:
        `padding:16px;border-radius:18px;background:linear-gradient(160deg,#F1F5FD,#E4F8FC);` +
        `border:1px solid #E6EAF2;${c ? 'display:none' : ''}`,
      collapseBtn:
        `display:flex;align-items:center;gap:13px;height:44px;min-height:44px;flex:0 0 auto;` +
        `padding:0 14px;border-radius:14px;color:#6B7A90;font-size:13.5px;font-weight:500;` +
        `cursor:pointer;white-space:nowrap;overflow:hidden`,
      chevStyle: `flex:0 0 auto;transition:transform .24s;${c ? 'transform:rotate(180deg)' : ''}`,
      toggleSide: () => setCollapsed((a) => !a),
      toggleMenu: () => setMenu((a) => !a),
      avatarBtn:
        `display:flex;align-items:center;gap:11px;padding:5px 12px 5px 5px;` +
        `border:1px solid ${menu ? '#D6E2FC' : '#E6EAF2'};border-radius:14px;background:#FFFFFF;` +
        `cursor:pointer;transition:border-color .15s`,
      menuChev: `transition:transform .2s;${menu ? 'transform:rotate(180deg)' : ''}`,
      menuStyle:
        `position:absolute;top:58px;right:0;width:266px;background:#FFFFFF;border:1px solid #E6EAF2;` +
        `border-radius:20px;box-shadow:0 24px 50px rgba(11,18,32,.16);overflow:hidden;z-index:40;` +
        `animation:menuIn .16s ease both;${menu ? '' : 'display:none'}`,
    };

    for (let i = 0; i < 20; i++) {
      v['nav' + i] = navStyle(i);
      v['pick' + i] = () => {
        const rota = rotas[i];
        if (rota) window.location.href = rota;
        else setActive(i);
      };
    }
    for (let i = 0; i < 6; i++) {
      v['per' + i] = perStyle(i);
      v['setP' + i] = () => setPeriod(i);
    }

    return v;
  }, [collapsed, menu, active, period, rotas]);
}
