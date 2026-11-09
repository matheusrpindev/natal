"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { nomeComparavel, RUAS } from "@/lib/ruas";

const ORDENADAS = [...RUAS].sort((a, b) =>
  a.nome.localeCompare(b.nome, "pt-BR"),
);
const semAcento = (v: string) =>
  v.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/** Lista das ruas participantes com busca por nome, bairro ou CEP. */
export function ListaRuas() {
  const [busca, setBusca] = useState("");
  const filtradas = useMemo(() => {
    const termo = semAcento(busca.trim());
    const digitos = busca.replace(/\D/g, "");
    if (!termo) return ORDENADAS;
    return ORDENADAS.filter(
      (r) =>
        nomeComparavel(r.nome).includes(nomeComparavel(busca)) ||
        semAcento(r.nome).includes(termo) ||
        (r.bairro && semAcento(r.bairro).includes(termo)) ||
        (digitos.length >= 3 &&
          r.ceps.some((c) => c.replace(/\D/g, "").includes(digitos))),
    );
  }, [busca]);

  const parciais = RUAS.filter((r) => r.situacao === "parcial").length;

  return (
    <div className="mt-6">
      <p className="text-sm text-tinta-suave">
        São {RUAS.length} ruas: {RUAS.length - parciais} inteiras dentro da área
        e {parciais} com só um trecho dentro (marcadas como
        &ldquo;trecho&rdquo;; participa só a parte dentro do contorno).
      </p>
      <label className="relative mt-3 block">
        <span className="sr-only">Procurar rua, bairro ou CEP</span>
        <Search
          size={18}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-tinta-suave"
          aria-hidden
        />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Procure sua rua, bairro ou CEP"
          className="campo pl-10"
          type="search"
        />
      </label>
      <ul
        className="mt-3 grid max-h-[30rem] gap-x-6 overflow-y-auto rounded-xl border border-borda p-3 sm:grid-cols-2"
        aria-live="polite"
      >
        {filtradas.map((r) => (
          <li
            key={r.nome}
            className="flex items-baseline justify-between gap-3 border-b border-borda py-1.5 text-sm"
          >
            <span>
              <span className="font-bold">{r.nome}</span>
              {r.situacao === "parcial" && (
                <span className="ml-2 rounded-full bg-dourado/25 px-2 py-0.5 text-xs font-bold text-dourado-escuro">
                  trecho
                </span>
              )}
              {r.bairro && (
                <span className="block text-xs text-tinta-suave">
                  {r.bairro}
                </span>
              )}
            </span>
            <span className="flex shrink-0 flex-col text-right text-xs text-tinta-suave tabular-nums">
              {r.ceps.length ? r.ceps.map((c) => <span key={c}>{c}</span>) : "—"}
            </span>
          </li>
        ))}
        {filtradas.length === 0 && (
          <li className="py-2 text-sm text-tinta-suave sm:col-span-2">
            Nenhuma rua encontrada. Se a sua casa fica dentro do contorno
            vermelho, ela pode participar mesmo assim.
          </li>
        )}
      </ul>
    </div>
  );
}
