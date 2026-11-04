/**
 * Varal de luzinhas: fio em "barriguinhas" com lâmpadas penduradas.
 * Cada trecho tem 120px; repetimos o suficiente para telas largas.
 */
const CORES = ["#ff4d4d", "#ffd23f", "#3ddc84", "#4db8ff", "#ff7ad9"];
const LARGURA = 120;
const TRECHOS = 24;
const ALTURA = 56;

// Fio: curva de (0,8) até (120,8) passando por baixo (controle em y=36).
const yFio = (t: number) => 8 + 56 * t * (1 - t);
const POSICOES = [1 / 6, 1 / 2, 5 / 6]; // onde as lâmpadas ficam em cada trecho

function Lampada({ x, y, cor, atraso, giro }: { x: number; y: number; cor: number; atraso: number; giro: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${giro})`}>
      {/* soquete */}
      <rect x={-3.5} y={0} width={7} height={7} rx={1.5} fill="#2b3a31" />
      <g className="lampada" style={{ animationDelay: `${atraso}s` }}>
        <circle cx={0} cy={15} r={13} fill={`url(#brilho-${cor})`} />
        <path d="M-5 6 C -8 11, -7.5 19, 0 23 C 7.5 19, 8 11, 5 6 Z" fill={CORES[cor]} />
        <ellipse cx={-2} cy={12} rx={1.6} ry={3.5} fill="#fff" opacity={0.55} />
      </g>
    </g>
  );
}

export function Luzes() {
  let n = 0;
  return (
    <div className="flex h-14 justify-center overflow-hidden" aria-hidden>
      <svg width={0} height={0} className="absolute">
        <defs>
          {CORES.map((c, i) => (
            <radialGradient key={c} id={`brilho-${i}`}>
              <stop offset="0" stopColor={c} stopOpacity={0.55} />
              <stop offset="1" stopColor={c} stopOpacity={0} />
            </radialGradient>
          ))}
        </defs>
      </svg>
      {Array.from({ length: TRECHOS }, (_, s) => (
        <svg key={s} width={LARGURA} height={ALTURA} viewBox={`0 0 ${LARGURA} ${ALTURA}`} className="shrink-0 overflow-visible">
          <path d={`M0 8 Q ${LARGURA / 2} 36 ${LARGURA} 8`} fill="none" stroke="#3b4d41" strokeWidth={2} strokeLinecap="round" />
          <circle cx={0} cy={8} r={2.5} fill="#3b4d41" />
          {POSICOES.map((t, i) => {
            const k = n++;
            return (
              <Lampada
                key={i}
                x={t * LARGURA}
                y={yFio(t) - 1}
                cor={k % CORES.length}
                atraso={((k * 7) % 11) * 0.27}
                giro={(i - 1) * 6}
              />
            );
          })}
        </svg>
      ))}
    </div>
  );
}
