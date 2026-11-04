"use client";

import { useEffect, useState } from "react";

function partes(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { dias: Math.floor(s / 86400), horas: Math.floor((s % 86400) / 3600), min: Math.floor((s % 3600) / 60), seg: s % 60 };
}

export function Contagem({ alvo, rotulo }: { alvo: string; rotulo: string }) {
  const [agora, setAgora] = useState<number | null>(null);
  useEffect(() => {
    const tique = () => setAgora(Date.now());
    const primeiro = setTimeout(tique, 0);
    const t = setInterval(tique, 1000);
    return () => {
      clearTimeout(primeiro);
      clearInterval(t);
    };
  }, []);
  const p = partes(agora == null ? 0 : new Date(alvo).getTime() - agora);
  const itens: [number, string][] = [
    [p.dias, "dias"],
    [p.horas, "horas"],
    [p.min, "min"],
    [p.seg, "seg"],
  ];
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-bold tracking-widest text-white/80 uppercase">{rotulo}</p>
      <div className="flex gap-2 sm:gap-3" role="timer" aria-live="off">
        {itens.map(([v, r]) => (
          <div key={r} className="flex w-16 flex-col items-center rounded-2xl border border-white/15 bg-white/10 py-2 backdrop-blur sm:w-20">
            <span className="text-3xl font-black tabular-nums sm:text-4xl">{agora == null ? "–" : String(v).padStart(2, "0")}</span>
            <span className="text-[0.7rem] font-bold tracking-wider text-white/70 uppercase">{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
