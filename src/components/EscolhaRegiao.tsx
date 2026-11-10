"use client";

/* eslint-disable @next/next/no-img-element */
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { LISTA_REGIOES } from "@/lib/regioes";

export interface Acao {
  /** Texto do botão grande. */
  rotulo: string;
  /** Página dentro da região (ex.: "/inscricao"). */
  caminho: string;
  pergunta: string;
}

/** Botão grande da página de entrada: ao tocar, pergunta a região e leva para o site dela. */
export function EscolhaRegiao({ acao }: { acao: Acao }) {
  const [aberto, setAberto] = useState(false);
  const id = useId();
  return (
    <div className="flex w-full flex-col items-center">
      {!aberto && (
        <button
          type="button"
          onClick={() => setAberto(true)}
          aria-expanded={aberto}
          aria-controls={id}
          className="pulsar btn btn-dourado px-10 py-5 text-xl tracking-wide uppercase sm:px-14 sm:py-6 sm:text-2xl"
        >
          {acao.rotulo} <ArrowRight size={28} aria-hidden />
        </button>
      )}
      {aberto && (
        <div id={id} className="surgir w-full max-w-3xl">
          <p className="font-festiva text-3xl text-dourado sm:text-4xl">{acao.pergunta}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {LISTA_REGIOES.map((r) => (
              <Link
                key={r.id}
                href={`/${r.id}${acao.caminho}`}
                className="group flex flex-col items-center gap-3 rounded-3xl border-4 border-dourado bg-white/95 p-5 text-verde-noite shadow-[0_16px_40px_-12px_#000] transition-transform hover:-translate-y-1"
              >
                <img src={r.logo.pequeno} alt="" className="h-24 w-auto" />
                <span className="flex items-center gap-2 text-xl font-black">
                  <MapPin size={22} className="text-vermelho" aria-hidden /> Sou do {r.nomeCurto}
                </span>
                <span className="text-sm text-tinta-suave">{r.nome}</span>
                <span className="btn btn-vermelho w-full">
                  Continuar <ArrowRight size={18} aria-hidden />
                </span>
              </Link>
            ))}
          </div>
          <button type="button" onClick={() => setAberto(false)} className="mt-4 text-sm font-bold text-white/75 underline">
            Voltar
          </button>
        </div>
      )}
    </div>
  );
}
