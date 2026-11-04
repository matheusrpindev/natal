// Valores pseudo-aleatórios fixos para o servidor e o navegador renderizarem igual.
function aleatorio(semente: number) {
  const x = Math.sin(semente * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const FLOCOS = Array.from({ length: 36 }, (_, i) => ({
  left: aleatorio(i + 1) * 100,
  tamanho: 8 + aleatorio(i + 50) * 14,
  duracao: 9 + aleatorio(i + 100) * 12,
  atraso: -aleatorio(i + 150) * 20,
  deriva: (aleatorio(i + 200) - 0.5) * 120,
  opacidade: 0.4 + aleatorio(i + 250) * 0.6,
}));

export function Neve() {
  return (
    <div className="neve pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {FLOCOS.map((f, i) => (
        <span
          key={i}
          className="floco"
          style={{
            left: `${f.left}%`,
            fontSize: f.tamanho,
            opacity: f.opacidade,
            animationDuration: `${f.duracao}s`,
            animationDelay: `${f.atraso}s`,
            ["--deriva" as string]: `${f.deriva}px`,
          }}
        >
          ❄
        </span>
      ))}
    </div>
  );
}
