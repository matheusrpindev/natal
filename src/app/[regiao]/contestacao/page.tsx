import { Hourglass, Lock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { Aviso, Titulo } from "@/components/Titulo";
import { DATAS, formatarData, formatarDataHora } from "@/lib/config";
import { faseAtual } from "@/lib/db";
import { contestacaoAberta } from "@/lib/phase";
import type { Regiao } from "@/lib/regioes";
import { regiaoDaRota } from "@/lib/rota";
import { FormContestacao } from "./FormContestacao";

export const metadata: Metadata = { title: "Contestação" };

async function Conteudo({ regiao }: { regiao: Regiao }) {
  await connection();
  const { fase } = await faseAtual();
  const prazo = formatarDataHora(DATAS.contestacaoFim);
  if (contestacaoAberta(fase)) {
    return <FormContestacao regiao={regiao.id} prazo={prazo} />;
  }
  if (fase === "preliminar" || fase === "resultado") {
    return (
      <Aviso icone={Lock} titulo="Prazo encerrado">
        O prazo para contestações terminou em <strong>{prazo}</strong>.{" "}
        <Link href={`/${regiao.id}/resultado`} className="font-bold text-verde underline">
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

export default async function PaginaContestacao({ params }: PageProps<"/[regiao]/contestacao">) {
  const regiao = await regiaoDaRota(params);
  return (
    <>
      <Titulo
        titulo="Contestação"
        subtitulo={`${regiao.concurso}: canal oficial de recursos sobre a classificação preliminar (regulamento, itens 9.3 a 9.5).`}
      />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="mb-6 text-tinta-suave">
          Só o responsável por uma casa inscrita pode contestar. Mensagens pelo Instagram ou WhatsApp não substituem este
          formulário (item 14.4).
        </p>
        <Suspense fallback={<p className="text-center text-tinta-suave">Carregando…</p>}>
          <Conteudo regiao={regiao} />
        </Suspense>
      </div>
    </>
  );
}
