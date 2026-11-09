import { Hourglass, Lock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { Aviso, Titulo } from "@/components/Titulo";
import { DATAS, formatarData, formatarDataHora } from "@/lib/config";
import { faseAtual } from "@/lib/db";
import { contestacaoAberta } from "@/lib/phase";
import { FormContestacao } from "./FormContestacao";

export const metadata: Metadata = { title: "Contestação" };

async function Conteudo() {
  await connection();
  const { fase } = await faseAtual();
  const prazo = formatarDataHora(DATAS.contestacaoFim);
  if (contestacaoAberta(fase)) {
    return <FormContestacao prazo={prazo} />;
  }
  if (fase === "preliminar" || fase === "resultado") {
    return (
      <Aviso icone={Lock} titulo="Prazo encerrado">
        O prazo para contestações terminou em <strong>{prazo}</strong>.{" "}
        <Link href="/resultado" className="font-bold text-verde underline">
          Ver a classificação
        </Link>
      </Aviso>
    );
  }
  return (
    <Aviso icone={Hourglass} titulo="Ainda não é hora">
      As contestações abrem com a divulgação da classificação preliminar, prevista para{" "}
      <strong>{formatarData(DATAS.preliminar)}</strong>, e vão até <strong>{prazo}</strong>.
    </Aviso>
  );
}

export default function PaginaContestacao() {
  return (
    <>
      <Titulo
        titulo="Contestação"
        subtitulo="Canal oficial de recursos sobre a classificação preliminar (regulamento, itens 9.3 a 9.5)."
      />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="mb-6 text-tinta-suave">
          Só o responsável por uma casa inscrita pode contestar. Mensagens pelo Instagram ou WhatsApp não substituem este
          formulário (item 14.4).
        </p>
        <Suspense fallback={<p className="text-center text-tinta-suave">Carregando…</p>}>
          <Conteudo />
        </Suspense>
      </div>
    </>
  );
}
