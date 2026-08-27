'use client';

import type { Lamina, Quadro } from '@/lib/album';
import { PRESETS_TEXTO } from '@/lib/album';
import type { Foto } from '@/lib/data';
import { IconGaleria } from '@/components/icons';

/**
 * A lamina (spread) desenhada. Coordenadas dos quadros sao % da lamina,
 * entao o zoom e so a largura do container - nada precisa ser recalculado.
 */
export default function Canvas({
  lamina,
  indice,
  total,
  zoom,
  fotos,
  selecionado,
  onSelecionar,
  onSoltarFoto,
  onEditarTexto,
  guias,
}: {
  lamina: Lamina;
  indice: number;
  total: number;
  zoom: number;
  fotos: Map<string, Foto>;
  selecionado: string | null;
  onSelecionar: (id: string | null) => void;
  onSoltarFoto: (quadroId: string, fotoId: string) => void;
  onEditarTexto: (quadroId: string, texto: string) => void;
  guias: boolean;
}) {
  return (
    <div
      className="flex flex-1 items-center justify-center overflow-auto bg-[#E8EDF5] p-8"
      onClick={() => onSelecionar(null)}
    >
      <div className="flex flex-col items-center gap-3" style={{ width: `${zoom}%`, maxWidth: '100%' }}>
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative aspect-[2/1] w-full shadow-[0_18px_50px_rgba(11,18,32,.18)] [container-type:inline-size]"
          style={{ background: lamina.fundo }}
        >
          {guias && (
            <>
              {/* sangria */}
              <span className="pointer-events-none absolute inset-[1.5%] border border-dashed border-coral/45" />
              {/* area segura */}
              <span className="pointer-events-none absolute inset-[4%] border border-dashed border-blue/40" />
            </>
          )}
          {/* linha central da dobra */}
          <span className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-ink/10" />

          {lamina.quadros.map((q) => (
            <QuadroNaLamina
              key={q.id}
              quadro={q}
              foto={q.tipo === 'foto' && q.fotoId ? fotos.get(q.fotoId) : undefined}
              selecionado={selecionado === q.id}
              onSelecionar={() => onSelecionar(q.id)}
              onSoltarFoto={(fotoId) => onSoltarFoto(q.id, fotoId)}
              onEditarTexto={(t) => onEditarTexto(q.id, t)}
            />
          ))}
        </div>

        <div className="flex items-center gap-4 text-[11.5px] text-muted">
          <span>
            Lâmina {indice + 1} de {total}
          </span>
          {guias && (
            <>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-4 border border-dashed border-coral/60" />
                margem de corte
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-4 border border-dashed border-blue/60" />
                área segura
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function QuadroNaLamina({
  quadro,
  foto,
  selecionado,
  onSelecionar,
  onSoltarFoto,
  onEditarTexto,
}: {
  quadro: Quadro;
  foto?: Foto;
  selecionado: boolean;
  onSelecionar: () => void;
  onSoltarFoto: (fotoId: string) => void;
  onEditarTexto: (texto: string) => void;
}) {
  const posicao = {
    left: `${quadro.x}%`,
    top: `${quadro.y}%`,
    width: `${quadro.w}%`,
    height: `${quadro.h}%`,
  };
  const anel = selecionado ? 'outline outline-2 outline-blue outline-offset-2' : '';

  if (quadro.tipo === 'texto') {
    return (
      <div
        style={{ ...posicao, color: quadro.cor }}
        onClick={(e) => {
          e.stopPropagation();
          onSelecionar();
        }}
        className={`absolute flex cursor-pointer items-center ${anel}`}
      >
        <span
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onEditarTexto(e.currentTarget.textContent ?? '')}
          className={`w-full outline-none ${PRESETS_TEXTO[quadro.preset].classe}`}
        >
          {quadro.texto}
        </span>
      </div>
    );
  }

  return (
    <div
      style={posicao}
      onClick={(e) => {
        e.stopPropagation();
        onSelecionar();
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/photoon-foto');
        if (id) onSoltarFoto(id);
      }}
      className={`absolute cursor-pointer overflow-hidden ${anel} ${
        foto ? '' : 'border-2 border-dashed border-[#CBD5E6] bg-page/80'
      }`}
    >
      {foto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={foto.url}
          alt=""
          draggable={false}
          className="h-full w-full object-cover"
          style={{
            transform: `scale(${quadro.zoom / 100}) rotate(${quadro.rotacao}deg)`,
            filter: quadro.pb ? 'grayscale(1)' : undefined,
          }}
        />
      ) : (
        <span className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-2">
          <IconGaleria size={20} />
          <span className="text-[1cqw]">arraste uma foto</span>
        </span>
      )}
    </div>
  );
}
