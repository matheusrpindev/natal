const CORES = ["#ff3b3b", "#ffd23f", "#3bd16f", "#3fa9ff", "#ff7ad9"];

export function Luzes({ quantidade = 48 }: { quantidade?: number }) {
  return (
    <div className="luzes" aria-hidden>
      {Array.from({ length: quantidade }, (_, i) => (
        <span
          key={i}
          className="luz"
          style={{ ["--cor" as string]: CORES[i % CORES.length], ["--atraso" as string]: `${(i % 4) * 0.4}s` }}
        />
      ))}
    </div>
  );
}
