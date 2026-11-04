import type { Metadata } from "next";
import { Hourglass, Lock } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Aviso, Titulo } from "@/components/Titulo";
import { DATAS, formatarData } from "@/lib/config";
import { faseAtual } from "@/lib/db";
import { FormInscricao } from "./FormInscricao";

export const metadata: Metadata = { title: "Inscrição" };

async function Conteudo({ searchParams }: { searchParams: Promise<{ cep?: string | string[]; numero?: string | string[] }> }) {
  const { fase } = await faseAtual();
  if (fase === "em-breve") {
    return (
      <Aviso icone={Hourglass} titulo="Inscrições em breve">
        As inscrições abrem no dia <strong>{formatarData(DATAS.inscricoesInicio)}</strong> e vão até{" "}
        <strong>{formatarData(DATAS.inscricoesFim)}</strong>. Aproveite para caprichar na decoração!
      </Aviso>
    );
  }
  if (fase !== "inscricoes") {
    return (
      <Aviso icone={Lock} titulo="Inscrições encerradas">
        As inscrições terminaram em {formatarData(DATAS.inscricoesFim)}.{" "}
        <Link href="/casas" className="font-bold text-verde underline">
          Conheça as casas participantes
        </Link>
        .
      </Aviso>
    );
  }
  const sp = await searchParams;
  const um = (v?: string | string[]) => (typeof v === "string" ? v : "");
  return <FormInscricao cepInicial={um(sp.cep)} numeroInicial={um(sp.numero)} />;
}

export default function PaginaInscricao({ searchParams }: PageProps<"/inscricao">) {
  return (
    <>
      <Titulo
        titulo="Inscreva sua casa"
        subtitulo={`Inscrições de ${formatarData(DATAS.inscricoesInicio)} a ${formatarData(DATAS.inscricoesFim)}. É grátis!`}
      />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Suspense fallback={<p className="text-center text-tinta-suave">Carregando…</p>}>
          <Conteudo searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
