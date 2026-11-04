import type { LucideIcon } from "lucide-react";

type Cor = "vermelho" | "verde" | "dourado" | "branco";

const CORES_SELO: Record<Cor, string> = {
  vermelho: "bg-vermelho/10 text-vermelho ring-vermelho/15",
  verde: "bg-verde/10 text-verde ring-verde/15",
  dourado: "bg-dourado/20 text-dourado-escuro ring-dourado/30",
  branco: "bg-white/10 text-dourado ring-white/15",
};

/** Ícone dentro de um selo arredondado, nas cores do site. */
export function Selo({ icone: Icone, cor = "vermelho", tamanho = 48 }: { icone: LucideIcon; cor?: Cor; tamanho?: number }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-2xl ring-1 ${CORES_SELO[cor]}`}
      style={{ width: tamanho, height: tamanho }}
      aria-hidden
    >
      <Icone size={Math.round(tamanho * 0.5)} strokeWidth={2} />
    </span>
  );
}

/** Estrela dourada do logo. */
export function Estrela({ tamanho = 34 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 48 48" aria-hidden className="drop-shadow-[0_0_10px_#f4c542aa]">
      <defs>
        <linearGradient id="estrela-ouro" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe58a" />
          <stop offset="0.55" stopColor="#f4c542" />
          <stop offset="1" stopColor="#d99a0b" />
        </linearGradient>
      </defs>
      <path
        d="M24 3.5l5.9 13.1 14.3 1.5-10.7 9.6 3 14.1L24 34.6 11.5 41.8l3-14.1L3.8 18.1l14.3-1.5z"
        fill="url(#estrela-ouro)"
        stroke="#b8860b"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path d="M24 9.5l3.6 8" stroke="#fff" strokeOpacity={0.7} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

const ENFEITES = {
  1: { claro: "#ffe58a", medio: "#f4c542", escuro: "#a8740a", texto: "#5a3b00" },
  2: { claro: "#ffffff", medio: "#cfd6de", escuro: "#7d8894", texto: "#33404d" },
  3: { claro: "#ffc9a0", medio: "#d98a4e", escuro: "#7a3f16", texto: "#3d1c05" },
} as const;

/** Bola de Natal de ouro, prata ou bronze (substitui as medalhas). */
export function Enfeite({ posicao, tamanho = 64 }: { posicao: 1 | 2 | 3; tamanho?: number }) {
  const c = ENFEITES[posicao];
  const id = `enfeite-${posicao}`;
  return (
    <svg width={tamanho} height={tamanho * 1.25} viewBox="0 0 64 80" role="img" aria-label={`${posicao}º lugar`}>
      <defs>
        <radialGradient id={id} cx="0.35" cy="0.35" r="0.75">
          <stop offset="0" stopColor={c.claro} />
          <stop offset="0.5" stopColor={c.medio} />
          <stop offset="1" stopColor={c.escuro} />
        </radialGradient>
      </defs>
      <path d="M32 2c-4 0-5 4-3 7" fill="none" stroke={c.escuro} strokeWidth={2} strokeLinecap="round" />
      <rect x={24} y={9} width={16} height={9} rx={2} fill={c.escuro} />
      <rect x={24} y={9} width={16} height={3} rx={1.5} fill={c.claro} opacity={0.6} />
      <circle cx={32} cy={47} r={29} fill={`url(#${id})`} />
      <path d="M8 45c8 4 40 4 48 0" fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={2} />
      <ellipse cx={22} cy={35} rx={5} ry={8} fill="#fff" opacity={0.35} transform="rotate(30 22 35)" />
      <text x={32} y={57} textAnchor="middle" fontSize={22} fontWeight={900} fill={c.texto} fontFamily="var(--font-nunito), sans-serif">
        {posicao}º
      </text>
    </svg>
  );
}
