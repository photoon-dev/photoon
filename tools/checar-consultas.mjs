/**
 * Confere que as consultas do painel casam com o schema real.
 *
 * A RLS esconde as LINHAS para a chave anônima, mas o PostgREST valida a
 * consulta antes disso: coluna inexistente, junção errada ou filtro inválido
 * voltam 400 com o motivo. É o que permite testar a forma das consultas sem
 * uma sessão autenticada.
 *
 *   node tools/checar-consultas.mjs
 */
import fs from 'node:fs';

const env = Object.fromEntries(
  fs.readFileSync('.env', 'utf8').split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]),
);
const U = env.NEXT_PUBLIC_SUPABASE_URL;
const K = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const h = { apikey: K, Authorization: `Bearer ${K}` };

/** [rótulo, caminho REST] — os mesmos selects de src/lib/projetos.ts. */
const CONSULTAS = [
  ['listarProjetos',
    'projetos?select=id,codigo,titulo,status,produto_nome,produto_tamanho,total_paginas,' +
    'fotos_enviadas,fotos_usadas,capa_url,bytes_total,criado_em,atualizado_em,arquivado_em,' +
    'clientes(id,nome,email)&arquivado_em=is.null&order=atualizado_em.desc&limit=1'],
  ['listarProjetos com junção interna',
    'projetos?select=id,clientes!inner(id,nome,email)&limit=1'],
  ['getProjeto',
    'projetos?select=id,codigo,titulo,status,produto_nome,produto_tamanho,formato_aberto,' +
    'formato_fechado,largura_mm,altura_mm,total_paginas,fotos_enviadas,fotos_usadas,capa_url,' +
    'capa_tipo,dorso_mm,bytes_total,progresso,avisos,criado_em,atualizado_em,finalizado_em,' +
    'fechado_em,arquivado_em,clientes(id,nome,email),galerias(id,nome),filiais(id,nome)&limit=1'],
  ['pedidoDosProjetos',
    'pedido_itens?select=projeto_id,pedidos(id,codigo,numero,estado)&limit=1'],
  ['renderDosProjetos',
    'render_jobs?select=projeto_id,estado,criado_em&order=criado_em.desc&limit=1'],
  ['arquivos do projeto',
    'projeto_arquivos?select=id,tipo,nome,caminho,bucket,mime,bytes,checksum,versao,estado,criado_em' +
    '&removido_em=is.null&limit=1'],
  ['versões do projeto',
    'projeto_versoes?select=id,versao,motivo,bytes,criado_em&order=versao.desc&limit=1'],
  ['validações do projeto',
    'projeto_validacoes?select=id,regra,severidade,pagina,elemento,descricao,recomendacao&limit=1'],
  ['eventos do projeto',
    'projeto_eventos?select=id,descricao,autor,criado_em&order=criado_em.desc&limit=1'],
  ['jobs do projeto',
    'render_jobs?select=id,estado,etapa,progresso,tentativa,erro_mensagem,criado_em,concluido_em&limit=1'],
  ['opções de filtro',
    'projetos?select=produto_nome,clientes(id,nome)&arquivado_em=is.null&limit=1'],
  ['filiais ativas', 'filiais?select=id,nome&ativo=eq.true&limit=1'],
  ['cards: status', 'projetos?select=id&status=in.(nao_iniciado,em_edicao)&arquivado_em=is.null&limit=1'],
  ['cards: bytes', 'projetos?select=id,bytes_total&arquivado_em=is.null&limit=1'],
  ['produção com histórico', 'producao?select=id,etapa,entrou_na_etapa_em,prioridade,filial_id&limit=1'],
  ['histórico de produção', 'producao_historico?select=id,de_etapa,para_etapa,responsavel,criado_em&limit=1'],
  ['expedição ampliada',
    'expedicao?select=id,estado,modalidade,volumes,peso_kg,largura_cm,altura_cm,profundidade_cm,' +
    'coleta_em,previsao_em,sla_dias,responsavel,etiqueta_url&limit=1'],
];

let falhas = 0;
for (const [rotulo, caminho] of CONSULTAS) {
  const r = await fetch(`${U}/rest/v1/${caminho}`, { headers: h });
  if (r.ok) {
    console.log(`ok   ${rotulo}`);
  } else {
    falhas++;
    const b = await r.json().catch(() => ({}));
    console.log(`NAO  ${rotulo} — HTTP ${r.status} ${b.code ?? ''} ${b.message ?? ''}`);
  }
}
console.log(falhas ? `\n${falhas} consulta(s) nao casam com o schema` : '\ntodas as consultas casam com o schema real');
process.exit(falhas ? 1 : 0);
