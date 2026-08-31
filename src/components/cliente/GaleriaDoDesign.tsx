'use client';

import { useMemo, useState } from 'react';
import GaleriaDesign, { CSS_PSEUDO } from '@/components/design/GaleriaDesign';
import MenuCliente from '@/components/cliente/MenuCliente';
import { useCascaCliente, iniciaisDe, type LojaDaCasca } from '@/components/cliente/useCascaCliente';
import type { Foto, Notificacao, PessoaDaGaleria, Projeto, RostoDaFoto } from '@/lib/data';

/**
 * Galeria de fotos do cliente, com o layout novo do Claude Design.
 *
 * O desenho novo trocou a grade única por: vista de fotos e vista de álbuns,
 * filtros combináveis (álbum, formato, rosto e uso), busca, seleção múltipla
 * com barra flutuante e gaveta de detalhe da foto.
 *
 * O protótipo vinha com 42 fotos sorteadas, seis pessoas inventadas ("Julia",
 * "Vó Alzira") e quatro álbuns fixos. Aqui nada disso existe: as fotos são as
 * da galeria liberada pela loja, os rostos são os que o reconhecimento agrupou
 * e os álbuns são os projetos do cliente. O que o banco não guarda — o
 * "momento" do ensaio e a nota de qualidade de impressão — saiu da tela em vez
 * de virar texto bonito sem lastro; no lugar entraram formato, resolução e
 * arquivo, que são reais.
 */

type Uso = Record<string, string[]>;

/** Álbum é projeto do cliente; `livre` junta o que nenhum projeto usa. */
const LIVRE = 'livre';

const GRADS = [
  'linear-gradient(140deg,#7C3AED,#2563EB)',
  'linear-gradient(140deg,#2563EB,#06B6D4)',
  'linear-gradient(140deg,#0EA5E9,#22D3EE)',
  'linear-gradient(140deg,#6366F1,#8B5CF6)',
  'linear-gradient(140deg,#8B5CF6,#EC4899)',
  'linear-gradient(140deg,#0891B2,#22D3EE)',
];

const SELO_STATUS: Record<string, [string, string, string]> = {
  pronto: ['Pronto para finalizar', '#E6F8F1', '#059669'],
  com_pendencias: ['Com pendências', '#FEF3E2', '#B45309'],
  em_edicao: ['Em edição', '#F1F5FD', '#2563EB'],
  nao_iniciado: ['Não iniciado', '#F1F5FD', '#46536A'],
  enviado: ['Enviado', '#EDEBFE', '#6366F1'],
};

export default function GaleriaDoDesign({
  dono,
  loja,
  notificacoes,
  fotos,
  rostos,
  pessoas,
  projetos,
  uso,
  galeriaNome,
}: {
  dono: { nome: string; email: string; sub: string };
  loja: LojaDaCasca;
  notificacoes: Notificacao[];
  fotos: Foto[];
  rostos: RostoDaFoto[];
  pessoas: PessoaDaGaleria[];
  projetos: Projeto[];
  uso: Uso;
  galeriaNome: string;
}) {
  const casca = useCascaCliente({ dono, loja, notificacoes });

  const [view, setView] = useState<'all' | 'albums'>('all');
  const [album, setAlbum] = useState('all');
  const [orient, setOrient] = useState('all');
  const [tag, setTag] = useState('all');
  const [face, setFace] = useState<string | null>(null);
  const [faceByAlbum, setFaceByAlbum] = useState(false);
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<string[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);

  const porId = useMemo(() => new Map(fotos.map((f) => [f.id, f])), [fotos]);

  /** Álbuns reais: um por projeto, mais o balde das fotos ainda livres. */
  const albuns = useMemo(
    () => [
      ...projetos.map((p, i) => ({ id: p.id, name: p.titulo, grad: GRADS[i % GRADS.length], projeto: p })),
      { id: LIVRE, name: 'Fotos ainda livres', grad: 'linear-gradient(140deg,#64748B,#94A3B8)', projeto: null },
    ],
    [projetos],
  );

  const nomeDaPessoa = useMemo(
    () => new Map(pessoas.map((p) => [p.id, p.nome ?? 'Sem nome'])),
    [pessoas],
  );

  /**
   * Cada foto com o que a tela precisa. `album` é o primeiro projeto que usa a
   * foto: a mesma foto pode estar em dois álbuns, e a vista por álbum a mostra
   * nos dois — mas a grade precisa de um dono para agrupar.
   */
  const modelo = useMemo(
    () =>
      fotos.map((f) => {
        const nas = rostos.filter((r) => r.fotoId === f.id && r.pessoaId);
        const projetosDaFoto = uso[f.id] ?? [];
        const vertical = Boolean(f.largura && f.altura && f.altura > f.largura);
        return {
          id: f.id,
          url: f.url,
          nome: (f.storage_path.split('/').pop() ?? f.id).replace(/\.[^.]+$/, ''),
          orient: vertical ? 'v' : 'h',
          faces: nas.map((r) => r.pessoaId as string),
          albuns: projetosDaFoto,
          album: projetosDaFoto[0] ?? LIVRE,
          used: projetosDaFoto.length > 0,
          largura: f.largura,
          altura: f.altura,
        };
      }),
    [fotos, rostos, uso],
  );

  type Modelo = (typeof modelo)[number];

  /** Um filtro pode ser ignorado para contar quantas fotos ele traria. */
  const passa = (p: Modelo, pular?: string) => {
    if (pular !== 'album' && album !== 'all' && !(p.album === album || p.albuns.includes(album))) return false;
    if (pular !== 'orient' && orient !== 'all' && p.orient !== orient) return false;
    if (pular !== 'tag') {
      if (tag === 'faces' && p.faces.length === 0) return false;
      if (tag === 'nofaces' && p.faces.length > 0) return false;
      if (tag === 'used' && !p.used) return false;
      if (tag === 'unused' && p.used) return false;
    }
    if (pular !== 'face' && face && !p.faces.includes(face)) return false;
    const q = query.trim().toLowerCase();
    if (q) {
      const nomes = p.faces.map((id) => nomeDaPessoa.get(id) ?? '').join(' ');
      if (!`${p.nome} ${nomes}`.toLowerCase().includes(q)) return false;
    }
    return true;
  };

  const visiveis = modelo.filter((p) => passa(p));

  /** Recorte quadrado do rosto de capa, para a bolinha da pessoa. */
  const recorte = (p: PessoaDaGaleria) => {
    const r = rostos.find((x) => x.id === p.rostoCapaId) ?? rostos.find((x) => x.pessoaId === p.id);
    const f = r ? porId.get(r.fotoId) : undefined;
    if (!r || !f) return '';
    // A caixa vem em fração da foto: ampliar no inverso da largura do rosto e
    // centrar na caixa deixa cabelo e ombro, que é o que faz reconhecer.
    const x = ((r.caixa.x + r.caixa.w / 2) * 100).toFixed(1);
    const y = ((r.caixa.y + r.caixa.h / 2) * 100).toFixed(1);
    return (
      `background-image:url('${f.url}');background-size:${((1 / r.caixa.w) * 100).toFixed(1)}% auto;` +
      `background-position:${x}% ${y}%;`
    );
  };

  const alterna = (id: string) =>
    setPicked((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const cartao = (p: Modelo) => {
    const marcada = picked.includes(p.id);
    const dim = p.largura && p.altura ? `${p.largura} × ${p.altura}` : 'sem dimensão gravada';
    return {
      name: p.nome,
      faceCount: String(p.faces.length),
      meta: `${p.orient === 'v' ? 'Vertical' : 'Horizontal'} · ${dim}`,
      usedLabel: p.used ? 'em uso' : 'livre',
      usedStyle:
        `padding:2px 8px;border-radius:999px;background:${p.used ? '#E6F8F1' : '#F1F5FD'};` +
        `color:${p.used ? '#059669' : '#6B7A90'};font-size:10.5px;font-weight:700;white-space:nowrap`,
      cardStyle:
        `background:#FFFFFF;border:1px solid ${marcada ? '#2563EB' : '#E6EAF2'};border-radius:14px;overflow:hidden;` +
        `cursor:pointer;box-shadow:${marcada ? '0 0 0 3px rgba(37,99,235,.14)' : 'none'};` +
        'transition:border-color .15s,box-shadow .15s,transform .15s',
      // O protótipo pintava gradiente porque não tinha foto. Aqui tem.
      thumbStyle:
        `position:relative;aspect-ratio:${p.orient === 'v' ? '3 / 4' : '4 / 3'};background-color:#EEF1F7;` +
        `background-image:url('${p.url}');background-size:cover;background-position:center`,
      checkStyle:
        `position:absolute;top:8px;left:8px;width:24px;height:24px;border-radius:8px;` +
        `border:1.5px solid ${marcada ? '#2563EB' : 'rgba(255,255,255,.7)'};` +
        `background:${marcada ? '#2563EB' : 'rgba(11,18,32,.28)'};color:${marcada ? '#FFFFFF' : 'transparent'};` +
        `display:flex;align-items:center;justify-content:center;opacity:${marcada ? 1 : 0.9}`,
      faceBadgeStyle:
        `position:absolute;top:8px;right:8px;display:${p.faces.length ? 'flex' : 'none'};align-items:center;gap:4px;` +
        'padding:3px 8px;border-radius:999px;background:rgba(11,18,32,.5);backdrop-filter:blur(6px);' +
        'color:#FFFFFF;font-size:10.5px;font-weight:700',
      toggle: () => alterna(p.id),
      open: (ev?: React.MouseEvent) => {
        ev?.stopPropagation();
        setPhoto(p.id);
      },
    };
  };

  // ---------------------------------------------------------------- grupos
  const groups =
    view === 'albums'
      ? []
      : visiveis.length
        ? [
            {
              title: 'Todas as fotos',
              sub: `${visiveis.length} de ${modelo.length} ${modelo.length === 1 ? 'foto' : 'fotos'} desta galeria`,
              dotStyle:
                'width:12px;height:34px;border-radius:999px;background:linear-gradient(140deg,#2563EB,#06B6D4);flex:0 0 auto',
              photos: visiveis.map(cartao),
              selectGroup: () => setPicked(visiveis.map((p) => p.id)),
            },
          ]
        : [];

  // ------------------------------------------------------------- pessoas
  const escopo = faceByAlbum && album !== 'all' ? modelo.filter((p) => p.albuns.includes(album)) : modelo;
  const faces = pessoas.map((pe, i) => {
    const n = escopo.filter((p) => p.faces.includes(pe.id)).length;
    const ativa = face === pe.id;
    const nome = pe.nome ?? 'Sem nome';
    const fundo = recorte(pe);
    return {
      name: nome,
      initials: fundo ? '' : iniciaisDe(nome),
      countLabel: `${n} ${n === 1 ? 'foto' : 'fotos'}`,
      chipStyle:
        'display:flex;flex-direction:column;align-items:center;gap:8px;padding:2px;border:0;background:transparent;' +
        'cursor:pointer;font-family:inherit;flex:0 0 auto;width:78px',
      avatarStyle:
        `width:66px;height:66px;border-radius:999px;${fundo || `background:${GRADS[i % GRADS.length]};`}` +
        'color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:19px;font-weight:800;' +
        `flex:0 0 auto;box-shadow:${ativa ? '0 0 0 3px #FFFFFF, 0 0 0 6px #2563EB' : '0 4px 12px rgba(11,18,32,.12)'};` +
        'transition:box-shadow .16s',
      nameStyle:
        `font-size:12.5px;font-weight:${ativa ? 800 : 600};color:${ativa ? '#2563EB' : '#46536A'};` +
        'white-space:nowrap;max-width:78px;overflow:hidden;text-overflow:ellipsis',
      pick: () => setFace((f) => (f === pe.id ? null : pe.id)),
    };
  });

  // ------------------------------------------------------------- álbuns
  const albumCards = albuns.map((a) => {
    const lista = modelo.filter((p) => (a.id === LIVRE ? !p.used : p.albuns.includes(a.id)));
    const capa = a.projeto?.capa_url ?? lista[0]?.url ?? null;
    const pct = a.projeto ? a.projeto.progresso : 0;
    const [rotulo, bg, cor] = a.projeto
      ? (SELO_STATUS[a.projeto.status] ?? SELO_STATUS.nao_iniciado)
      : ['Sem álbum', '#F1F5FD', '#46536A'];
    const quantas = pessoas.filter((pe) => lista.some((p) => p.faces.includes(pe.id))).length;
    return {
      name: a.name,
      sub: a.projeto
        ? [a.projeto.produto_nome, a.projeto.produto_tamanho].filter(Boolean).join(' · ') ||
          'álbum criado a partir desta galeria'
        : 'fotos ainda não usadas em nenhum álbum',
      chip: rotulo,
      chipStyle:
        `white-space:nowrap;padding:5px 11px;border-radius:999px;background:${bg};color:${cor};` +
        'font-size:12px;font-weight:700',
      pctLabel: `${pct}%`,
      barStyle: `width:${pct}%;height:100%;border-radius:999px;background:linear-gradient(90deg,#2563EB,#06B6D4)`,
      coverStyle:
        'position:relative;height:150px;overflow:hidden;' +
        (capa
          ? `background-image:url('${capa}');background-size:cover;background-position:center`
          : `background-image:linear-gradient(140deg, rgba(255,255,255,.16), rgba(11,18,32,.2)),${a.grad}`),
      photosLabel: `${lista.length} ${lista.length === 1 ? 'foto' : 'fotos'}`,
      facesLabel: `${quantas} ${quantas === 1 ? 'pessoa reconhecida' : 'pessoas reconhecidas'}`,
      openPhotos: () => {
        setView('all');
        setAlbum(a.id);
      },
    };
  });

  // -------------------------------------------------------- detalhe da foto
  const alvo = photo === null ? null : modelo.find((p) => p.id === photo) ?? null;
  const photoDetail = !alvo
    ? null
    : {
        ...cartao(alvo),
        heroStyle:
          `width:100%;aspect-ratio:${alvo.orient === 'v' ? '3 / 4' : '4 / 3'};border-radius:14px;` +
          `background-color:#EEF1F7;background-image:url('${alvo.url}');background-size:cover;background-position:center`,
        faceList: alvo.faces.length
          ? alvo.faces.map((id) => {
              const pe = pessoas.find((x) => x.id === id);
              const fundo = pe ? recorte(pe) : '';
              const nome = pe?.nome ?? 'Sem nome';
              return {
                name: nome,
                initials: fundo ? '' : iniciaisDe(nome),
                avatarStyle:
                  `width:26px;height:26px;border-radius:9px;${fundo || 'background:linear-gradient(140deg,#2563EB,#06B6D4);'}` +
                  'background-size:cover;color:#FFFFFF;display:flex;align-items:center;justify-content:center;' +
                  'font-size:10px;font-weight:800;flex:0 0 auto',
              };
            })
          : [
              {
                name: 'Nenhum rosto reconhecido',
                initials: '–',
                avatarStyle:
                  'width:26px;height:26px;border-radius:9px;background:#DCE3EF;color:#FFFFFF;display:flex;' +
                  'align-items:center;justify-content:center;font-size:10px;font-weight:800;flex:0 0 auto',
              },
            ],
        // Só linha com dado no banco. Sem "momento" nem nota de qualidade.
        rows: [
          { k: 'Arquivo', v: alvo.nome },
          { k: 'Formato', v: alvo.orient === 'v' ? 'Vertical' : 'Horizontal' },
          {
            k: 'Resolução',
            v: alvo.largura && alvo.altura ? `${alvo.largura} × ${alvo.altura} px` : 'não gravada',
          },
          {
            k: 'Álbuns',
            v: alvo.albuns.length
              ? alvo.albuns.map((id) => albuns.find((a) => a.id === id)?.name ?? '—').join(', ')
              : 'ainda livre',
          },
          { k: 'Rostos', v: `${alvo.faces.length}` },
        ],
        selBtnLabel: picked.includes(alvo.id) ? 'Remover da seleção' : 'Selecionar foto',
        selBtnStyle:
          'flex:1;height:46px;display:flex;align-items:center;justify-content:center;gap:8px;border-radius:12px;border:0;' +
          `background:${picked.includes(alvo.id) ? '#0B1220' : 'linear-gradient(135deg,#2563EB,#06B6D4)'};` +
          'color:#FFFFFF;font-family:inherit;font-size:13.5px;font-weight:700;cursor:pointer',
      };

  const filtrosAtivos =
    (album !== 'all' ? 1 : 0) +
    (orient !== 'all' ? 1 : 0) +
    (tag !== 'all' ? 1 : 0) +
    (face ? 1 : 0) +
    (query.trim() ? 1 : 0);

  const seg = (ativo: boolean) =>
    'display:flex;align-items:center;gap:8px;height:38px;padding:0 15px;border:0;border-radius:10px;' +
    `background:${ativo ? '#FFFFFF' : 'transparent'};color:${ativo ? '#2563EB' : '#6B7A90'};` +
    `box-shadow:${ativo ? '0 2px 8px rgba(11,18,32,.08)' : 'none'};font-family:inherit;font-size:13px;` +
    `font-weight:${ativo ? 700 : 600};cursor:pointer;white-space:nowrap;transition:background .15s,color .15s`;

  const comRostos = modelo.filter((p) => p.faces.length > 0).length;

  return (
    <div className="om-cliente">
      <style dangerouslySetInnerHTML={{ __html: CSS_PSEUDO }} />
      <GaleriaDesign
        v={{
          ...casca,

          chipGaleria: galeriaNome,
          resumo:
            `${modelo.length} ${modelo.length === 1 ? 'foto liberada' : 'fotos liberadas'} por ${loja.nome}` +
            ` · ${pessoas.length} ${pessoas.length === 1 ? 'pessoa reconhecida' : 'pessoas reconhecidas'}` +
            ` em ${comRostos} ${comRostos === 1 ? 'foto' : 'fotos'}`,

          // ---------------------------------------------------------- vistas
          viewAll: () => setView('all'),
          viewAlbums: () => setView('albums'),
          viewAllStyle: seg(view === 'all'),
          viewAlbumsStyle: seg(view === 'albums'),
          isAlbumView: view === 'albums',
          albumCards,
          groups,
          isEmpty: view !== 'albums' && visiveis.length === 0,

          // --------------------------------------------------------- filtros
          album,
          orient,
          tag,
          query,
          onAlbum: (ev: React.ChangeEvent<HTMLSelectElement>) => setAlbum(ev.target.value),
          onOrient: (ev: React.ChangeEvent<HTMLSelectElement>) => setOrient(ev.target.value),
          onTag: (ev: React.ChangeEvent<HTMLSelectElement>) => setTag(ev.target.value),
          onQuery: (ev: React.ChangeEvent<HTMLInputElement>) => setQuery(ev.target.value),
          albumOptions: [
            { value: 'all', label: 'Todos os álbuns' },
            ...albuns.map((a) => ({ value: a.id, label: a.name })),
          ],
          orientOptions: [
            { value: 'all', label: 'Todos os formatos' },
            { value: 'v', label: 'Só verticais' },
            { value: 'h', label: 'Só horizontais' },
          ],
          tagOptions: [
            { value: 'all', label: 'Rostos e uso: tudo' },
            { value: 'faces', label: 'Com rostos' },
            { value: 'nofaces', label: 'Sem rostos' },
            { value: 'used', label: 'Já usadas' },
            { value: 'unused', label: 'Ainda livres' },
          ],
          clearFilters: () => {
            setAlbum('all');
            setOrient('all');
            setTag('all');
            setFace(null);
            setQuery('');
          },
          clearBtnStyle:
            'height:46px;padding:0 16px;display:flex;align-items:center;gap:8px;border-radius:12px;' +
            `border:1px solid ${filtrosAtivos ? '#FBD5DD' : '#E6EAF2'};background:#FFFFFF;` +
            `color:${filtrosAtivos ? '#E11D48' : '#9AA7BC'};font-family:inherit;font-size:13.5px;font-weight:600;` +
            'cursor:pointer;white-space:nowrap',

          // --------------------------------------------------------- pessoas
          faces,
          faceScopeGeral: () => setFaceByAlbum(false),
          faceScopeAlbum: () => setFaceByAlbum(true),
          faceScopeGeralStyle: seg(!faceByAlbum),
          faceScopeAlbumStyle: seg(faceByAlbum),

          // ---------------------------------------------------------- seleção
          selectAll: () => setPicked(visiveis.map((p) => p.id)),
          clearSel: () => setPicked([]),
          selTitle: `${picked.length} ${picked.length === 1 ? 'foto selecionada' : 'fotos selecionadas'}`,
          selSub: 'dá para usar a mesma foto em mais de um álbum',
          selBarStyle:
            'position:fixed;left:50%;bottom:26px;z-index:60;display:flex;align-items:center;gap:14px;' +
            'padding:12px 16px;border-radius:18px;background:#0B1220;box-shadow:0 22px 48px rgba(11,18,32,.32);' +
            `width:min(720px,calc(100vw - 60px));transform:translate(-50%,${picked.length ? '0' : '160%'});` +
            `opacity:${picked.length ? 1 : 0};transition:transform .26s cubic-bezier(.2,.8,.2,1),opacity .2s ease`,

          // ---------------------------------------------------- detalhe da foto
          photoDetail,
          hasPhoto: Boolean(photoDetail),
          closePhoto: () => setPhoto(null),
          photoDrawerStyle:
            'position:fixed;top:0;right:0;bottom:0;width:400px;max-width:92vw;z-index:75;background:#FFFFFF;' +
            'border-left:1px solid #E6EAF2;box-shadow:-24px 0 60px rgba(11,18,32,.18);' +
            `transform:translateX(${photoDetail ? '0' : '104%'});transition:transform .26s cubic-bezier(.2,.8,.2,1)`,
          photoScrimStyle:
            `position:fixed;inset:0;z-index:70;background:rgba(11,18,32,.34);opacity:${photoDetail ? 1 : 0};` +
            `pointer-events:${photoDetail ? 'auto' : 'none'};transition:opacity .22s ease`,
        }}
      />
      <MenuCliente />
    </div>
  );
}
