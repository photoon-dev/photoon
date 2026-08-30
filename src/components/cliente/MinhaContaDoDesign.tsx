'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import MinhaContaDesign, { CSS_PSEUDO } from '@/components/design/MinhaContaDesign';
import MenuCliente from '@/components/cliente/MenuCliente';
import { useCascaCliente, type LojaDaCasca } from '@/components/cliente/useCascaCliente';
import { createClient } from '@/lib/supabase/client';
import { salvarAvatar, salvarDadosConta, salvarDocumentos, salvarEndereco } from '@/app/actions-perfil';
import type { ContaDoCliente, PerfilCliente } from '@/lib/cliente';
import type { Notificacao } from '@/lib/data';

/**
 * "Minha conta" com o layout do design.
 *
 * A versão anterior era escrita à mão e tinha três campos. Esta é a
 * `Cliente Minha conta.dc.html` transliterada, com a lógica da casca (trilho,
 * menu, gaveta de avisos, abas) portada do `Component extends DCLogic` do
 * próprio arquivo — mesmos nomes, mesmas strings de estilo.
 *
 * O que mudou em relação ao protótipo é só o dado, e duas honestidades:
 *
 * - o segundo fator é só o aplicativo autenticador. SMS exige um provedor
 *   pago; e-mail como segundo fator o Supabase não faz nativamente. Mostrar
 *   três interruptores onde um funciona seria mentir para quem cuida da
 *   própria segurança.
 * - "Acessos recentes" vem de `auth.sessions` pela função `minhas_sessoes`;
 *   sem a migração 0013 a lista chega vazia e o texto explica.
 */

const DATA_BR = (v: string | null) =>
  v ? new Date(v + 'T12:00:00').toLocaleDateString('pt-BR') : '';

const moeda = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const SELO_PEDIDO: Record<string, [string, string, string]> = {
  rascunho: ['Rascunho', '#EEF1F7', '#6B7A90'],
  aguardando_pagamento: ['Aguardando pagamento', '#FEF3E2', '#B45309'],
  pago: ['Pago', '#E6F8F1', '#059669'],
  em_producao: ['Em produção', '#EAF0FF', '#2563EB'],
  pronto: ['Pronto', '#E4F8FC', '#0E7490'],
  enviado: ['Enviado', '#F1F5FD', '#4F46E5'],
  entregue: ['Entregue', '#E6F8F1', '#047857'],
  cancelado: ['Cancelado', '#FFF1F3', '#E11D48'],
};

/** "Chrome · Windows" a partir do user agent cru. */
function aparelho(agente: string | null): string {
  const a = agente ?? '';
  const nav = /Edg/.test(a) ? 'Edge' : /Chrome/.test(a) ? 'Chrome'
    : /Safari/.test(a) ? 'Safari' : /Firefox/.test(a) ? 'Firefox' : 'Navegador';
  const so = /iPhone|iPad/.test(a) ? 'iPhone' : /Android/.test(a) ? 'Android'
    : /Windows/.test(a) ? 'Windows' : /Mac OS/.test(a) ? 'Mac' : /Linux/.test(a) ? 'Linux' : 'aparelho';
  return `${nav} · ${so}`;
}

const quando = (iso: string) => {
  const d = new Date(iso);
  const min = Math.round((Date.now() - d.getTime()) / 60000);
  if (min < 2) return 'agora';
  if (min < 60) return `há ${min} min`;
  if (min < 60 * 24) return `há ${Math.round(min / 60)} h`;
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }) +
    `, ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
};

export default function MinhaContaDoDesign({
  perfil,
  conta,
  loja,
  notificacoes,
}: {
  perfil: PerfilCliente;
  conta: ContaDoCliente;
  loja: LojaDaCasca;
  notificacoes: Notificacao[];
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [ocupado, iniciar] = useTransition();

  const [aba, setAba] = useState<'dados' | 'endereco' | 'seguranca' | 'compras'>('dados');

  // ---- estado desta tela
  const [avatar, setAvatar] = useState(perfil.avatar_url);
  const [recado, setRecado] = useState<string | null>(null);
  const [fatores, setFatores] = useState<{ id: string; status: string }[]>([]);
  const [totp, setTotp] = useState<{ id: string; qr: string; segredo: string } | null>(null);
  const [codigo, setCodigo] = useState('');

  const temTotp = fatores.some((f) => f.status === 'verified');

  useEffect(() => {
    supabase.auth.mfa.listFactors().then(({ data }) => {
      setFatores((data?.totp ?? []).map((f) => ({ id: f.id, status: f.status })));
    });
  }, [supabase]);

  const avisar = (texto: string) => {
    setRecado(texto);
    window.setTimeout(() => setRecado((r) => (r === texto ? null : r)), 6000);
  };

  const enviar = (acao: () => Promise<void>) =>
    iniciar(async () => {
      try {
        await acao();
        router.refresh();
      } catch (e) {
        avisar(e instanceof Error ? e.message : 'Não deu para salvar.');
      }
    });

  const daForma = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    return new FormData(e.currentTarget);
  };

  // ------------------------------------------------------------------ avatar
  const escolherFoto = () => {
    const campo = document.createElement('input');
    campo.type = 'file';
    campo.accept = 'image/*';
    campo.onchange = async () => {
      const f = campo.files?.[0];
      if (!f) return;
      const { data: sessao } = await supabase.auth.getUser();
      if (!sessao.user) return avisar('Sua sessão expirou. Entre de novo.');
      const caminho = `${sessao.user.id}/perfil-${Date.now()}.${(f.name.split('.').pop() ?? 'jpg').toLowerCase()}`;
      const { error } = await supabase.storage.from('avatares').upload(caminho, f, { upsert: true });
      if (error) return avisar(error.message);
      const { data } = supabase.storage.from('avatares').getPublicUrl(caminho);
      setAvatar(data.publicUrl);
      enviar(() => salvarAvatar(perfil.id, data.publicUrl));
    };
    campo.click();
  };

  // ------------------------------------------------------------------ senha
  const trocarSenha = (e: React.FormEvent<HTMLFormElement>) => {
    const fd = daForma(e);
    const nova = String(fd.get('nova') ?? '');
    if (nova.length < 8) return avisar('A nova senha precisa de pelo menos 8 caracteres.');
    if (nova !== String(fd.get('repetir') ?? '')) return avisar('As duas senhas não são iguais.');

    // A senha atual é conferida entrando de novo com ela: o Supabase não pede
    // a antiga no update, e sem essa checagem uma sessão esquecida aberta num
    // computador público trocaria a senha da pessoa.
    iniciar(async () => {
      const { error: confere } = await supabase.auth.signInWithPassword({
        email: perfil.email,
        password: String(fd.get('atual') ?? ''),
      });
      if (confere) return avisar('A senha atual não confere.');

      const { error } = await supabase.auth.updateUser({ password: nova });
      if (error) return avisar(error.message);
      await supabase.auth.signOut({ scope: 'others' });
      avisar('Senha trocada. As outras sessões foram encerradas.');
      router.refresh();
    });
  };

  // ------------------------------------------------------------------ 2 fatores
  const comecarTotp = () =>
    iniciar(async () => {
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
      if (error) return avisar(error.message);
      setTotp({ id: data.id, qr: data.totp.qr_code, segredo: data.totp.secret });
      setCodigo('');
    });

  const confirmarTotp = () =>
    iniciar(async () => {
      if (!totp) return;
      const { data: desafio, error: e1 } = await supabase.auth.mfa.challenge({ factorId: totp.id });
      if (e1) return avisar(e1.message);
      const { error: e2 } = await supabase.auth.mfa.verify({
        factorId: totp.id,
        challengeId: desafio.id,
        code: codigo.replace(/\D/g, ''),
      });
      if (e2) return avisar('Código não confere. Tente o próximo que o app mostrar.');
      setTotp(null);
      setFatores((f) => [...f, { id: totp.id, status: 'verified' }]);
      avisar('Verificação em duas etapas ativada.');
    });

  const desligarTotp = () =>
    iniciar(async () => {
      for (const f of fatores) await supabase.auth.mfa.unenroll({ factorId: f.id });
      setFatores([]);
      avisar('Verificação em duas etapas desligada.');
    });

  const cancelarTotp = () =>
    iniciar(async () => {
      if (totp) await supabase.auth.mfa.unenroll({ factorId: totp.id });
      setTotp(null);
    });

  // ------------------------------------------------------------------ sessões
  const encerrar = (id: string) =>
    iniciar(async () => {
      const { error } = await supabase.rpc('encerrar_sessao', { p_sessao: id });
      if (error) return avisar('Não foi possível encerrar esse acesso.');
      router.refresh();
    });

  const rotulo = (t: string) => `height:44px;padding:0 18px;border:0;border-radius:11px;` +
    `background:${aba === t ? '#F1F5FD' : 'transparent'};color:${aba === t ? '#2563EB' : '#46536A'};` +
    `font-family:inherit;font-size:13.5px;font-weight:${aba === t ? 700 : 600};cursor:pointer;` +
    'white-space:nowrap;transition:background .15s,color .15s';

  const emProducao = conta.compras.filter((c) => ['pago', 'em_producao', 'pronto', 'enviado'].includes(c.estado)).length;
  const gasto = conta.compras
    .filter((c) => !['rascunho', 'cancelado', 'aguardando_pagamento'].includes(c.estado))
    .reduce((t, c) => t + c.total, 0);

  const nome = perfil.nome ?? perfil.email;

  const casca = useCascaCliente({
    dono: { nome, email: perfil.email, sub: conta.turma ?? loja.nome },
    loja,
    notificacoes,
  });

  return (
    <div className="om-cliente">
      <style dangerouslySetInnerHTML={{ __html: CSS_PSEUDO }} />
      <MinhaContaDesign
        v={{
          ...casca,

          // ---------------------------------------------------------- abas
          tabs: [
            ['dados', 'Meus dados'],
            ['endereco', 'Endereço'],
            ['seguranca', 'Segurança'],
            ['compras', 'Minhas compras'],
          ].map(([id, label]) => ({
            label,
            style: rotulo(id),
            pick: () => setAba(id as typeof aba),
          })),
          isDados: aba === 'dados',
          isEndereco: aba === 'endereco',
          isSeguranca: aba === 'seguranca',
          isCompras: aba === 'compras',

          // ---------------------------------------------------------- topo
          avatarSrc: avatar ?? '',
          avatarImg: avatar
            ? 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit'
            : 'display:none',
          nome,
          contato: [perfil.email, perfil.telefone].filter(Boolean).join(' · '),
          selo1: conta.turma ?? 'Sem turma informada',
          selo1Estilo:
            'padding:6px 12px;border-radius:999px;background:#F1F5FD;color:#2563EB;font-size:12px;font-weight:600',
          selo2: conta.documentos?.cpf ? 'Cadastro completo' : 'Cadastro incompleto',
          selo2Estilo:
            'padding:6px 12px;border-radius:999px;font-size:12px;font-weight:600;' +
            (conta.documentos?.cpf ? 'background:#E6F8F1;color:#059669' : 'background:#FEF3E2;color:#B45309'),
          selo3: `Cliente desde ${new Date(perfil.desde).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}`,
          notaFoto: recado ?? `A foto aparece só para você e para a ${loja.nome}.`,
          rotuloFoto: ocupado ? 'Enviando…' : avatar ? 'Trocar foto' : 'Enviar nova foto',
          enviarFoto: escolherFoto,

          // ---------------------------------------------------------- dados
          soLeitura: true,
          dados: {
            nome: perfil.nome ?? '',
            apelido: conta.apelido ?? '',
            email: perfil.email,
            telefone: perfil.telefone ?? '',
            nascimento: DATA_BR(conta.nascimento),
            turma: conta.turma ?? '',
          },
          salvarDados: (e: React.FormEvent<HTMLFormElement>) => {
            const fd = daForma(e);
            enviar(() => salvarDadosConta(perfil.id, fd));
          },

          documentos: {
            cpf: conta.documentos?.cpf ?? '',
            rg: conta.documentos?.rg ?? '',
            orgaoEmissor: conta.documentos?.orgao_emissor ?? '',
            nomeMae: conta.documentos?.nome_mae ?? '',
          },
          notaDocumentos: `Os documentos ficam visíveis apenas para o setor financeiro da ${loja.nome}.`,
          salvarDocumentos: (e: React.FormEvent<HTMLFormElement>) => {
            const fd = daForma(e);
            enviar(() => salvarDocumentos(perfil.id, fd));
          },

          endereco: {
            cep: conta.endereco.cep ?? '',
            rua: conta.endereco.rua ?? '',
            numero: conta.endereco.numero ?? '',
            complemento: conta.endereco.complemento ?? '',
            bairro: conta.endereco.bairro ?? '',
            cidade: conta.endereco.cidade ?? '',
            uf: conta.endereco.uf ?? '',
            quemRecebe: conta.endereco.quem_recebe ?? '',
          },
          notaRetirada: `Sem endereço, a retirada é feita no estúdio da ${loja.nome}` +
            (loja.telefone ? `, com aviso no ${loja.telefone}.` : '.'),
          salvarEndereco: (e: React.FormEvent<HTMLFormElement>) => {
            const fd = daForma(e);
            enviar(() => salvarEndereco(perfil.id, fd));
          },

          // ---------------------------------------------------------- segurança
          salvarSenha: trocarSenha,
          avisoSenha: recado ?? 'Ao salvar, você sai das outras sessões automaticamente.',

          twoFactor: [
            {
              title: temTotp ? 'Aplicativo autenticador · ativo' : 'Aplicativo autenticador',
              sub: temTotp
                ? 'Ao entrar, o app pede um código de 6 dígitos.'
                : 'Código de 6 dígitos gerado no seu celular, sem depender de operadora.',
              rowStyle:
                `display:flex;align-items:center;gap:14px;padding:15px 16px;border-radius:14px;` +
                `border:1px solid ${temTotp ? '#D6E2FC' : '#EEF1F7'};background:${temTotp ? '#F7FAFF' : '#F8FAFE'}`,
              iconStyle:
                `width:38px;height:38px;border-radius:12px;background:${temTotp ? '#EAF0FF' : '#F1F5FD'};` +
                `color:${temTotp ? '#2563EB' : '#9AA7BC'};display:flex;align-items:center;justify-content:center;flex:0 0 auto`,
              switchStyle:
                `position:relative;width:50px;height:28px;border-radius:999px;border:0;` +
                `background:${temTotp ? '#2563EB' : '#DCE3EF'};cursor:pointer;flex:0 0 auto;transition:background .18s`,
              knobStyle:
                `position:absolute;top:3px;left:${temTotp ? 25 : 3}px;width:22px;height:22px;border-radius:999px;` +
                `background:#FFFFFF;box-shadow:0 2px 6px rgba(11,18,32,.2);transition:left .18s cubic-bezier(.2,.8,.2,1)`,
              toggle: () => (temTotp ? desligarTotp() : comecarTotp()),
            },
          ],
          totpAberto: Boolean(totp),
          totpQr: totp?.qr ?? '',
          totpSegredo: totp ? `Chave manual: ${totp.segredo}` : '',
          totpCodigo: codigo,
          setTotpCodigo: (e: React.ChangeEvent<HTMLInputElement>) => setCodigo(e.target.value),
          confirmarTotp,
          cancelarTotp,

          sessoes: conta.sessoes.map((s) => ({
            aparelho: aparelho(s.agente) + (s.esta_sessao ? '' : ''),
            onde: `${s.ip ?? 'origem desconhecida'} · ${quando(s.atualizada_em)}`,
            atualStyle: s.esta_sessao
              ? 'padding:6px 11px;border-radius:999px;background:#E6F8F1;color:#059669;font-size:11.5px;font-weight:700;white-space:nowrap'
              : 'display:none',
            btnStyle: s.esta_sessao
              ? 'display:none'
              : 'height:34px;padding:0 13px;border:1px solid #E6EAF2;border-radius:11px;background:#FFFFFF;color:#46536A;font-family:inherit;font-size:12.5px;font-weight:600;cursor:pointer;white-space:nowrap',
            encerrar: () => encerrar(s.id),
          })),
          sessoesVazio: conta.sessoes.length ? 'display:none' : 'margin:0;padding:16px;font-size:13px;color:#9AA7BC',
          sessoesTexto: conta.faltaMigracao
            ? 'A lista de acessos depende da migração 0013, ainda não aplicada.'
            : 'Nenhum acesso registrado além deste.',

          // ---------------------------------------------------------- compras
          statPedidos: String(conta.compras.length),
          statProducao: String(emProducao),
          statTotal: moeda(gasto),
          compras: conta.compras.map((c) => {
            const [rot, bg, cor] = SELO_PEDIDO[c.estado] ?? SELO_PEDIDO.rascunho;
            return {
              numero: `#${c.numero}`,
              data: new Date(c.criado_em).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }),
              descricao: c.descricao,
              valor: moeda(c.total),
              estado: rot,
              selo: `padding:6px 12px;border-radius:999px;background:${bg};color:${cor};font-size:12px;font-weight:600;width:max-content`,
              href: '/meus-projetos',
            };
          }),
          comprasVazio: conta.compras.length ? 'display:none' : 'margin:0;padding:28px;text-align:center;font-size:13.5px;color:#9AA7BC',
          comprasTextoVazio: `Você ainda não fez nenhum pedido com a ${loja.nome}.`,
        }}
      />
      <MenuCliente />
    </div>
  );
}
