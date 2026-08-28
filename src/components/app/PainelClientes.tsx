'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ClienteDaLoja, Template } from '@/lib/lojista';
import {
  cadastrarCliente,
  criarGaleria,
  criarProjetoParaCliente,
  registrarFotos,
  removerCliente,
} from '@/app/app/actions';

const CARD = 'rounded-[18px] border border-line bg-surface';
const BOTAO_PRIMARIO =
  'flex h-11 items-center justify-center gap-2 rounded-[14px] bg-lente px-4 text-[13.5px] font-bold text-white shadow-card hover:brightness-[1.06] disabled:opacity-50';
const BOTAO =
  'flex h-11 items-center justify-center gap-2 rounded-[14px] border border-line bg-surface px-4 text-[13.5px] font-semibold text-ink hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue disabled:opacity-50';
const CAMPO =
  'h-11 w-full rounded-[14px] border border-line bg-surface px-3.5 text-[14px] text-ink outline-none focus:border-blue';
const ROTULO = 'text-[12.5px] font-semibold text-ink-3';

const STATUS_ROTULO: Record<string, string> = {
  nao_iniciado: 'Não iniciado',
  em_edicao: 'Em edição',
  com_pendencias: 'Com pendências',
  pronto: 'Pronto',
  finalizado: 'Finalizado',
};

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
  const [aberto, setAberto] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState<string | null>(null);
  const [progresso, setProgresso] = useState({ feitas: 0, total: 0 });

  const linkDaLoja = `https://${slugLoja}.${dominio}/entrar`;

  /**
   * Envia as fotos direto do navegador para o Storage, com a sessão do
   * lojista, e só então registra os metadados. Passar os arquivos por uma
   * server action obrigaria a subir tudo duas vezes.
   */
  async function enviarFotos(galeriaId: string, arquivos: FileList) {
    setErro(null);
    setEnviando(galeriaId);
    setProgresso({ feitas: 0, total: arquivos.length });

    const supabase = createClient();
    const registrados: { storage_path: string; largura?: number; altura?: number }[] = [];

    try {
      for (let i = 0; i < arquivos.length; i++) {
        const arq = arquivos[i];
        const nome = `${Date.now()}-${i}-${arq.name.replace(/[^\w.\-]/g, '_')}`;
        const caminho = `${galeriaId}/${nome}`;

        const { error } = await supabase.storage
          .from('galerias')
          .upload(caminho, arq, { contentType: arq.type, upsert: false });

        if (error) throw new Error(`${arq.name}: ${error.message}`);

        registrados.push({ storage_path: caminho });
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

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="m-0 text-[12.5px] font-semibold uppercase tracking-[1.2px] text-muted-2">
            Comercial · Clientes
          </p>
          <h1 className="m-0 mt-1.5 text-[26px] font-extrabold tracking-[-.9px]">
            Clientes da loja
          </h1>
          <p className="m-0 mt-1.5 text-[13.5px] text-muted">
            {total.toLocaleString('pt-BR')} cadastrado{total === 1 ? '' : 's'}
            {total > porPagina && ` · mostrando ${clientes.length}`}
          </p>
        </div>

        <div className={`${CARD} flex items-center gap-3 px-4 py-3`}>
          <div className="min-w-0">
            <p className="m-0 text-[11.5px] font-semibold text-muted-2">Link de acesso da loja</p>
            <p className="m-0 truncate text-[13px] font-semibold text-blue">{linkDaLoja}</p>
          </div>
          <button
            onClick={() => navigator.clipboard?.writeText(linkDaLoja)}
            className="h-9 flex-none rounded-[12px] border border-line px-3 text-[12.5px] font-semibold text-ink-3 hover:bg-blue-soft hover:text-blue"
          >
            Copiar
          </button>
        </div>
      </div>

      {erro && (
        <p className="m-0 rounded-[14px] bg-coral-surface px-4 py-3 text-[13px] font-semibold text-coral">
          {erro}
        </p>
      )}

      {/* ---------------- cadastro ---------------- */}
      <form action={cadastrarCliente} className={`${CARD} p-6`}>
        <p className="m-0 mb-1 text-[15px] font-bold">Cadastrar cliente</p>
        <p className="m-0 mb-4 text-[12.5px] leading-[1.55] text-muted">
          O acesso é por e-mail. A conta se vincula sozinha quando a pessoa entrar pelo link da
          loja com esse mesmo e-mail — você não precisa criar senha para ela.
        </p>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_180px_auto]">
          <label className="flex flex-col gap-1.5">
            <span className={ROTULO}>E-mail</span>
            <input name="email" type="email" required placeholder="cliente@email.com" className={CAMPO} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={ROTULO}>Nome</span>
            <input name="nome" placeholder="Nome do cliente" className={CAMPO} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={ROTULO}>Telefone</span>
            <input name="telefone" placeholder="(11) 90000-0000" className={CAMPO} />
          </label>
          <div className="flex items-end">
            <button type="submit" className={BOTAO_PRIMARIO}>
              Cadastrar
            </button>
          </div>
        </div>
      </form>

      {/* ---------------- busca ---------------- */}
      <form method="get" className={`${CARD} flex flex-wrap items-center gap-3 px-5 py-4`}>
        <input
          name="q"
          defaultValue={busca}
          placeholder="Buscar por nome ou e-mail"
          className={`${CAMPO} min-w-[240px] max-w-[420px] flex-1`}
        />
        <button type="submit" className={BOTAO}>
          Buscar
        </button>
        {busca && (
          <a href="/clientes" className="text-[12.5px] font-semibold text-muted hover:text-blue">
            Limpar
          </a>
        )}
      </form>

      {/* ---------------- lista ---------------- */}
      {clientes.length === 0 ? (
        <div className={`${CARD} px-6 py-14 text-center`}>
          <p className="m-0 text-[15px] font-bold">
            {busca ? 'Nenhum cliente encontrado' : 'Nenhum cliente ainda'}
          </p>
          <p className="m-0 mt-1.5 text-[13.5px] text-muted">
            {busca
              ? `Nada corresponde a "${busca}".`
              : 'Cadastre o primeiro acima e envie o link da loja para ele.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {clientes.map((c) => {
            const galerias = c.galerias ?? [];
            const totalFotos = galerias.reduce(
              (t, g) => t + (g.galeria_fotos?.[0]?.count ?? 0),
              0,
            );
            const expandido = aberto === c.id;

            return (
              <div key={c.id} className={CARD}>
                <div className="flex flex-wrap items-center gap-4 px-6 py-5">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[14px] bg-ink text-[13px] font-bold text-white">
                    {(c.nome ?? c.email ?? '?').slice(0, 2).toUpperCase()}
                  </span>

                  <div className="min-w-[200px] flex-1">
                    <p className="m-0 text-[15px] font-bold">{c.nome ?? c.email}</p>
                    <p className="m-0 mt-0.5 text-[12.5px] text-muted">{c.email}</p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1.5 text-[11.5px] font-bold ${
                      c.user_id
                        ? 'bg-green-surface text-[#059669]'
                        : 'bg-amber-surface text-[#B45309]'
                    }`}
                  >
                    {c.user_id ? 'Acesso ativo' : 'Aguardando 1º acesso'}
                  </span>

                  <div className="text-right">
                    <p className="m-0 text-[12.5px] text-muted-2">Eventos</p>
                    <p className="m-0 text-[15px] font-extrabold">{galerias.length}</p>
                  </div>

                  <div className="text-right">
                    <p className="m-0 text-[12.5px] text-muted-2">Fotos</p>
                    <p className="m-0 text-[15px] font-extrabold">{totalFotos}</p>
                  </div>

                  <div className="text-right">
                    <p className="m-0 text-[12.5px] text-muted-2">Álbuns</p>
                    <p className="m-0 text-[15px] font-extrabold">{c.projetos?.length ?? 0}</p>
                  </div>

                  <button
                    onClick={() => setAberto(expandido ? null : c.id)}
                    className={`${BOTAO} flex-none`}
                  >
                    {expandido ? 'Fechar' : 'Gerenciar'}
                  </button>
                </div>

                {expandido && (
                  <div className="flex flex-col gap-5 border-t border-line-2 px-6 py-5">
                    {/* ---- um bloco por evento ---- */}
                    {galerias.map((g) => {
                      const fotos = g.galeria_fotos?.[0]?.count ?? 0;
                      const albuns = (c.projetos ?? []).filter((p) => p.galeria_id === g.id);

                      return (
                        <div
                          key={g.id}
                          className="grid gap-5 rounded-[14px] border border-[#EEF1F7] bg-surface-2 p-4 lg:grid-cols-2"
                        >
                          <div>
                            <p className="m-0 text-[13.5px] font-bold">{g.nome}</p>
                            <p className="m-0 mt-0.5 text-[12.5px] text-muted">
                              {fotos} foto{fotos === 1 ? '' : 's'} · {albuns.length} álbum
                              {albuns.length === 1 ? '' : 'ns'}
                            </p>
                            <p className="m-0 mt-1 text-[11.5px] text-muted-2">
                              {[
                                g.templates_permitidos?.length
                                  ? `${g.templates_permitidos.length} modelo(s) liberado(s)`
                                  : 'todos os modelos',
                                g.paginas_min || g.paginas_max
                                  ? `${g.paginas_min ?? '?'}–${g.paginas_max ?? '?'} páginas`
                                  : null,
                                g.fotos_max ? `até ${g.fotos_max} fotos` : null,
                                g.permite_paginas_extras ? null : 'sem páginas extras',
                              ]
                                .filter(Boolean)
                                .join(' · ')}
                            </p>
                            <label className={`${BOTAO} mt-3 cursor-pointer`}>
                              {enviando === g.id
                                ? `Enviando ${progresso.feitas}/${progresso.total}…`
                                : 'Enviar fotos deste evento'}
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                disabled={enviando !== null}
                                onChange={(e) =>
                                  e.target.files?.length && enviarFotos(g.id, e.target.files)
                                }
                              />
                            </label>
                          </div>

                          <div>
                            {albuns.length > 0 && (
                              <ul className="m-0 mb-3 flex list-none flex-col gap-2 p-0">
                                {albuns.map((p) => (
                                  <li
                                    key={p.id}
                                    className="flex items-center justify-between gap-3 rounded-[12px] border border-line bg-surface px-3 py-2"
                                  >
                                    <span className="min-w-0 truncate text-[13px] font-semibold">
                                      {p.titulo}
                                    </span>
                                    <span className="flex-none text-[12px] text-muted">
                                      {STATUS_ROTULO[p.status] ?? p.status} · {p.progresso}%
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            <form action={criarProjetoParaCliente} className="flex flex-col gap-2.5">
                              <input type="hidden" name="cliente_id" value={c.id} />
                              <input type="hidden" name="galeria_id" value={g.id} />
                              <select name="template_id" required className={CAMPO}>
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
                                      {t.nome} — {t.largura_mm / 10}×{t.altura_mm / 10} cm
                                      {t.lojista_id ? '' : ' (padrão)'}
                                    </option>
                                  ))}
                              </select>
                              <input
                                name="titulo"
                                placeholder="Nome do álbum (opcional)"
                                className={CAMPO}
                              />
                              <button type="submit" className={BOTAO_PRIMARIO}>
                                Criar álbum neste evento
                              </button>
                            </form>
                          </div>
                        </div>
                      );
                    })}

                    {/* ---- novo evento, com as regras do que o cliente pode escolher ---- */}
                    <form
                      action={criarGaleria}
                      className="flex flex-col gap-4 rounded-[14px] border border-dashed border-line p-4"
                    >
                      <input type="hidden" name="cliente_id" value={c.id} />

                      <div className="flex flex-wrap items-end gap-3">
                        <label className="flex min-w-[240px] flex-1 flex-col gap-1.5">
                          <span className={ROTULO}>Novo evento</span>
                          <input
                            name="nome"
                            required
                            placeholder="Ex: Casamento Ana e João"
                            className={CAMPO}
                          />
                        </label>
                        <label className="flex flex-col gap-1.5">
                          <span className={ROTULO}>Máx. álbuns</span>
                          <input
                            name="max_albuns"
                            type="number"
                            min={1}
                            max={20}
                            defaultValue={4}
                            className={`${CAMPO} w-28`}
                          />
                        </label>
                      </div>

                      <details className="rounded-[12px] border border-line bg-surface-2 px-4 py-3">
                        <summary className="cursor-pointer text-[13px] font-bold">
                          Regras deste evento
                          <span className="ml-2 font-medium text-muted">
                            (opcional — vazio libera tudo)
                          </span>
                        </summary>

                        <div className="mt-4 flex flex-col gap-4">
                          <div>
                            <span className={`${ROTULO} mb-2 block`}>
                              Modelos que o cliente pode escolher
                            </span>
                            <div className="grid gap-1.5 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
                              {templates
                                .filter((t) => t.publicado)
                                .map((t) => (
                                  <label
                                    key={t.id}
                                    className="flex cursor-pointer items-center gap-2 text-[12.5px] text-ink-3"
                                  >
                                    <input
                                      type="checkbox"
                                      name="templates_permitidos"
                                      value={t.id}
                                      className="h-4 w-4 accent-[#2563EB]"
                                    />
                                    {t.nome} — {t.largura_mm / 10}×{t.altura_mm / 10} cm
                                  </label>
                                ))}
                            </div>
                            <span className="mt-1.5 block text-[11.5px] text-muted-2">
                              Nenhum marcado = o cliente escolhe entre todos.
                            </span>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-3">
                            <label className="flex flex-col gap-1.5">
                              <span className={ROTULO}>Páginas mínimas</span>
                              <input
                                name="paginas_min"
                                type="number"
                                min={1}
                                placeholder="do modelo"
                                className={CAMPO}
                              />
                            </label>
                            <label className="flex flex-col gap-1.5">
                              <span className={ROTULO}>Páginas máximas</span>
                              <input
                                name="paginas_max"
                                type="number"
                                min={1}
                                placeholder="do modelo"
                                className={CAMPO}
                              />
                            </label>
                            <label className="flex flex-col gap-1.5">
                              <span className={ROTULO}>Máximo de fotos</span>
                              <input
                                name="fotos_max"
                                type="number"
                                min={1}
                                placeholder="sem limite"
                                className={CAMPO}
                              />
                            </label>
                          </div>

                          <label className="flex cursor-pointer items-center gap-2.5">
                            <input
                              type="checkbox"
                              name="permite_paginas_extras"
                              defaultChecked
                              className="h-4 w-4 accent-[#2563EB]"
                            />
                            <span className="text-[13px] text-ink-3">
                              O cliente pode adicionar páginas além do incluído
                            </span>
                          </label>
                          <span className="text-[11.5px] leading-[1.55] text-muted-2">
                            Para número exato de páginas, ponha o mesmo valor em mínimas e máximas
                            e desmarque a opção acima.
                          </span>
                        </div>
                      </details>

                      <button type="submit" className={`${BOTAO_PRIMARIO} self-start`}>
                        Criar evento
                      </button>
                    </form>

                    <div className="lg:col-span-2">
                      <form action={removerCliente}>
                        <input type="hidden" name="cliente_id" value={c.id} />
                        <button
                          type="submit"
                          className="text-[12.5px] font-semibold text-[#E11D48] hover:underline"
                        >
                          Remover acesso deste cliente
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {total > porPagina && (
            <div className="flex items-center justify-between gap-4 px-1 py-2">
              <a
                href={`/clientes?q=${encodeURIComponent(busca)}&p=${pagina - 1}`}
                aria-disabled={pagina === 0}
                className={`${BOTAO} ${pagina === 0 ? 'pointer-events-none opacity-40' : ''}`}
              >
                Anteriores
              </a>
              <span className="text-[12.5px] text-muted">
                Página {pagina + 1} de {Math.ceil(total / porPagina)}
              </span>
              <a
                href={`/clientes?q=${encodeURIComponent(busca)}&p=${pagina + 1}`}
                aria-disabled={(pagina + 1) * porPagina >= total}
                className={`${BOTAO} ${
                  (pagina + 1) * porPagina >= total ? 'pointer-events-none opacity-40' : ''
                }`}
              >
                Próximos
              </a>
            </div>
          )}
        </div>
      )}
    </>
  );
}
