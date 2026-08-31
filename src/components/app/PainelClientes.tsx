'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { ClienteDaLoja, Template } from '@/lib/lojista';
import {
  cadastrarCliente,
  criarGaleria,
  criarProjetoParaCliente,
  reagruparPessoas,
  fotosSemAnalise,
  salvarRostosExistentes,
  registrarFotos,
  removerCliente,
  renomearPessoa,
  type RostoEnviado,
} from '@/app/app/actions';
import { analisarFoto, analisarUrl, medirFoto } from '@/lib/faceapi';
import { COR } from '@/components/ui/tokens';
import CartaoKPI from '@/components/ui/CartaoKPI';
import Selo from '@/components/ui/Selo';
import Botao from '@/components/ui/Botao';
import Modal from '@/components/ui/Modal';
import EstadoVazio from '@/components/ui/EstadoVazio';

const ESTILO_INPUT: React.CSSProperties = {
  height: 36,
  padding: '0 12px',
  border: `1px solid ${COR.linha}`,
  borderRadius: 10,
  background: COR.papel,
  color: COR.tinta,
  fontSize: 13,
  fontFamily: 'inherit',
  width: '100%',
};

const ROTULO = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.6px',
  textTransform: 'uppercase' as const,
  color: COR.fraco,
};

const STATUS_ROTULO: Record<string, string> = {
  nao_iniciado: 'Nao iniciado',
  em_edicao: 'Em edicao',
  com_pendencias: 'Com pendencias',
  pronto: 'Pronto',
  finalizado: 'Finalizado',
};

async function analisarGaleria(
  galeriaId: string,
  aoAndar: (feitas: number, achados: number) => void,
) {
  let feitas = 0;
  let achados = 0;
  for (;;) {
    const lote = await fotosSemAnalise(galeriaId, 20);
    if (!lote.length) break;
    const resultados = [];
    for (const f of lote) {
      const r = await analisarUrl(f.url);
      resultados.push({
        fotoId: f.id,
        largura: r?.largura,
        altura: r?.altura,
        rostos: r?.rostos ?? [],
      });
      achados += r?.rostos.length ?? 0;
      feitas += 1;
      aoAndar(feitas, achados);
    }
    await salvarRostosExistentes(galeriaId, resultados);
  }
  return { feitas, achados };
}

export default function PainelClientes({
  clientes,
  templates,
  slugLoja,
  dominio,
  total,
  pagina,
  porPagina,
  busca,
}: {
  clientes: ClienteDaLoja[];
  templates: Template[];
  slugLoja: string;
  dominio: string;
  total: number;
  pagina: number;
  porPagina: number;
  busca: string;
}) {
  const router = useRouter();
  const buscaParams = useSearchParams();
  const caminho = usePathname();
  const [pendente, iniciar] = useTransition();
  const [analise, setAnalise] = useState<{ galeria: string; feitas: number; achados: number } | null>(null);
  const [aberto, setAberto] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState<string | null>(null);
  const [progresso, setProgresso] = useState({ feitas: 0, total: 0 });
  const [rostosVistos, setRostosVistos] = useState(0);
  const [analisar, setAnalisar] = useState(true);
  const [modalNovo, setModalNovo] = useState(false);

  const linkDaLoja = `https://${slugLoja}.${dominio}/entrar`;

  // KPIs calculados a partir da pagina
  const kpis = calcularKpis(clientes, total);

  async function enviarFotos(galeriaId: string, arquivos: FileList) {
    setErro(null);
    setEnviando(galeriaId);
    setProgresso({ feitas: 0, total: arquivos.length });
    setRostosVistos(0);
    const supabase = createClient();
    const registrados: {
      storage_path: string;
      largura?: number | null;
      altura?: number | null;
      rostos?: RostoEnviado[];
    }[] = [];
    try {
      let achados = 0;
      for (let i = 0; i < arquivos.length; i++) {
        const arq = arquivos[i];
        const nome = `${Date.now()}-${i}-${arq.name.replace(/[^\w.\-]/g, '_')}`;
        const caminhoUp = `${galeriaId}/${nome}`;
        const { error } = await supabase.storage
          .from('galerias')
          .upload(caminhoUp, arq, { contentType: arq.type, upsert: false });
        if (error) throw new Error(`${arq.name}: ${error.message}`);
        const { largura, altura, rostos } = analisar
          ? await analisarFoto(arq)
          : { ...(await medirFoto(arq)), rostos: [] };
        achados += rostos.length;
        setRostosVistos(achados);
        registrados.push({ storage_path: caminhoUp, largura, altura, rostos });
        setProgresso({ feitas: i + 1, total: arquivos.length });
      }
      await registrarFotos(galeriaId, registrados);
      location.reload();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Falha ao enviar as fotos.');
    } finally {
      setEnviando(null);
    }
  }

  const irPara = (p: number) => {
    const params = new URLSearchParams(buscaParams.toString());
    if (p <= 0) params.delete('p');
    else params.set('p', String(p));
    const s = params.toString();
    iniciar(() => router.push(s ? `${caminho}?${s}` : caminho));
  };

  const totalPaginas = Math.max(1, Math.ceil(total / porPagina));
  const linkVoltar = (p: number) => {
    const params = new URLSearchParams(buscaParams.toString());
    if (p <= 0) params.delete('p');
    else params.set('p', String(p));
    const s = params.toString();
    return s ? `${caminho}?${s}` : caminho;
  };

  return (
    <>
      {/* Cabecalho: titulo + KPIs + acao principal */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                margin: '0 0 4px',
                fontSize: 11,
                letterSpacing: '1.4px',
                textTransform: 'uppercase',
                color: COR.fraco,
                fontWeight: 700,
              }}
            >
              Clientes
            </p>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>
              Clientes da loja
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 13.5, color: COR.apagado }}>
              {total.toLocaleString('pt-BR')} cadastrado{total === 1 ? '' : 's'}
              {total > porPagina && ` · pagina ${pagina + 1} de ${totalPaginas}`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Botao variante="primario" onClick={() => setModalNovo(true)}>
              + Novo cliente
            </Botao>
          </div>
        </div>

        {/* 4 KPIs compactos */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: 10,
          }}
        >
          <CartaoKPI
            rotulo="Clientes ativos"
            valor={kpis.ativos.toLocaleString('pt-BR')}
            nota="com acesso a loja"
            tom="azul"
            compacto
          />
          <CartaoKPI
            rotulo="Novos no periodo"
            valor={kpis.novos.toLocaleString('pt-BR')}
            nota="convidados na pagina"
            tom="verde"
            compacto
          />
          <CartaoKPI
            rotulo="Com projetos"
            valor={kpis.comProjetos.toLocaleString('pt-BR')}
            nota="album iniciado"
            compacto
          />
          <CartaoKPI
            rotulo="Sem pedidos"
            valor={kpis.semPedidos.toLocaleString('pt-BR')}
            nota="ainda nao compraram"
            tom={kpis.semPedidos > 0 ? 'ambar' : 'neutro'}
            compacto
          />
        </div>

        {/* Barra de busca + link secundario */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <form
            method="get"
            style={{ display: 'flex', gap: 8, alignItems: 'center' }}
          >
            <input
              name="q"
              defaultValue={busca}
              placeholder="Buscar por nome ou e-mail"
              style={{ ...ESTILO_INPUT, maxWidth: 420, flex: 1 }}
            />
            <Botao variante="primario" type="submit">
              Buscar
            </Botao>
            {busca && (
              <a
                href={caminho}
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: COR.coral,
                  textDecoration: 'underline',
                }}
              >
                Limpar
              </a>
            )}
          </form>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              background: COR.papel,
              border: `1px solid ${COR.linha}`,
              borderRadius: 12,
              fontSize: 12,
            }}
          >
            <span style={{ color: COR.fraco, fontWeight: 600 }}>Link da loja:</span>
            <span style={{ color: COR.azul, fontFamily: 'monospace' }}>{linkDaLoja}</span>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(linkDaLoja)}
              style={{
                border: 0,
                background: 'transparent',
                color: COR.azul,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Copiar
            </button>
          </div>
        </div>
      </div>

      {erro && (
        <p
          style={{
            margin: 0,
            padding: '10px 14px',
            borderRadius: 12,
            background: '#FFF1F3',
            color: COR.coral,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {erro}
        </p>
      )}

      {/* Tabela de clientes */}
      {clientes.length === 0 ? (
        <div
          style={{
            background: COR.papel,
            border: `1px solid ${COR.linha}`,
            borderRadius: 16,
            padding: '46px 26px',
            boxShadow: '0 2px 8px rgba(11,18,32,.03)',
          }}
        >
          <EstadoVazio
            titulo={busca ? 'Nenhum cliente encontrado' : 'Nenhum cliente ainda'}
            descricao={
              busca
                ? `Nada corresponde a "${busca}".`
                : 'Cadastre o primeiro cliente no botao acima e envie o link da loja para ele.'
            }
          />
        </div>
      ) : (
        <div
          style={{
            background: COR.papel,
            border: `1px solid ${COR.linha}`,
            borderRadius: 16,
            boxShadow: '0 2px 8px rgba(11,18,32,.03)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1.6fr 0.8fr 0.8fr 0.8fr 0.7fr 60px',
              gap: 12,
              padding: '10px 18px',
              borderBottom: `1px solid ${COR.linhaClara}`,
              background: '#FBFCFE',
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: '1.1px',
              textTransform: 'uppercase',
              color: COR.fraco,
            }}
          >
            <span>Cliente</span>
            <span>E-mail</span>
            <span style={{ textAlign: 'right' }}>Eventos</span>
            <span style={{ textAlign: 'right' }}>Fotos</span>
            <span style={{ textAlign: 'right' }}>Álbums</span>
            <span style={{ textAlign: 'center' }}>Status</span>
            <span />
          </div>
          {clientes.map((c) => {
            const galerias = c.galerias ?? [];
            const totalFotos = galerias.reduce(
              (t, g) => t + (g.galeria_fotos?.[0]?.count ?? 0),
              0,
            );
            const expandido = aberto === c.id;
            return (
              <div key={c.id}>
                <button
                  type="button"
                  onClick={() => setAberto(expandido ? null : c.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: expandido ? '#F1F5FD' : COR.papel,
                    border: 0,
                    borderBottom: `1px solid ${COR.linhaClara}`,
                    padding: '12px 18px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    display: 'grid',
                    gridTemplateColumns: '1.4fr 1.6fr 0.8fr 0.8fr 0.8fr 0.7fr 60px',
                    gap: 12,
                    alignItems: 'center',
                    fontSize: 13,
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background: COR.azul,
                        color: COR.papel,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: 12,
                        flex: '0 0 auto',
                      }}
                    >
                      {(c.nome ?? c.email ?? '?').slice(0, 2).toUpperCase()}
                    </span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.nome ?? c.email ?? 'sem nome'}
                    </span>
                  </span>
                  <span
                    style={{
                      color: COR.apagado,
                      fontSize: 12,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {c.email ?? '—'}
                  </span>
                  <span style={{ textAlign: 'right', color: COR.tinta, fontWeight: 700 }}>
                    {galerias.length}
                  </span>
                  <span style={{ textAlign: 'right', color: COR.tinta, fontWeight: 700 }}>
                    {totalFotos}
                  </span>
                  <span style={{ textAlign: 'right', color: COR.tinta, fontWeight: 700 }}>
                    {c.projetos?.length ?? 0}
                  </span>
                  <span style={{ textAlign: 'center' }}>
                    <Selo tom={c.user_id ? 'verde' : 'ambar'}>
                      {c.user_id ? 'ativo' : 'pendente'}
                    </Selo>
                  </span>
                  <span
                    style={{
                      textAlign: 'right',
                      color: COR.azul,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {expandido ? 'fechar' : 'abrir'}
                  </span>
                </button>

                {expandido && (
                  <DetalheCliente
                    c={c}
                    templates={templates}
                    enviando={enviando}
                    enviarFotos={enviarFotos}
                    analisar={analisar}
                    setAnalisar={setAnalisar}
                    analise={analise}
                    setAnalise={setAnalise}
                  />
                )}
              </div>
            );
          })}

          {total > porPagina && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 18px',
                borderTop: `1px solid ${COR.linhaClara}`,
                background: '#FBFCFE',
                fontSize: 12.5,
                color: COR.apagado,
              }}
            >
              <span>
                {total.toLocaleString('pt-BR')} cliente{total === 1 ? '' : 's'} · pagina{' '}
                {pagina + 1} de {totalPaginas}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <a
                  href={linkVoltar(pagina - 1)}
                  aria-disabled={pagina === 0}
                  style={{
                    ...ESTILO_INPUT,
                    width: 'auto',
                    padding: '0 12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: pagina === 0 ? COR.fraco : COR.texto,
                    pointerEvents: pagina === 0 ? 'none' : 'auto',
                  }}
                >
                  Anteriores
                </a>
                <a
                  href={linkVoltar(pagina + 1)}
                  aria-disabled={(pagina + 1) * porPagina >= total}
                  style={{
                    ...ESTILO_INPUT,
                    width: 'auto',
                    padding: '0 12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: (pagina + 1) * porPagina >= total ? COR.fraco : COR.texto,
                    pointerEvents: (pagina + 1) * porPagina >= total ? 'none' : 'auto',
                  }}
                >
                  Proximos
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal "Novo cliente" */}
      <Modal
        aberto={modalNovo}
        aoFechar={() => setModalNovo(false)}
        titulo="Novo cliente"
        descricao="O acesso e por e-mail. A conta se vincula sozinha quando a pessoa entrar pelo link da loja."
      >
        <form
          action={cadastrarCliente}
          onSubmit={() => setModalNovo(false)}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={ROTULO}>E-mail</span>
            <input
              name="email"
              type="email"
              required
              placeholder="cliente@email.com"
              style={ESTILO_INPUT}
            />
          </label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
            }}
          >
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={ROTULO}>Nome</span>
              <input name="nome" placeholder="Nome do cliente" style={ESTILO_INPUT} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={ROTULO}>Telefone</span>
              <input name="telefone" placeholder="(11) 90000-0000" style={ESTILO_INPUT} />
            </label>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
              marginTop: 4,
            }}
          >
            <Botao variante="secundario" onClick={() => setModalNovo(false)}>
              Cancelar
            </Botao>
            <Botao variante="primario" type="submit">
              Cadastrar
            </Botao>
          </div>
        </form>
      </Modal>
    </>
  );
}

function DetalheCliente({
  c,
  templates,
  enviando,
  enviarFotos,
  analisar,
  setAnalisar,
  analise,
  setAnalise,
}: {
  c: ClienteDaLoja;
  templates: Template[];
  enviando: string | null;
  enviarFotos: (galeriaId: string, arquivos: FileList) => void;
  analisar: boolean;
  setAnalisar: (v: boolean) => void;
  analise: { galeria: string; feitas: number; achados: number } | null;
  setAnalise: (v: { galeria: string; feitas: number; achados: number } | null) => void;
}) {
  const galerias = c.galerias ?? [];
  return (
    <div
      style={{
        background: COR.papelSuave,
        borderBottom: `1px solid ${COR.linhaClara}`,
        padding: '14px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {galerias.map((g) => {
        const fotos = g.galeria_fotos?.[0]?.count ?? 0;
        const albuns = (c.projetos ?? []).filter((p) => p.galeria_id === g.id);
        return (
          <div
            key={g.id}
            style={{
              display: 'grid',
              gap: 14,
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
              background: COR.papel,
              border: `1px solid ${COR.linha}`,
              borderRadius: 12,
              padding: 14,
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{g.nome}</p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: COR.apagado }}>
                {fotos} foto{fotos === 1 ? '' : 's'} · {albuns.length} album
                {albuns.length === 1 ? '' : 'ns'}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 11, color: COR.fraco }}>
                {[
                  g.templates_permitidos?.length
                    ? `${g.templates_permitidos.length} modelo(s) liberado(s)`
                    : 'todos os modelos',
                  g.paginas_min || g.paginas_max
                    ? `${g.paginas_min ?? '?'}-${g.paginas_max ?? '?'} paginas`
                    : null,
                  g.fotos_max ? `ate ${g.fotos_max} fotos` : null,
                  g.permite_paginas_extras ? null : 'sem paginas extras',
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>

              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 10,
                  padding: '8px 14px',
                  background: COR.azul,
                  color: COR.papel,
                  borderRadius: 10,
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {enviando === g.id
                  ? 'Enviando…'
                  : 'Enviar fotos deste evento'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  disabled={enviando !== null}
                  onChange={(e) => e.target.files?.length && enviarFotos(g.id, e.target.files)}
                />
              </label>

              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 8,
                  fontSize: 11.5,
                  color: COR.apagado,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={analisar}
                  disabled={enviando !== null}
                  onChange={(e) => setAnalisar(e.target.checked)}
                  style={{ accentColor: COR.azul }}
                />
                Identificar pessoas nas fotos
              </label>

              <button
                type="button"
                onClick={async () => {
                  setAnalise({ galeria: g.id, feitas: 0, achados: 0 });
                  try {
                    await analisarGaleria(g.id, (feitas, achados) =>
                      setAnalise({ galeria: g.id, feitas, achados }),
                    );
                    location.reload();
                  } finally {
                    setAnalise(null);
                  }
                }}
                disabled={analise?.galeria === g.id}
                style={{
                  marginLeft: 12,
                  marginTop: 8,
                  background: 'transparent',
                  border: 0,
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: COR.azul,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                {analise?.galeria === g.id
                  ? `Analisando… ${analise.feitas} fotos, ${analise.achados} rostos`
                  : 'Detectar rostos nas fotos antigas'}
              </button>

              {g.pessoas?.length > 0 && (
                <div
                  style={{
                    marginTop: 10,
                    paddingTop: 10,
                    borderTop: `1px solid ${COR.linhaClara}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <p style={{ ...ROTULO, margin: 0 }}>
                    {g.pessoas.length} pessoa{g.pessoas.length === 1 ? '' : 's'} reconhecida
                    {g.pessoas.length === 1 ? '' : 's'}
                  </p>
                  {g.pessoas.map((pe) => (
                    <form
                      key={pe.id}
                      action={async (fd: FormData) => {
                        await renomearPessoa(pe.id, String(fd.get('nome') ?? ''));
                      }}
                      style={{ display: 'flex', gap: 8, alignItems: 'center' }}
                    >
                      <input
                        name="nome"
                        defaultValue={pe.nome ?? ''}
                        placeholder="Quem e?"
                        style={{
                          height: 30,
                          flex: 1,
                          minWidth: 0,
                          padding: '0 8px',
                          border: `1px solid ${COR.linha}`,
                          borderRadius: 8,
                          fontSize: 12.5,
                          fontFamily: 'inherit',
                        }}
                      />
                      <span style={{ fontSize: 11, color: COR.fraco }}>
                        {pe.rostos?.[0]?.count ?? 0} foto
                        {(pe.rostos?.[0]?.count ?? 0) === 1 ? '' : 's'}
                      </span>
                      <button
                        type="submit"
                        style={{
                          height: 30,
                          padding: '0 10px',
                          border: `1px solid ${COR.linha}`,
                          borderRadius: 8,
                          background: COR.papel,
                          fontSize: 12,
                          fontWeight: 600,
                          color: COR.texto,
                          cursor: 'pointer',
                        }}
                      >
                        Salvar
                      </button>
                    </form>
                  ))}
                  <button
                    type="button"
                    onClick={() => reagruparPessoas(g.id).then(() => location.reload())}
                    style={{
                      alignSelf: 'flex-start',
                      background: 'transparent',
                      border: 0,
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: COR.azul,
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Reagrupar rostos
                  </button>
                </div>
              )}
            </div>

            <div>
              {albuns.length > 0 && (
                <ul
                  style={{
                    listStyle: 'none',
                    margin: '0 0 10px',
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  {albuns.map((p) => (
                    <li
                      key={p.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                        padding: '8px 12px',
                        border: `1px solid ${COR.linha}`,
                        borderRadius: 10,
                        background: COR.papel,
                        fontSize: 13,
                      }}
                    >
                      <span
                        style={{
                          minWidth: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontWeight: 600,
                        }}
                      >
                        {p.titulo}
                      </span>
                      <span style={{ fontSize: 11.5, color: COR.apagado, flex: '0 0 auto' }}>
                        {STATUS_ROTULO[p.status] ?? p.status} · {p.progresso}%
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <form
                action={criarProjetoParaCliente}
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
              >
                <input type="hidden" name="cliente_id" value={c.id} />
                <input type="hidden" name="galeria_id" value={g.id} />
                <select
                  name="template_id"
                  required
                  style={ESTILO_INPUT}
                >
                  <option value="">Escolha o modelo…</option>
                  {templates
                    .filter((t) => t.publicado)
                    .filter(
                      (t) =>
                        !g.templates_permitidos?.length ||
                        g.templates_permitidos.includes(t.id),
                    )
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nome} — {t.largura_mm / 10}x{t.altura_mm / 10} cm
                        {t.lojista_id ? '' : ' (padrao)'}
                      </option>
                    ))}
                </select>
                <input name="titulo" placeholder="Nome do album (opcional)" style={ESTILO_INPUT} />
                <Botao variante="primario" type="submit">
                  Criar album neste evento
                </Botao>
              </form>
            </div>
          </div>
        );
      })}

      {/* Novo evento */}
      <form
        action={criarGaleria}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          padding: 14,
          border: `1px dashed ${COR.linha}`,
          borderRadius: 12,
          background: COR.papel,
        }}
      >
        <input type="hidden" name="cliente_id" value={c.id} />
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: '1 1 240px' }}>
            <span style={ROTULO}>Novo evento</span>
            <input name="nome" required placeholder="Ex: Casamento Ana e Joao" style={ESTILO_INPUT} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={ROTULO}>Max. albums</span>
            <input
              name="max_albuns"
              type="number"
              min={1}
              max={20}
              defaultValue={4}
              style={{ ...ESTILO_INPUT, width: 120 }}
            />
          </label>
        </div>
        <details
          style={{
            border: `1px solid ${COR.linha}`,
            borderRadius: 10,
            padding: '8px 12px',
            background: COR.papelSuave,
          }}
        >
          <summary
            style={{
              cursor: 'pointer',
              fontSize: 12.5,
              fontWeight: 700,
            }}
          >
            Regras deste evento{' '}
            <span style={{ fontWeight: 500, color: COR.apagado }}>
              (opcional — vazio libera tudo)
            </span>
          </summary>
          <div
            style={{
              marginTop: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div>
              <span style={{ ...ROTULO, display: 'block', marginBottom: 6 }}>
                Modelos que o cliente pode escolher
              </span>
              <div
                style={{
                  display: 'grid',
                  gap: 6,
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                }}
              >
                {templates
                  .filter((t) => t.publicado)
                  .map((t) => (
                    <label
                      key={t.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 12.5,
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        name="templates_permitidos"
                        value={t.id}
                        style={{ accentColor: COR.azul }}
                      />
                      {t.nome} — {t.largura_mm / 10}x{t.altura_mm / 10} cm
                    </label>
                  ))}
              </div>
              <span style={{ marginTop: 4, display: 'block', fontSize: 11, color: COR.fraco }}>
                Nenhum marcado = o cliente escolhe entre todos.
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gap: 10,
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              }}
            >
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={ROTULO}>Paginas minimas</span>
                <input
                  name="paginas_min"
                  type="number"
                  min={1}
                  placeholder="do modelo"
                  style={ESTILO_INPUT}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={ROTULO}>Paginas maximas</span>
                <input
                  name="paginas_max"
                  type="number"
                  min={1}
                  placeholder="do modelo"
                  style={ESTILO_INPUT}
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={ROTULO}>Maximo de fotos</span>
                <input
                  name="fotos_max"
                  type="number"
                  min={1}
                  placeholder="sem limite"
                  style={ESTILO_INPUT}
                />
              </label>
            </div>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
              <input
                type="checkbox"
                name="permite_paginas_extras"
                defaultChecked
                style={{ accentColor: COR.azul }}
              />
              O cliente pode adicionar paginas alem do incluido
            </label>
            <span style={{ fontSize: 11, color: COR.fraco }}>
              Para numero exato de paginas, ponha o mesmo valor em minimas e maximas e desmarque a opcao acima.
            </span>
          </div>
        </details>
        <div>
          <Botao variante="primario" type="submit">
            Criar evento
          </Botao>
        </div>
      </form>

      <form action={removerCliente}>
        <input type="hidden" name="cliente_id" value={c.id} />
        <button
          type="submit"
          style={{
            background: 'transparent',
            border: 0,
            color: COR.coral,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0,
          }}
        >
          Remover acesso deste cliente
        </button>
      </form>
    </div>
  );
}

function calcularKpis(clientes: ClienteDaLoja[], total: number) {
  const ativos = clientes.filter((c) => c.user_id).length;
  const hoje = Date.now();
  const seteDias = 7 * 24 * 60 * 60 * 1000;
  const novos = clientes.filter((c) => {
    if (!c.convidado_em) return false;
    return hoje - new Date(c.convidado_em).getTime() <= seteDias;
  }).length;
  const comProjetos = clientes.filter((c) => (c.projetos?.length ?? 0) > 0).length;
  const semPedidos = total - comProjetos;
  return { ativos, novos, comProjetos, semPedidos };
}
