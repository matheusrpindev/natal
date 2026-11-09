import type { Metadata } from "next";
import { Hourglass, Lock, TreePine } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Aviso, Titulo } from "@/components/Titulo";
import { casasAprovadas } from "@/lib/casas";
import { DATAS, formatarData } from "@/lib/config";
import { faseAtual } from "@/lib/db";
import { Votacao } from "./Votacao";

export const metadata: Metadata = { title: "Votar" };

async function Conteudo({ searchParams }: { searchParams: Promise<{ casa?: string | string[] }> }) {
  const { fase } = await faseAtual();
  if (fase === "em-breve" || fase === "inscricoes") {
    return (
      <Aviso icone={Hourglass} titulo="A votação ainda não começou">
        A votação vai de <strong>{formatarData(DATAS.votacaoInicio)}</strong> a{" "}
        <strong>{formatarData(DATAS.votacaoFim)}</strong>. Enquanto isso,{" "}
        <Link href="/casas" className="font-bold text-verde underline">
          conheça as casas participantes
        </Link>
        .
      </Aviso>
    );
  }
  if (fase !== "votacao") {
    return (
      <Aviso icone={Lock} titulo="Votação encerrada">
        Obrigado a todos que votaram! A classificação preliminar sai no dia{" "}
        <strong>{formatarData(DATAS.preliminar)}</strong> e o resultado definitivo no dia{" "}
        <strong>{formatarData(DATAS.resultado)}</strong>.{" "}
        {(fase === "preliminar" || fase === "resultado") && (
          <Link href="/resultado" className="font-bold text-verde underline">
            {fase === "resultado" ? "Ver o resultado" : "Ver a classificação preliminar"}
          </Link>
        )}
      </Aviso>
    );
  }
  const casas = await casasAprovadas();
  if (casas.length === 0) return <Aviso icone={TreePine} titulo="Nenhuma casa na votação ainda" />;
  const { casa } = await searchParams;
  const inicial = typeof casa === "string" ? casa : null;
  return <Votacao key={inicial ?? ""} casas={casas} inicial={inicial} />;
}

export default function PaginaVotar({ searchParams }: PageProps<"/votar">) {
  return (
    <>
      <Titulo
        titulo="Vote na casa mais bonita"
        subtitulo={`Votação de ${formatarData(DATAS.votacaoInicio)} a ${formatarData(DATAS.votacaoFim)} · 1 voto por CPF`}
      />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Suspense fallback={<p className="text-center text-tinta-suave">Carregando…</p>}>
          <Conteudo searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
