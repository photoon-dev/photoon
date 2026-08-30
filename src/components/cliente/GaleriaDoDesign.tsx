'use client';

import { useMemo, useState } from 'react';
import GaleriaDesign, { CSS_PSEUDO } from '@/components/design/GaleriaDesign';
import MenuCliente from '@/components/cliente/MenuCliente';
import { useCascaCliente, type LojaDaCasca } from '@/components/cliente/useCascaCliente';
import type { Foto, Notificacao, PessoaDaGaleria, RostoDaFoto } from '@/lib/data';

/**
 * Galeria de fotos do cliente com o layout do design.
 *
 * Como a Ajuda, esta tela é referenciada pelas outras (`Cliente Galeria de
 * fotos.dc.html`) mas não veio no zip. Foi escrita na mesma casca das demais e
 * segue o mesmo caminho: markup transliterado, dado real aqui.
 *
 * O filtro por pessoa usa os rostos já agrupados — cada bolinha é o recorte de
 * um rosto real da galeria. É o que resolve o problema de achar "as fotos da
 * vovó" num acervo de centenas.
 */

type Filtro = 'todas' | 'com-pessoas' | 'sem-pessoas' | 'verticais' | 'horizontais';

const FILTROS: [Filtro, string][] = [
  ['todas', 'Todas'],
  ['com-pessoas', 'Com pessoas'],
  ['sem-pessoas', 'Sem pessoas'],
  ['verticais', 'Verticais'],
  ['horizontais', 'Horizontais'],
];

export default function GaleriaDoDesign({
  dono,
  loja,
  notificacoes,
  fotos,
  rostos,
  pessoas,
  galeriaNome,
}: {
  dono: { nome: string; email: string; sub: string };
  loja: LojaDaCasca;
  notificacoes: Notificacao[];
  fotos: Foto[];
  rostos: RostoDaFoto[];
  pessoas: PessoaDaGaleria[];
  galeriaNome: string;
}) {
  const casca = useCascaCliente({ dono, loja, notificacoes });
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [pessoa, setPessoa] = useState<string | null>(null);
  const [aberta, setAberta] = useState<number | null>(null);

  const porFoto = useMemo(() => {
    const m = new Map<string, RostoDaFoto[]>();
    for (const r of rostos) m.set(r.fotoId, [...(m.get(r.fotoId) ?? []), r]);
    return m;
  }, [rostos]);

  const porId = useMemo(() => new Map(fotos.map((f) => [f.id, f])), [fotos]);

  /** Recorte quadrado do rosto de capa, para a bolinha. */
  const capa = (p: PessoaDaGaleria) => {
    const r = rostos.find((x) => x.id === p.rostoCapaId) ?? rostos.find((x) => x.pessoaId === p.id);
    const f = r ? porId.get(r.fotoId) : undefined;
    if (!r || !f) return '';
    // A caixa vem em fração da foto: ampliar a imagem no inverso da largura do
    // rosto e centrar na caixa deixa o rosto com um pouco de cabelo e ombro,
    // que é o que faz reconhecer a pessoa.
    const x = ((r.caixa.x + r.caixa.w / 2) * 100).toFixed(1);
    const y = ((r.caixa.y + r.caixa.h / 2) * 100).toFixed(1);
    return (
      `background-image:url('${f.url}');background-size:${((1 / r.caixa.w) * 100).toFixed(1)}% auto;` +
      `background-position:${x}% ${y}%`
    );
  };

  const visiveis = useMemo(() => {
    let lista = fotos;
    if (pessoa) {
      const ids = new Set(rostos.filter((r) => r.pessoaId === pessoa).map((r) => r.fotoId));
      lista = lista.filter((f) => ids.has(f.id));
    }
    switch (filtro) {
      case 'verticais':
        return lista.filter((f) => f.largura && f.altura && f.altura > f.largura);
      case 'horizontais':
        return lista.filter((f) => f.largura && f.altura && f.largura >= f.altura);
      case 'com-pessoas':
        return lista.filter((f) => (porFoto.get(f.id)?.length ?? 0) > 0);
      case 'sem-pessoas':
        return lista.filter((f) => (porFoto.get(f.id)?.length ?? 0) === 0);
      default:
        return lista;
    }
  }, [fotos, rostos, filtro, pessoa, porFoto]);

  const nomePessoa = pessoas.find((p) => p.id === pessoa)?.nome;
  const visor = aberta !== null ? visiveis[aberta] : undefined;

  const parar = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className="om-cliente">
      <style dangerouslySetInnerHTML={{ __html: CSS_PSEUDO }} />
      <GaleriaDesign
        v={{
          ...casca,

          resumo:
            `${galeriaNome} · ${fotos.length} ${fotos.length === 1 ? 'foto' : 'fotos'}` +
            (visiveis.length !== fotos.length ? ` · ${visiveis.length} nesta seleção` : ''),

          // ---------------------------------------------------------- pessoas
          pessoasCartao: pessoas.length
            ? 'background:#FFFFFF;border:1px solid #E6EAF2;border-radius:14px;padding:24px 26px'
            : 'display:none',
          pessoasNota: 'Toque numa pessoa para ver só as fotos em que ela aparece.',
          limparPessoa: () => setPessoa(null),
          limparEstilo: pessoa
            ? 'height:40px;padding:0 14px;display:flex;align-items:center;gap:8px;border:1px solid #E6EAF2;' +
              'border-radius:11px;background:#FFFFFF;color:#46536A;font-family:inherit;font-size:12.5px;' +
              'font-weight:600;cursor:pointer'
            : 'display:none',
          pessoas: pessoas.map((p) => {
            const on = pessoa === p.id;
            const quantas = rostos.filter((r) => r.pessoaId === p.id).length;
            const nome = p.nome ?? 'Sem nome';
            return {
              nome,
              titulo: `${nome} · ${quantas} ${quantas === 1 ? 'foto' : 'fotos'}`,
              foto:
                'width:62px;height:62px;border-radius:999px;background-color:#EAF0FF;' +
                `box-shadow:0 0 0 ${on ? '3px #2563EB' : '1px #E6EAF2'};transition:box-shadow .16s;` +
                capa(p),
              nomeEstilo:
                'width:100%;font-size:11.5px;text-align:center;white-space:nowrap;overflow:hidden;' +
                'text-overflow:ellipsis;' +
                (on ? 'color:#2563EB;font-weight:700' : 'color:#6B7A90;font-weight:500'),
              escolher: () => setPessoa(on ? null : p.id),
            };
          }),

          // ---------------------------------------------------------- filtros
          filtros: FILTROS.map(([id, rotulo]) => {
            const on = filtro === id;
            return {
              rotulo,
              estilo:
                'height:38px;padding:0 16px;border-radius:999px;font-family:inherit;font-size:12.5px;' +
                'cursor:pointer;white-space:nowrap;transition:background .15s,color .15s;' +
                (on
                  ? 'border:0;background:#0B1220;color:#FFFFFF;font-weight:700'
                  : 'border:1px solid #E6EAF2;background:#FFFFFF;color:#46536A;font-weight:500'),
              escolher: () => {
                setFiltro(id);
                setAberta(null);
              },
            };
          }),

          // ---------------------------------------------------------- grade
          vazioEstilo: visiveis.length
            ? 'display:none'
            : 'margin:0;padding:56px 26px;text-align:center;font-size:13.5px;color:#9AA7BC;' +
              'border:1px solid #E6EAF2;border-radius:14px;background:#FFFFFF',
          vazioTexto:
            fotos.length === 0
              ? 'A loja ainda não liberou fotos para você.'
              : nomePessoa
                ? `Nenhuma foto de ${nomePessoa} com este filtro.`
                : 'Nenhuma foto com este filtro.',

          fotos: visiveis.map((f, i) => {
            const n = porFoto.get(f.id)?.length ?? 0;
            return {
              url: f.url,
              titulo: n
                ? `${n} ${n === 1 ? 'rosto reconhecido' : 'rostos reconhecidos'}`
                : 'Sem rosto reconhecido',
              rostos: String(n),
              selo: n
                ? 'position:absolute;top:9px;right:9px;height:24px;padding:0 9px;display:flex;' +
                  'align-items:center;gap:5px;border-radius:999px;background:rgba(11,18,32,.62);' +
                  'color:#FFFFFF;font-size:11px;font-weight:700;backdrop-filter:blur(2px)'
                : 'display:none',
              abrir: () => setAberta(i),
            };
          }),

          // ---------------------------------------------------------- visor
          visorAberto: Boolean(visor),
          visorUrl: visor?.url ?? '',
          visorContagem: `${(aberta ?? 0) + 1} de ${visiveis.length}`,
          fecharVisor: () => setAberta(null),
          segurar: parar,
          anterior: (e: React.MouseEvent) => {
            parar(e);
            setAberta((a) => (a === null ? null : Math.max(0, a - 1)));
          },
          proxima: (e: React.MouseEvent) => {
            parar(e);
            setAberta((a) => (a === null ? null : Math.min(visiveis.length - 1, a + 1)));
          },
        }}
      />
      <MenuCliente />
    </div>
  );
}
