"use client";

import { Check, X } from "lucide-react";
import { useTransition } from "react";
import type { StatusInscricao } from "@/lib/db/types";
import { mudarStatus } from "./actions";

export function BotoesStatus({ id, status }: { id: string; status: StatusInscricao }) {
  const [pendente, iniciar] = useTransition();
  const mudar = (s: StatusInscricao, confirmar?: string) => {
    if (confirmar && !confirm(confirmar)) return;
    iniciar(() => mudarStatus(id, s));
  };
  return (
    <div className="flex flex-wrap gap-2">
      {status !== "aprovada" && (
        <button disabled={pendente} onClick={() => mudar("aprovada")} className="btn btn-verde px-4 py-2 text-sm">
          <Check size={16} aria-hidden /> Aprovar
        </button>
      )}
      {status !== "recusada" && (
        <button
          disabled={pendente}
          onClick={() => mudar("recusada", status === "aprovada" ? "Tirar esta casa do concurso?" : undefined)}
          className="btn btn-contorno px-4 py-2 text-sm text-vermelho"
        >
          <X size={16} aria-hidden /> Recusar
        </button>
      )}
      {status !== "pendente" && (
        <button disabled={pendente} onClick={() => mudar("pendente")} className="btn px-4 py-2 text-sm text-tinta-suave underline">
          Voltar p/ pendente
        </button>
      )}
    </div>
  );
}
