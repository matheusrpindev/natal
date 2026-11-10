import { Download } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { Titulo } from "@/components/Titulo";
import { EVENTO } from "@/lib/config";
import { regiaoDaRota } from "@/lib/rota";
import { Item, urlPdf } from "../componentes";
import { regulamentoDa, resumoDa } from "../texto";

export const metadata: Metadata = { title: "Regulamento completo" };

export default async function RegulamentoCompleto({ params }: PageProps<"/[regiao]/regulamento/completo">) {
  const regiao = await regiaoDaRota(params);
  const secoes = regulamentoDa(regiao);
  return (
    <>
      <Titulo titulo="Regulamento oficial" subtitulo={`${regiao.concurso} — ${EVENTO.ano}`} />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="nao-imprimir mb-6 flex flex-wrap gap-3">
          <a href={urlPdf(regiao)} download className="btn btn-vermelho">
            <Download size={18} aria-hidden /> Baixar em PDF
          </a>
          <Link href={`/${regiao.id}/regulamento`} className="btn btn-contorno text-verde">
            Ver o resumo
          </Link>
        </div>
        <nav aria-label="Seções do regulamento" className="cartao mb-6 p-5 sm:p-6">
          <p className="text-sm font-extrabold tracking-widest text-verde uppercase">Índice</p>
          <ol className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
            {secoes.map((s) => (
              <li key={s.numero}>
                <a href={s.numero === 3 ? "#area" : `#secao-${s.numero}`} className="hover:text-vermelho hover:underline">
                  {s.numero}. {s.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="cartao space-y-10 p-6 sm:p-10">
          {secoes.map((s) => (
            <section key={s.numero} id={s.numero === 3 ? "area" : `secao-${s.numero}`} className="scroll-mt-6">
              <h2 className="text-xl font-extrabold text-vermelho uppercase">
                {s.numero}. {s.titulo}
              </h2>
              <div className="mt-4 space-y-3">
                {s.itens.map((item, i) => (
                  <Item key={i} item={item} regiao={regiao} />
                ))}
              </div>
            </section>
          ))}
          <dl className="grid gap-x-6 gap-y-2 rounded-2xl bg-verde p-6 text-white sm:grid-cols-[auto_1fr]">
            <p className="font-festiva text-2xl text-dourado sm:col-span-2">
              {regiao.concurso} — {EVENTO.ano}
            </p>
            {resumoDa(regiao).map(([k, v]) => (
              <Fragment key={k}>
                <dt className="font-extrabold">{k}</dt>
                <dd className="text-white/90">{v}</dd>
              </Fragment>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
}
