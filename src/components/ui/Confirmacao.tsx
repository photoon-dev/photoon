'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Botao from '@/components/ui/Botao';
import { COR } from '@/components/ui/tokens';

/**
 * Confirmação de ação destrutiva.
 *
 * Regra 5 do briefing: toda ação destrutiva pede confirmação. Duas coisas que
 * um `confirm()` do navegador não faz e que aqui são obrigatórias:
 *
 *   - dizer **o que exatamente** vai acontecer, com o nome do registro;
 *   - `digitar`, quando o estrago não se desfaz — a pessoa escreve o nome do
 *     que vai apagar. É o que separa "cliquei sem ler" de "eu quis".
 *
 * `motivo` cobre a exigência de auditoria: ajuste de saldo e cancelamento
 * precisam registrar por quê, não só quem e quando.
 */
export default function Confirmacao({
  aberto,
  aoFechar,
  aoConfirmar,
  titulo,
  descricao,
  rotuloConfirmar = 'Confirmar',
  digitar,
  motivo = false,
}: {
  aberto: boolean;
  aoFechar: () => void;
  aoConfirmar: (motivo?: string) => void | Promise<void>;
  titulo: string;
  descricao: string;
  rotuloConfirmar?: string;
  /** Texto que a pessoa precisa digitar para liberar o botão. */
  digitar?: string;
  /** Exige um motivo, que vai para a auditoria. */
  motivo?: boolean;
}) {
  const [texto, setTexto] = useState('');
  const [porque, setPorque] = useState('');
  const [ocupado, setOcupado] = useState(false);

  const liberado = (!digitar || texto.trim() === digitar) && (!motivo || porque.trim().length >= 3);

  const fechar = () => {
    setTexto('');
    setPorque('');
    aoFechar();
  };

  const campo: React.CSSProperties = {
    width: '100%',
    height: 42,
    padding: '0 14px',
    borderRadius: 12,
    border: `1px solid ${COR.linha}`,
    fontFamily: 'inherit',
    fontSize: 14,
    color: COR.tinta,
  };

  return (
    <Modal
      aberto={aberto}
      aoFechar={fechar}
      titulo={titulo}
      descricao={descricao}
      largura={470}
      rodape={
        <>
          <Botao variante="secundario" onClick={fechar}>
            Cancelar
          </Botao>
          <Botao
            variante="risco"
            disabled={!liberado}
            ocupado={ocupado}
            onClick={async () => {
              setOcupado(true);
              try {
                await aoConfirmar(motivo ? porque.trim() : undefined);
                fechar();
              } finally {
                setOcupado(false);
              }
            }}
          >
            {rotuloConfirmar}
          </Botao>
        </>
      }
    >
      {digitar && (
        <label style={{ display: 'block', marginBottom: 16 }}>
          <span style={{ display: 'block', marginBottom: 6, fontSize: 13, color: COR.apagado }}>
            Para confirmar, digite <b style={{ color: COR.tinta }}>{digitar}</b>
          </span>
          <input value={texto} onChange={(e) => setTexto(e.target.value)} style={campo} autoComplete="off" />
        </label>
      )}
      {motivo && (
        <label style={{ display: 'block' }}>
          <span style={{ display: 'block', marginBottom: 6, fontSize: 13, color: COR.apagado }}>
            Motivo — fica registrado na auditoria
          </span>
          <input
            value={porque}
            onChange={(e) => setPorque(e.target.value)}
            style={campo}
            placeholder="Ex.: crédito lançado em duplicidade"
          />
        </label>
      )}
    </Modal>
  );
}
