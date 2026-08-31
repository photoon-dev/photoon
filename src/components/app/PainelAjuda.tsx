import Link from 'next/link';

/**
 * Central de ajuda do lojista.
 *
 * Substitui o módulo Suporte, que era um sistema completo de tickets — o
 * briefing pede um botão simples na topbar, não uma central de chamados.
 *
 * Três blocos, todos com dado real: como falar com a Photoon (vem do
 * ambiente), os canais que a própria loja publica para os clientes dela (vêm
 * do banco) e o que os clientes já perguntaram. Nada aqui é preenchido com
 * exemplo: campo sem valor diz que está vazio e onde se preenche.
 */

const CARTAO: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid #E6EAF2',
  borderRadius: 20,
  padding: '22px 24px',
  boxShadow: '0 2px 8px rgba(11,18,32,.03)',
};

const TITULO: React.CSSProperties = {
  margin: '0 0 4px',
  fontSize: 16,
  fontWeight: 700,
  color: '#0B1220',
};

const LEGENDA: React.CSSProperties = {
  margin: '0 0 18px',
  fontSize: 13,
  color: '#6B7A90',
};

const VAZIO: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: '#9AA7BC',
};

function Linha({ rotulo, valor, href }: { rotulo: string; valor: string | null; href?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 12,
        flexWrap: 'wrap',
        padding: '11px 0',
        borderBottom: '1px solid #F1F4FA',
      }}
    >
      <span style={{ minWidth: 130, fontSize: 12.5, color: '#6B7A90' }}>{rotulo}</span>
      {valor ? (
        href ? (
          <a href={href} style={{ fontSize: 14, fontWeight: 600, color: '#2563EB' }}>
            {valor}
          </a>
        ) : (
          <span style={{ fontSize: 14, fontWeight: 600 }}>{valor}</span>
        )
      ) : (
        <span style={{ fontSize: 13.5, color: '#9AA7BC' }}>não preenchido</span>
      )}
    </div>
  );
}

export type CanaisDaLoja = {
  telefoneSuporte: string | null;
  emailSuporte: string | null;
  urlContato: string | null;
  urlPolitica: string | null;
};

export default function PainelAjuda({
  canais,
  chamadosPorEstado,
  suporte,
}: {
  canais: CanaisDaLoja;
  /** Quantos chamados a loja tem em cada estado. Vem do banco. */
  chamadosPorEstado: Record<string, number>;
  /** Contatos da própria Photoon, definidos no ambiente. */
  suporte: { email: string | null; whatsapp: string | null; docs: string | null };
}) {
  const abertos = chamadosPorEstado.aberto ?? 0;
  const respondidos = chamadosPorEstado.respondido ?? 0;
  const total = Object.values(chamadosPorEstado).reduce((t, n) => t + n, 0);
  const temSuporte = suporte.email || suporte.whatsapp || suporte.docs;

  return (
    <div style={{ padding: '26px 30px 60px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <p
          style={{
            margin: '0 0 8px',
            fontSize: 12,
            letterSpacing: '1.6px',
            textTransform: 'uppercase',
            color: '#9AA7BC',
            fontWeight: 700,
          }}
        >
          Ajuda
        </p>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: '-0.6px' }}>
          Como podemos ajudar
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: 14.5, color: '#6B7A90', maxWidth: '62ch' }}>
          Onde falar com a Photoon, o que a sua loja publica para os clientes e o que
          eles já perguntaram.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20,
          alignItems: 'start',
        }}
      >
        <section style={CARTAO}>
          <h2 style={TITULO}>Falar com a Photoon</h2>
          <p style={LEGENDA}>Suporte da plataforma, para quem administra a loja.</p>
          {temSuporte ? (
            <>
              <Linha
                rotulo="E-mail"
                valor={suporte.email}
                href={suporte.email ? `mailto:${suporte.email}` : undefined}
              />
              <Linha
                rotulo="WhatsApp"
                valor={suporte.whatsapp}
                href={suporte.whatsapp ? `https://wa.me/${suporte.whatsapp.replace(/\D/g, '')}` : undefined}
              />
              <Linha rotulo="Documentação" valor={suporte.docs} href={suporte.docs ?? undefined} />
            </>
          ) : (
            <p style={VAZIO}>
              Nenhum canal de suporte configurado nesta instalação. Defina
              {' '}<code>NEXT_PUBLIC_SUPORTE_EMAIL</code>,{' '}
              <code>NEXT_PUBLIC_SUPORTE_WHATSAPP</code> ou{' '}
              <code>NEXT_PUBLIC_DOCS_URL</code> no ambiente.
            </p>
          )}
        </section>

        <section style={CARTAO}>
          <h2 style={TITULO}>Os canais da sua loja</h2>
          <p style={LEGENDA}>É o que os seus clientes veem na área deles.</p>
          <Linha rotulo="Telefone" valor={canais.telefoneSuporte} />
          <Linha rotulo="E-mail" valor={canais.emailSuporte} />
          <Linha rotulo="Página de contato" valor={canais.urlContato} href={canais.urlContato ?? undefined} />
          <Linha rotulo="Política" valor={canais.urlPolitica} href={canais.urlPolitica ?? undefined} />
          <Link
            href="/configuracoes"
            style={{
              display: 'inline-block',
              marginTop: 16,
              padding: '9px 16px',
              borderRadius: 12,
              border: '1px solid #E6EAF2',
              fontSize: 13.5,
              fontWeight: 600,
              color: '#2563EB',
            }}
          >
            Editar em Configurações
          </Link>
        </section>

        <section style={CARTAO}>
          <h2 style={TITULO}>O que seus clientes perguntaram</h2>
          <p style={LEGENDA}>Mensagens abertas pela área do cliente.</p>
          {total ? (
            <>
              <Linha rotulo="Aguardando resposta" valor={String(abertos)} />
              <Linha rotulo="Respondidos" valor={String(respondidos)} />
              <Linha rotulo="Total" valor={String(total)} />
            </>
          ) : (
            <p style={VAZIO}>Nenhum cliente abriu uma mensagem ainda.</p>
          )}
        </section>
      </div>
    </div>
  );
}
