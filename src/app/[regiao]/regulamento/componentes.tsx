import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { MapaArea } from "@/components/MapaArea";
import type { Regiao } from "@/lib/regioes";
import { ordenarRuas, type Rua } from "@/lib/ruas";
import { CRITERIOS_DESEMPATE, type ItemRegulamento } from "./texto";

/** Converte *trecho* em negrito. */
export function Negrito({ texto }: { texto: string }) {
  return texto
    .split(/\*([^*]+)\*/g)
    .map((parte, i) => (i % 2 ? <strong key={i}>{parte}</strong> : <Fragment key={i}>{parte}</Fragment>));
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

function ListaDeRuas({ titulo, ruas }: { titulo: string; ruas: Rua[] }) {
  return (
    <div>
      <h3 className="font-extrabold">{titulo}</h3>
      <ul className="mt-2 space-y-1 text-sm">
        {ruas.map((r) => (
          <li key={r.nome} className="flex justify-between gap-3 border-b border-borda pb-1">
            <span>{r.nome}</span>
            <span className="shrink-0 text-right text-tinta-suave tabular-nums">
              {r.ceps.length ? r.ceps.join(", ") : "sem CEP informado"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ListasDeRuas({ regiao }: { regiao: Regiao }) {
  const ruas = ordenarRuas(regiao.ruas);
  const inteiras = ruas.filter((r) => r.situacao === "inteira");
  const parciais = ruas.filter((r) => r.situacao === "parcial");
  return (
    <div className="grid gap-6 rounded-xl bg-creme p-4 sm:grid-cols-2">
      <ListaDeRuas titulo={`Ruas integralmente incluídas (${inteiras.length})`} ruas={inteiras} />
      <ListaDeRuas titulo={`Ruas parcialmente incluídas (${parciais.length})`} ruas={parciais} />
    </div>
  );
}

export function MapaComLegenda({ regiao }: { regiao: Regiao }) {
  return (
    <div>
      <MapaArea regiao={regiao.id} />
      <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-tinta-suave">
        <span className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-6 rounded bg-dourado" /> rua integralmente incluída
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-6 rounded border-t-2 border-dashed border-[#ffb38a]" /> rua parcialmente incluída
        </span>
        <span className="nao-imprimir">Passe o dedo ou o mouse sobre uma rua para ver o nome.</span>
      </p>
    </div>
  );
}

export function Item({ item, regiao }: { item: ItemRegulamento; regiao: Regiao }) {
  if (typeof item === "string") return <Paragrafo texto={item} />;
  if (item.tipo === "link")
    return (
      <Link href={item.href} className="nao-imprimir btn btn-verde sm:ml-[3.25rem]">
        {item.texto} <ArrowRight size={18} aria-hidden />
      </Link>
    );
  if (item.tipo === "mapa") return <MapaComLegenda regiao={regiao} />;
  if (item.tipo === "ruas") return <ListasDeRuas regiao={regiao} />;
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

export const urlPdf = (regiao: Regiao) => `/regulamentos/regulamento-natal-iluminado-${regiao.id}.pdf`;
