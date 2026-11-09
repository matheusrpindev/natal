import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { MapaArea } from "@/components/MapaArea";
import { Titulo } from "@/components/Titulo";
import { EVENTO } from "@/lib/config";
import { RUAS } from "@/lib/ruas";
import { CRITERIOS_DESEMPATE, REGULAMENTO, RESUMO, type ItemRegulamento } from "./texto";

export const metadata: Metadata = { title: "Regulamento" };

const ordenar = (lista: typeof RUAS) => [...lista].sort((x, y) => x.nome.localeCompare(y.nome, "pt-BR"));
const INTEIRAS = ordenar(RUAS.filter((r) => r.situacao === "inteira"));
const PARCIAIS = ordenar(RUAS.filter((r) => r.situacao === "parcial"));

/** Converte *trecho* em negrito. */
function Negrito({ texto }: { texto: string }) {
  return texto.split(/\*([^*]+)\*/g).map((parte, i) => (i % 2 ? <strong key={i}>{parte}</strong> : <Fragment key={i}>{parte}</Fragment>));
}

function Paragrafo({ texto }: { texto: string }) {
  const m = texto.match(/^(\d+\.\d+\.)\s+([\s\S]*)$/);
  if (!m) return <p>{<Negrito texto={texto} />}</p>;
  return (
    <p className="grid grid-cols-[3.25rem_1fr] gap-1">
      <span className="font-extrabold text-verde tabular-nums">{m[1]}</span>
      <span>
        <Negrito texto={m[2]} />
      </span>
    </p>
  );
}

function ListaDeRuas({ titulo, ruas }: { titulo: string; ruas: typeof RUAS }) {
  return (
    <div>
      <h3 className="font-extrabold">{titulo}</h3>
      <ul className="mt-2 space-y-1 text-sm">
        {ruas.map((r) => (
          <li key={r.nome} className="flex justify-between gap-3 border-b border-borda pb-1">
            <span>{r.nome}</span>
            <span className="shrink-0 text-tinta-suave tabular-nums">{r.cep ?? "sem CEP informado"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Item({ item }: { item: ItemRegulamento }) {
  if (typeof item === "string") return <Paragrafo texto={item} />;
  if (item.tipo === "link")
    return (
      <Link href={item.href} className="btn btn-verde sm:ml-[3.25rem]">
        {item.texto} <ArrowRight size={18} aria-hidden />
      </Link>
    );
  if (item.tipo === "mapa")
    return (
      <div>
        <MapaArea />
        <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-tinta-suave">
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-6 rounded bg-dourado" /> rua integralmente incluída
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-6 rounded border-t-2 border-dashed border-[#ffb38a]" /> rua parcialmente
            incluída
          </span>
          <span>Passe o dedo ou o mouse sobre uma rua para ver o nome.</span>
        </p>
      </div>
    );
  if (item.tipo === "ruas")
    return (
      <div className="grid gap-6 rounded-xl bg-creme p-4 sm:grid-cols-2">
        <ListaDeRuas titulo={`Ruas integralmente incluídas (${INTEIRAS.length})`} ruas={INTEIRAS} />
        <ListaDeRuas titulo={`Ruas parcialmente incluídas (${PARCIAIS.length})`} ruas={PARCIAIS} />
      </div>
    );
  return (
    <table className="w-full overflow-hidden rounded-xl text-left text-sm sm:ml-[3.25rem] sm:w-[calc(100%-3.25rem)]">
      <thead className="bg-verde text-white">
        <tr>
          <th className="px-4 py-2 font-extrabold">Critério</th>
          <th className="px-4 py-2 text-right font-extrabold">Peso</th>
        </tr>
      </thead>
      <tbody>
        {CRITERIOS_DESEMPATE.map(([c, p]) => (
          <tr key={c} className="border-b border-borda bg-creme">
            <td className="px-4 py-2">{c}</td>
            <td className="px-4 py-2 text-right font-bold tabular-nums">{p}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function PaginaRegulamento() {
  return (
    <>
      <Titulo titulo="Regulamento oficial" subtitulo={`${EVENTO.nome} — ${EVENTO.ano}`} />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <nav aria-label="Seções do regulamento" className="cartao mb-6 p-5 sm:p-6">
          <p className="text-sm font-extrabold tracking-widest text-verde uppercase">Índice</p>
          <ol className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
            {REGULAMENTO.map((s) => (
              <li key={s.numero}>
                <a href={s.numero === 3 ? "#area" : `#secao-${s.numero}`} className="hover:text-vermelho hover:underline">
                  {s.numero}. {s.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="cartao space-y-10 p-6 sm:p-10">
          {REGULAMENTO.map((s) => (
            <section key={s.numero} id={s.numero === 3 ? "area" : `secao-${s.numero}`} className="scroll-mt-6">
              <h2 className="text-xl font-extrabold text-vermelho uppercase">
                {s.numero}. {s.titulo}
              </h2>
              <div className="mt-4 space-y-3">
                {s.itens.map((item, i) => (
                  <Item key={i} item={item} />
                ))}
              </div>
            </section>
          ))}
          <dl className="grid gap-x-6 gap-y-2 rounded-2xl bg-verde p-6 text-white sm:grid-cols-[auto_1fr]">
            <p className="font-festiva text-2xl text-dourado sm:col-span-2">
              {EVENTO.nome} — {EVENTO.ano}
            </p>
            {RESUMO.map(([k, v]) => (
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
