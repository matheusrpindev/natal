/* eslint-disable @next/next/no-img-element */
import { ArrowRight, Gift, Scale, TreePine } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { enderecoPublico, nomeCasa } from "@/components/CartaoCasa";
import { Enfeite } from "@/components/Icones";
import { Aviso, Titulo } from "@/components/Titulo";
import { DATAS, EVENTO, formatarData, formatarDataHora } from "@/lib/config";
import { faseAtual } from "@/lib/db";
import { contestacaoAberta } from "@/lib/phase";
import { ranking } from "@/lib/ranking";
import type { Regiao } from "@/lib/regioes";
import { regiaoDaRota } from "@/lib/rota";

export const metadata: Metadata = { title: "Resultado" };

async function Conteudo({ regiao }: { regiao: Regiao }) {
  const { fase } = await faseAtual();
  if (fase !== "resultado" && fase !== "preliminar") {
    return (
      <Aviso icone={Gift} titulo="O resultado ainda é segredo!">
        A classificação preliminar sai no dia <strong>{formatarData(DATAS.preliminar)}</strong> e o resultado definitivo
        no dia <strong>{formatarData(DATAS.resultado)}</strong>. Até lá, nem o Papai Noel sabe quem ganhou.
      </Aviso>
    );
  }
  const preliminar = fase === "preliminar";
  const { lista, total } = await ranking(regiao.id);
  if (lista.length === 0) return <Aviso icone={TreePine} titulo="Nenhuma casa participou" />;
  const primeiros = lista.filter((c) => c.posicao === 1);
  const demais = lista.filter((c) => c.posicao > 1);
  const empate = primeiros.length > 1;

  return (
    <>
      {preliminar && (
        <div className="cartao mx-auto mb-10 flex max-w-3xl flex-col gap-4 border-2 border-dourado p-6 sm:flex-row sm:items-center">
          <Scale size={40} className="shrink-0 text-dourado-escuro" aria-hidden />
          <div className="flex-1">
            <p className="text-lg font-extrabold">Classificação preliminar, ainda não é o resultado final.</p>
            <p className="mt-1 text-tinta-suave">
              Os votos ainda podem ser conferidos. Quem inscreveu uma casa pode apresentar contestação até{" "}
              <strong>{formatarDataHora(DATAS.contestacaoFim)}</strong>. O resultado definitivo sai no dia{" "}
              <strong>{formatarData(DATAS.resultado)}</strong>.
            </p>
          </div>
          {contestacaoAberta(fase) && (
            <Link href={`/${regiao.id}/contestacao`} className="btn btn-verde shrink-0">
              Contestar <ArrowRight size={18} aria-hidden />
            </Link>
          )}
        </div>
      )}

      <div className={`mx-auto grid gap-6 ${empate ? "max-w-5xl md:grid-cols-2" : "max-w-xl"}`}>
        {primeiros.map((c) => (
          <article key={c.casa.id} className="cartao overflow-hidden ring-4 ring-dourado">
            <div className="relative aspect-[4/3] bg-verde-escuro">
              {c.casa.fotos[0] && <img src={c.casa.fotos[0]} alt="" className="h-full w-full object-cover" />}
              <span className="absolute top-3 left-3 drop-shadow-lg">
                <Enfeite posicao={1} tamanho={64} />
              </span>
            </div>
            <div className="p-6 text-center">
              <p className="text-sm font-extrabold tracking-widest text-vermelho uppercase">
                {empate ? "Empate no 1º lugar" : preliminar ? "1º lugar (preliminar)" : "Casa vencedora"}
              </p>
              <h2 className="mt-1 text-3xl font-extrabold">{nomeCasa(c.casa)}</h2>
              <p className="text-tinta-suave">{enderecoPublico(c.casa)}</p>
              <p className="mt-2 text-xl font-black text-verde">
                {c.votos} {c.votos === 1 ? "voto" : "votos"}
              </p>
            </div>
          </article>
        ))}
      </div>
      {empate && (
        <p className="mx-auto mt-6 max-w-2xl text-center text-tinta-suave">
          Houve empate no primeiro lugar. Pelo regulamento (item 8.3), o desempate é feito por uma comissão de três
          avaliadores, com os critérios de iluminação, criatividade, tema natalino e visibilidade.
        </p>
      )}
      {!preliminar && !empate && (
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg">
          Parabéns! {EVENTO.premio ? `O prêmio: ${EVENTO.premio}.` : "A entrega do prêmio será combinada pela organização."}
        </p>
      )}

      {demais.length > 0 && (
        <>
          <h2 className="font-festiva mt-14 text-center text-3xl font-bold text-vermelho">Classificação</h2>
          <ol className="cartao mx-auto mt-6 max-w-3xl divide-y divide-borda">
            {demais.map((c) => (
              <li key={c.casa.id} className="flex items-center gap-4 p-4">
                <span className="w-10 text-center text-lg font-black text-tinta-suave">{c.posicao}º</span>
                <span className="flex-1">
                  <strong>{nomeCasa(c.casa)}</strong>
                  <span className="block text-sm text-tinta-suave">{enderecoPublico(c.casa)}</span>
                </span>
                <span className="font-bold text-verde">{c.votos}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-center text-sm text-tinta-suave">Só o 1º lugar é premiado.</p>
        </>
      )}
      <p className="mt-8 text-center text-tinta-suave">
        Total de {total} votos válidos. Obrigado a todas as famílias que iluminaram o {regiao.nome}!
      </p>
    </>
  );
}

export default async function PaginaResultado({ params }: PageProps<"/[regiao]/resultado">) {
  const regiao = await regiaoDaRota(params);
  return (
    <>
      <Titulo titulo="Resultado" subtitulo={`A casa mais iluminada do ${regiao.nome}`} />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Suspense fallback={<p className="text-center text-tinta-suave">Carregando…</p>}>
          <Conteudo regiao={regiao} />
        </Suspense>
      </div>
    </>
  );
}
