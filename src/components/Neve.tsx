// Valores pseudo-aleatórios fixos para o servidor e o navegador renderizarem igual.
function aleatorio(semente: number) {
  const x = Math.sin(semente * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const FLOCOS = Array.from({ length: 48 }, (_, i) => ({
  left: aleatorio(i + 1) * 100,
  tamanho: 2 + aleatorio(i + 50) * 5,
  duracao: 10 + aleatorio(i + 100) * 14,
  atraso: -aleatorio(i + 150) * 24,
  deriva: (aleatorio(i + 200) - 0.5) * 120,
  opacidade: 0.35 + aleatorio(i + 250) * 0.55,
}));

/** Neve caindo: pontinhos brancos e suaves, de tamanhos variados. */
export function Neve() {
  return (
    <div className="neve pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {FLOCOS.map((f, i) => (
        <span
          key={i}
          className="floco"
          style={{
            left: `${f.left}%`,
            width: f.tamanho,
            height: f.tamanho,
            opacity: f.opacidade,
            animationDuration: `${f.duracao}s`,
            animationDelay: `${f.atraso}s`,
            ["--deriva" as string]: `${f.deriva}px`,
          }}
        />
      ))}
    </div>
  );
}
