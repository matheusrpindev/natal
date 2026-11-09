"use client";

import { CircleCheck, CircleHelp, CircleX, LoaderCircle, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { mascararCep, soDigitosCep, verificarCep, type ResultadoParticipacao } from "@/lib/cep";
import { MapaArea } from "./MapaArea";

export function PodeParticipar({ inscricoesAbertas, dataInscricoes }: { inscricoesAbertas: boolean; dataInscricoes: string }) {
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoParticipacao | null>(null);

  async function verificar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setResultado(null);
    if (soDigitosCep(cep).length !== 8) {
      setErro("Digite o CEP completo, com 8 números.");
      return;
    }
    setBuscando(true);
    try {
      setResultado(await verificarCep(cep));
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setBuscando(false);
    }
  }

  const linkInscricao = `/inscricao?cep=${soDigitosCep(cep)}${numero ? `&numero=${encodeURIComponent(numero)}` : ""}`;
  const chamada = inscricoesAbertas ? (
    <Link href={linkInscricao} className="btn btn-vermelho mt-4">
      Inscrever minha casa
    </Link>
  ) : (
    <p className="mt-3 font-bold">As inscrições abrem no dia {dataInscricoes}. Já vá preparando a decoração!</p>
  );
  const endereco = (nome: string) => `${nome}${numero ? `, ${numero}` : ""}`;

  return (
    <div className="cartao p-6 sm:p-8">
      <form onSubmit={verificar} className="grid gap-3 sm:grid-cols-[1fr_9rem_auto] sm:items-end">
        <label className="flex flex-col gap-1.5">
          <span className="font-bold">CEP</span>
          <input
            value={cep}
            onChange={(e) => setCep(mascararCep(e.target.value))}
            inputMode="numeric"
            placeholder="08587-000"
            className="campo"
            autoComplete="postal-code"
            required
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-bold">Número</span>
          <input value={numero} onChange={(e) => setNumero(e.target.value.slice(0, 10))} className="campo" placeholder="Ex.: 120" />
        </label>
        <button disabled={buscando} className="btn btn-verde">
          {buscando ? <LoaderCircle size={18} className="animate-spin" aria-hidden /> : <Search size={18} aria-hidden />}
          Verificar
        </button>
      </form>

      <div aria-live="polite">
        {erro && <p className="mt-4 font-bold text-vermelho">{erro}</p>}

        {resultado?.status === "sim" && (
          <div className="mt-6 rounded-2xl bg-verde/10 p-5">
            <p className="flex items-center gap-2 text-xl font-extrabold text-verde">
              <CircleCheck aria-hidden /> Sim! Sua casa pode participar.
            </p>
            <p className="mt-1">
              A <strong>{endereco(resultado.rua.nome)}</strong> fica dentro da área do Natal Iluminado.
            </p>
            {chamada}
          </div>
        )}

        {resultado?.status === "parcial" && (
          <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-dourado/20 p-5">
            <div>
              <p className="flex items-center gap-2 text-xl font-extrabold text-dourado-escuro">
                <CircleHelp aria-hidden /> Depende do trecho da rua.
              </p>
              <p className="mt-1">
                Só uma parte da <strong>{resultado.rua.nome}</strong> fica dentro da área. Ela aparece em branco no mapa:
                se a sua casa{numero ? ` (nº ${numero})` : ""} estiver dentro do contorno vermelho, pode participar.
              </p>
              {chamada}
            </div>
            <MapaArea destaque={resultado.rua} mostrarRuas={false} altura="h-72 sm:h-96" />
          </div>
        )}

        {resultado?.status === "conferir" && (
          <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-dourado/20 p-5">
            <div>
              <p className="flex items-center gap-2 text-xl font-extrabold text-dourado-escuro">
                <CircleHelp aria-hidden /> Confira no mapa.
              </p>
              <p className="mt-1">
                Não achamos a <strong>{endereco(resultado.endereco.logradouro || "sua rua")}</strong> na nossa lista, mas parte do
                bairro {resultado.endereco.bairro} fica dentro da área. Se a sua casa estiver dentro do contorno vermelho, pode
                participar.
              </p>
              {chamada}
            </div>
            <MapaArea altura="h-72 sm:h-96" />
          </div>
        )}

        {resultado?.status === "fora" && (
          <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-vermelho/10 p-5">
            <div>
              <p className="flex items-center gap-2 text-xl font-extrabold text-vermelho">
                <CircleX aria-hidden /> Essa casa fica fora da área do concurso.
              </p>
              <p className="mt-1">
                {resultado.endereco ? (
                  <>
                    <strong>{endereco(resultado.endereco.logradouro || "Esse endereço")}</strong>
                    {resultado.endereco.bairro && ` (${resultado.endereco.bairro})`}
                    {" não está na área do concurso. Veja no mapa as ruas que participam:"}
                  </>
                ) : (
                  "Veja no mapa as ruas que participam:"
                )}
              </p>
              <p className="mt-2 text-sm text-tinta-suave">
                Acha que é engano? Fale com a organização. Mas você ainda pode votar nas casas participantes!
              </p>
            </div>
            <MapaArea altura="h-72 sm:h-96" />
          </div>
        )}

        {resultado?.status === "nao-encontrado" && (
          <p className="mt-4 font-bold text-vermelho">Não encontramos esse CEP. Confira os números e tente de novo.</p>
        )}
      </div>
    </div>
  );
}
