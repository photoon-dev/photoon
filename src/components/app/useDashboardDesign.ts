'use client';

import { useMemo, useState } from 'react';
import type { NumerosDaLoja } from '@/lib/lojista';

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

export type PainelDaLoja = {
  lojaNome: string;
  usuarioNome: string;
  usuarioCargo: string;
  numeros: NumerosDaLoja;
  plano: { nome: string; limite: number | null } | null;
};

export function useDashboardDesign({
  ativo = 0,
  rotas = {},
  painel,
}: {
  ativo?: number;
  /** índice do módulo -> rota real, quando ela existir */
  rotas?: Record<number, string>;
  /** Dados reais da loja. Ausente = telas que só usam a moldura. */
  painel?: PainelDaLoja;
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


    /* ---------------------------- números reais ----------------------------
     * O design vinha com GMV, ticket médio e conversão preenchidos à mão —
     * R$ 184.320 de faturamento que não é de ninguém, e "Bom dia, Marta" para
     * todo lojista. Não há pedido nem pagamento no sistema, então esses três
     * não podem ser calculados: em vez de trocar um número inventado por
     * outro, o painel mostra o que a plataforma mede.
     * --------------------------------------------------------------------- */
    const n = painel?.numeros;
    const hora = new Date().getHours();
    const primeiroNome = (painel?.usuarioNome ?? '').split(' ')[0] || 'por aqui';
    const num = (x: number) => x.toLocaleString('pt-BR');

    const SELO: Record<string, [string, string, string]> = {
      pronto: ['Pronto', '#E6F8F1', '#059669'],
      com_pendencias: ['Com pendência', '#FEF3E2', '#B45309'],
      em_edicao: ['Em edição', '#EAF0FF', '#2563EB'],
      nao_iniciado: ['Não iniciado', '#EEF1F7', '#6B7A90'],
    };
    const limite = painel?.plano?.limite ?? null;
    const pct = limite ? Math.min(100, Math.round(((n?.projetos ?? 0) / limite) * 100)) : null;

    v.lojaNome = painel?.lojaNome ?? 'Photoon';
    v.usuarioIniciais = (painel?.usuarioNome ?? '?')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((x) => x[0]?.toUpperCase() ?? '')
      .join('') || '?';
    // O design dizia "Armazenamento" com 1,44 TB fixos. Não medimos disco; o
    // que de fato limita a loja é a cota de álbuns do plano.
    v.usoTitulo = 'Álbuns no plano';
    // Selo do menu: álbuns que pedem atenção. Era "14" fixo.
    v.selo1 = String((n?.comPendencia ?? 0) + (n?.emEdicao ?? 0));
    v.usuarioCargo = painel?.usuarioCargo ?? '';
    v.agora = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    v.saudacao =
      `${hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'}, ${primeiroNome}.` +
      (n && n.projetos ? '' : ' Vamos começar?');
    v.resumoHero = !n
      ? ''
      : n.projetos === 0
        ? 'Nenhum álbum ainda. Cadastre um cliente, libere as fotos e o álbum aparece aqui.'
        : `${n.projetos} ${n.projetos === 1 ? 'álbum' : 'álbuns'} na loja · ${n.emEdicao} em edição · ` +
          `${n.prontos} ${n.prontos === 1 ? 'pronto' : 'prontos'}` +
          (n.comPendencia ? ` · ${n.comPendencia} com pendência` : '');
    v.kpiHeroA = { rotulo: 'Andamento médio', valor: `${n?.progressoMedio ?? 0}%` };
    v.kpiHeroB = { rotulo: 'Prontos para produção', valor: String(n?.prontos ?? 0) };
    v.kpi1 = { rotulo: 'Clientes', valor: num(n?.clientes ?? 0), nota: n?.clientes ? 'cadastrados na loja' : 'nenhum ainda' };
    v.kpi2 = { rotulo: 'Álbuns', valor: num(n?.projetos ?? 0), nota: `${n?.emEdicao ?? 0} em edição` };
    v.kpi3 = { rotulo: 'Fotos liberadas', valor: num(n?.fotos ?? 0), nota: 'na galeria' };
    v.kpi4 = { rotulo: 'Prontos', valor: num(n?.prontos ?? 0), nota: n?.comPendencia ? `${n.comPendencia} com pendência` : 'sem pendências' };

    // O design mostrava "1,44 TB de 2 TB": não medimos armazenamento. Vale o
    // limite de álbuns do plano, que é o que de fato restringe a loja.
    v.usoPct = pct === null ? '—' : `${pct}%`;
    v.usoBarra = `width:${pct ?? 6}%;height:100%;border-radius:999px;background:linear-gradient(90deg,#2563EB,#06B6D4)`;
    v.usoTexto = !painel?.plano
      ? 'Esta loja não está em nenhum plano'
      : limite
        ? `${n?.projetos ?? 0} de ${limite} álbuns · plano ${painel.plano.nome}`
        : `Plano ${painel.plano.nome} · sem limite de álbuns`;

    /* ------------------------------ o gráfico ------------------------------
     * A curva do design era desenhada: doze pontos escritos à mão que subiam
     * bonito e não vinham de lugar nenhum. Aqui ela é a série real de álbuns
     * criados e concluídos por dia. Sem dado, o bloco some — melhor um espaço
     * vazio que uma linha inventada.
     * --------------------------------------------------------------------- */
    const caminho = (vals: number[], alturaMax: number, base: number) => {
      if (!vals.length) return '';
      const teto = Math.max(1, ...vals);
      const passo = 700 / Math.max(1, vals.length - 1);
      return vals
        .map((val, i) => `${i === 0 ? 'M' : ''}${Math.round(i * passo)} ${Math.round(base - (val / teto) * alturaMax)}`)
        .join(' ');
    };

    v.graficoTitulo = 'Álbuns ao longo do mês';
    v.serieA = 'Criados';
    v.serieB = 'Concluídos';
    v.linhaA = caminho(n?.serieCriados ?? [], 120, 180);
    v.linhaB = caminho(n?.serieProntos ?? [], 90, 190);

    // Estado vazio explícito: tabela sem linha nenhuma e sem explicação parece
    // defeito. Aqui ela diz o que fazer para ter a primeira.
    v.recentesVazio = (n?.recentes?.length ?? 0)
      ? 'display:none'
      : 'padding:26px;text-align:center;font-size:13px;color:#9AA7BC';

    v.recentes = (n?.recentes ?? []).map((p) => {
      const [rot, bg, cor] = SELO[p.status] ?? SELO.nao_iniciado;
      return {
        titulo: p.titulo,
        cliente: p.cliente ?? 'sem cliente vinculado',
        iniciais: (p.titulo || '?').slice(0, 2).toUpperCase(),
        progresso: `${p.progresso}%`,
        laminas: String(p.laminas),
        estado: rot,
        selo: `padding:6px 11px;border-radius:999px;background:${bg};color:${cor};font-size:12px;font-weight:600;width:max-content`,
        quando: new Date(p.atualizado_em).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }),
        abrir: () => { window.location.href = '/clientes'; },
      };
    });

    return v;
  }, [collapsed, menu, active, period, rotas, painel]);
}
