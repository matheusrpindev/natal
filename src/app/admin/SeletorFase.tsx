"use client";

import { useTransition } from "react";
import { DESCRICAO_FASE, FASES, NOME_FASE, type Fase } from "@/lib/phase";
import { definirFase } from "./actions";

export function SeletorFase({ atual }: { atual: Fase }) {
  const [pendente, iniciar] = useTransition();
  const mudar = (f: Fase) => {
    if (f === atual) return;
    if (!confirm(`Mudar o site para a fase "${NOME_FASE[f]}"?\n\n${DESCRICAO_FASE[f]}`)) return;
    iniciar(() => definirFase(f));
  };
  return (
    <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {FASES.map((f, i) => {
        const ativa = f === atual;
        return (
          <li key={f}>
            <button
              onClick={() => mudar(f)}
              disabled={pendente}
              aria-pressed={ativa}
              className={`flex h-full w-full flex-col gap-1 rounded-2xl border-2 p-4 text-left transition ${
                ativa
                  ? "border-verde bg-verde text-white shadow-lg"
                  : "border-borda bg-white hover:border-verde/50 disabled:opacity-60"
              }`}
            >
              <span className={`text-xs font-black tracking-widest uppercase ${ativa ? "text-dourado" : "text-tinta-suave"}`}>
                {ativa ? "● Fase atual" : `Fase ${i + 1}`}
              </span>
              <span className="text-lg leading-tight font-extrabold">{NOME_FASE[f]}</span>
              <span className={`text-sm ${ativa ? "text-white/85" : "text-tinta-suave"}`}>{DESCRICAO_FASE[f]}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
