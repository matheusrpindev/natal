"use client";

import { CircleCheck, LoaderCircle, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Selo } from "@/components/Icones";
import { formatarDataHora } from "@/lib/config";
import { mascararTelefone } from "@/lib/cpf";
import type { RegiaoId } from "@/lib/regioes";

function Campo({ rotulo, dica, children }: { rotulo: string; dica?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-bold">{rotulo}</span>
      {children}
      {dica && <span className="text-sm text-tinta-suave">{dica}</span>}
    </label>
  );
}

export function FormContestacao({ regiao, prazo }: { regiao: RegiaoId; prazo: string }) {
  const [whats, setWhats] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<{ protocolo: string; criadoEm: string } | null>(null);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      const r = await fetch("/api/contestacao", { method: "POST", body: new FormData(e.currentTarget) });
      const json = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(json.erro ?? "Não foi possível enviar. Tente novamente.");
      setSucesso({ protocolo: json.protocolo, criadoEm: json.criadoEm ?? new Date().toISOString() });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  if (sucesso) {
    return (
      <div className="cartao p-8 text-center">
        <Selo icone={CircleCheck} cor="verde" tamanho={72} />
        <h2 className="font-festiva mt-3 text-4xl font-bold text-verde">Contestação recebida</h2>
        <p className="mt-3 text-lg">
          Protocolo <strong className="rounded bg-dourado/30 px-2 py-0.5 font-mono">{sucesso.protocolo}</strong>, enviado em{" "}
          {formatarDataHora(new Date(sucesso.criadoEm))}.
        </p>
        <p className="mt-3 text-tinta-suave">
          A organização vai analisar e comunicar o resultado da análise pelo WhatsApp informado, antes da divulgação do
          resultado definitivo.
        </p>
        <Link href={`/${regiao}/resultado`} className="btn btn-verde mt-6">
          Voltar à classificação
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="cartao flex flex-col gap-5 p-6 sm:p-8">
      <p className="text-tinta-suave">
        Prazo: até <strong className="text-tinta">{prazo}</strong>. Os campos com * são obrigatórios.
      </p>
      <Campo rotulo="Protocolo da sua inscrição *" dica="Está na confirmação da inscrição. Exemplo: NI-ABC123.">
        <input name="protocoloInscricao" required maxLength={20} className="campo font-mono uppercase" autoComplete="off" />
      </Campo>
      <Campo rotulo="Seu nome completo *">
        <input name="nome" required maxLength={120} className="campo" autoComplete="name" />
      </Campo>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo rotulo="WhatsApp *">
          <input
            name="whatsapp"
            required
            inputMode="tel"
            className="campo"
            autoComplete="tel"
            placeholder="(11) 90000-0000"
            value={whats}
            onChange={(e) => setWhats(mascararTelefone(e.target.value))}
          />
        </Campo>
        <Campo rotulo="E-mail">
          <input name="email" type="email" maxLength={160} className="campo" autoComplete="email" />
        </Campo>
      </div>
      <Campo rotulo="O que você está contestando? *" dica="Descreva o fato com clareza: o que aconteceu, quando e por que considera irregular.">
        <textarea name="descricao" required minLength={20} maxLength={3000} rows={6} className="campo" />
      </Campo>
      <Campo
        rotulo="Evidências"
        dica="Opcional. Cole links de prints, vídeos ou documentos (Google Drive, por exemplo) ou explique onde estão."
      >
        <textarea name="evidencias" maxLength={2000} rows={3} className="campo" />
      </Campo>
      <input type="text" name="site" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {erro && (
        <p role="alert" className="rounded-xl bg-vermelho/10 p-3 font-bold text-vermelho">
          {erro}
        </p>
      )}
      <button disabled={enviando} className="btn btn-vermelho self-start">
        {enviando ? <LoaderCircle size={18} className="animate-spin" aria-hidden /> : <Send size={18} aria-hidden />}
        Enviar contestação
      </button>
    </form>
  );
}
