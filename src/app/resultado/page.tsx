/* eslint-disable @next/next/no-img-element */
import { Gift, TreePine } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { nomeCasa } from "@/components/CartaoCasa";
import { Enfeite } from "@/components/Icones";
import { Aviso, Titulo } from "@/components/Titulo";
import { DATAS, formatarData } from "@/lib/config";
import { faseAtual } from "@/lib/db";
import { ranking } from "@/lib/ranking";

export const metadata: Metadata = { title: "Resultado" };


async function Conteudo() {
  const { fase } = await faseAtual();
  if (fase !== "resultado") {
    return (
      <Aviso icone={Gift} titulo="O resultado ainda é segredo!">
        A divulgação será no dia <strong>{formatarData(DATAS.resultado)}</strong>. Até lá, nem o Papai Noel sabe quem
        ganhou.
      </Aviso>
    );
  }
  const { lista, total } = await ranking();
  if (lista.length === 0) return <Aviso icone={TreePine} titulo="Nenhuma casa participou" />;
  const podio = lista.filter((c) => c.posicao <= 3);
  const demais = lista.filter((c) => c.posicao > 3);
  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        {podio.map((c) => (
          <article
            key={c.casa.id}
            className={`cartao overflow-hidden ${c.posicao === 1 ? "ring-4 ring-dourado md:order-2 md:-mt-4" : c.posicao === 2 ? "md:order-1" : "md:order-3"}`}
          >
            <div className="relative aspect-[4/3] bg-verde-escuro">
              {c.casa.fotos[0] && <img src={c.casa.fotos[0]} alt="" className="h-full w-full object-cover" />}
              <span className="absolute top-2 left-3 drop-shadow-lg">
                <Enfeite posicao={c.posicao as 1 | 2 | 3} tamanho={c.posicao === 1 ? 56 : 46} />
              </span>
            </div>
            <div className="p-5 text-center">
              <p className="text-sm font-extrabold tracking-widest text-vermelho uppercase">{c.posicao}º lugar</p>
              <h2 className="mt-1 text-2xl font-extrabold">{nomeCasa(c.casa)}</h2>
              <p className="text-tinta-suave">
                {c.casa.rua}, {c.casa.numeroCasa}
              </p>
              <p className="mt-2 text-lg font-black text-verde">
                {c.votos} {c.votos === 1 ? "voto" : "votos"}
              </p>
            </div>
          </article>
        ))}
      </div>
      {demais.length > 0 && (
        <ol className="cartao mt-10 divide-y divide-borda">
          {demais.map((c) => (
            <li key={c.casa.id} className="flex items-center gap-4 p-4">
              <span className="w-10 text-center text-lg font-black text-tinta-suave">{c.posicao}º</span>
              <span className="flex-1">
                <strong>{nomeCasa(c.casa)}</strong>
                <span className="block text-sm text-tinta-suave">
                  {c.casa.rua}, {c.casa.numeroCasa}
                </span>
              </span>
              <span className="font-bold text-verde">{c.votos}</span>
            </li>
          ))}
        </ol>
      )}
      <p className="mt-8 text-center text-tinta-suave">
        Total de {total} votos. Obrigado a todas as famílias que iluminaram o Scaffid II!
      </p>
    </>
  );
}

export default function PaginaResultado() {
  return (
    <>
      <Titulo titulo="Resultado" subtitulo="As casas mais iluminadas do Scaffid II" />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Suspense fallback={<p className="text-center text-tinta-suave">Carregando…</p>}>
          <Conteudo />
        </Suspense>
      </div>
    </>
  );
}
