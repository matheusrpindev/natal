/* eslint-disable @next/next/no-img-element */
import { ClipboardPen, Download, FileText, Trophy, Vote } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Contagem } from "@/components/Contagem";
import { EscolhaRegiao, type Acao } from "@/components/EscolhaRegiao";
import { Selo } from "@/components/Icones";
import { Iniciativa } from "@/components/Iniciativa";
import { Luzes } from "@/components/Luzes";
import { Neve } from "@/components/Neve";
import { Organizador } from "@/components/Organizador";
import { FotoPremio } from "@/components/Premio";
import { DATAS, EVENTO, formatarData } from "@/lib/config";
import { faseAtual } from "@/lib/db";
import { proximoMarco, type Fase } from "@/lib/phase";
import { LISTA_REGIOES } from "@/lib/regioes";
import { urlPdf } from "./[regiao]/regulamento/componentes";

export const metadata: Metadata = { title: { absolute: "Natal Iluminado 2026 · Concorra a um kit churrasco" } };

const ACOES: Record<Fase, Acao> = {
  "em-breve": { rotulo: "Inscreva minha casa", caminho: "/inscricao", pergunta: "Onde fica a sua casa?" },
  inscricoes: { rotulo: "Inscreva minha casa", caminho: "/inscricao", pergunta: "Onde fica a sua casa?" },
  votacao: { rotulo: "Votar agora", caminho: "/votar", pergunta: "Em qual bairro você quer votar?" },
  apuracao: { rotulo: "Ver as casas", caminho: "/casas", pergunta: "De qual bairro?" },
  preliminar: { rotulo: "Ver a classificação", caminho: "/resultado", pergunta: "De qual bairro?" },
  resultado: { rotulo: "Ver o resultado", caminho: "/resultado", pergunta: "De qual bairro?" },
};

const ETAPAS = [
  {
    icone: ClipboardPen,
    cor: "vermelho" as const,
    titulo: "Inscreva sua casa",
    quando: `${formatarData(DATAS.inscricoesInicio)} a ${formatarData(DATAS.inscricoesFim)}`,
    texto: "Decore, tire de 1 a 3 fotos e inscreva sua casa pelo site. É grátis!",
  },
  {
    icone: Vote,
    cor: "verde" as const,
    titulo: "Votação popular",
    quando: `${formatarData(DATAS.votacaoInicio)} a ${formatarData(DATAS.votacaoFim)}`,
    texto: "Qualquer pessoa vota, com 1 voto por CPF. Chame a família e os vizinhos!",
  },
  {
    icone: Trophy,
    cor: "dourado" as const,
    titulo: "Resultado",
    quando: formatarData(DATAS.resultado),
    texto: "A casa mais votada de cada bairro ganha um kit churrasco.",
  },
];

async function Chamada() {
  const { fase } = await faseAtual();
  const marco = proximoMarco(fase);
  return (
    <div className="flex w-full flex-col items-center gap-8">
      <EscolhaRegiao acao={ACOES[fase]} />
      {marco && <Contagem alvo={marco.data.toISOString()} rotulo={marco.rotulo} />}
    </div>
  );
}

export default function Entrada() {
  return (
    <main className="flex-1">
      <section className="ceu-noturno relative overflow-hidden text-white">
        <Luzes />
        <Neve />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pt-6 pb-16 text-center sm:pb-24">
          <p className="rounded-full border border-dourado/40 bg-dourado/10 px-4 py-1.5 text-xs font-extrabold tracking-[0.12em] text-dourado uppercase sm:tracking-[0.2em]">
            Concurso de decoração de Natal {EVENTO.ano}
          </p>
          <h1 className="mt-5">
            <span className="sr-only">Natal Iluminado 2026 — Scaffid II e Parque Residencial Marengo</span>
            <img src="/logo-natal-geral.webp" alt="" className="mx-auto h-44 w-auto drop-shadow-[0_10px_30px_#000a] sm:h-60" />
          </h1>
          <p className="mt-4 text-lg font-extrabold text-white sm:text-xl">
            No <span className="text-dourado">Scaffid II</span> e no <span className="text-dourado">Parque Residencial Marengo</span>
          </p>

          <div className="mt-8 grid w-full items-center gap-8 md:grid-cols-[1.1fr_1fr] md:text-left">
            <div>
              <p className="faixa-premio inline-block -rotate-2 rounded-lg px-4 py-1.5 text-sm font-black tracking-[0.2em] text-white uppercase shadow-lg">
                Prêmio do 1º lugar
              </p>
              <h2 className="font-festiva mt-3 text-5xl leading-[0.95] font-bold text-dourado drop-shadow-[0_4px_0_#7a1020] sm:text-7xl">
                Ganhe um kit churrasco!
              </h2>
              <p className="mt-4 max-w-md text-lg text-white/90 md:max-w-none">
                A casa com a decoração mais votada <strong className="text-white">em cada bairro</strong> leva o kit para
                comemorar com a família.
              </p>
            </div>
            <FotoPremio className="md:rotate-2" />
          </div>

          <div className="mt-12 w-full">
            <Suspense fallback={<EscolhaRegiao acao={ACOES["inscricoes"]} />}>
              <Chamada />
            </Suspense>
          </div>
          <Iniciativa className="mt-10" />
        </div>
        <svg viewBox="0 0 1440 80" className="relative block w-full text-creme" preserveAspectRatio="none" aria-hidden>
          <path fill="currentColor" d="M0 40 C 120 10, 240 70, 360 40 S 600 10, 720 40 960 70, 1080 40 1320 10, 1440 40 V80 H0 Z" />
        </svg>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-festiva text-center text-4xl font-bold text-vermelho sm:text-5xl">Como funciona</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {ETAPAS.map((e, i) => (
            <li key={e.titulo} className="cartao relative p-6 pt-8">
              <span className="absolute -top-4 left-6 flex h-9 w-9 items-center justify-center rounded-full bg-verde text-lg font-black text-white shadow-md">
                {i + 1}
              </span>
              <Selo icone={e.icone} cor={e.cor} />
              <h3 className="mt-3 text-xl font-extrabold">{e.titulo}</h3>
              <p className="mt-1 font-bold text-vermelho">{e.quando}</p>
              <p className="mt-2 text-tinta-suave">{e.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="font-festiva text-center text-4xl font-bold text-vermelho sm:text-5xl">Dois bairros, dois campeões</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-tinta-suave">
          Cada bairro tem o seu concurso, com inscrições, votação e vencedor próprios. O prêmio é o mesmo.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {LISTA_REGIOES.map((r) => (
            <article key={r.id} className="cartao flex flex-col items-center gap-4 p-6 text-center">
              <div className="w-full rounded-2xl bg-verde-noite p-4">
                <img src={r.logo.pequeno} alt={r.concurso} className="mx-auto h-28 w-auto" />
              </div>
              <h3 className="text-2xl font-extrabold">{r.nome}</h3>
              <p className="text-tinta-suave">
                {r.ruas.length} ruas participantes · casas dentro do contorno do mapa
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Link href={`/${r.id}`} className="btn btn-verde">
                  Entrar
                </Link>
                <Link href={`/${r.id}/regulamento`} className="btn btn-contorno text-verde">
                  <FileText size={18} aria-hidden /> Regulamento
                </Link>
                <a href={urlPdf(r)} download className="btn btn-contorno text-verde">
                  <Download size={18} aria-hidden /> PDF
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Organizador />
    </main>
  );
}
