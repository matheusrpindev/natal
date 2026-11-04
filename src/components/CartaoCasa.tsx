/* eslint-disable @next/next/no-img-element */
import type { Inscricao } from "@/lib/db";

export interface CasaPublica {
  id: string;
  numero: number | null;
  titulo: string | null;
  rua: string;
  numeroCasa: string;
  descricao: string | null;
  fotos: string[];
}

export function paraPublico(i: Inscricao, urlFoto: (c: string) => string): CasaPublica {
  return {
    id: i.id,
    numero: i.numero,
    titulo: i.titulo,
    rua: i.rua,
    numeroCasa: i.numeroCasa,
    descricao: i.descricao,
    fotos: i.fotos.map(urlFoto),
  };
}

export function nomeCasa(c: Pick<CasaPublica, "numero" | "titulo">) {
  return c.titulo || `Casa #${String(c.numero ?? 0).padStart(2, "0")}`;
}

export function CartaoCasa({ casa, children }: { casa: CasaPublica; children?: React.ReactNode }) {
  return (
    <article className="cartao flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3] bg-verde-escuro">
        {casa.fotos[0] ? (
          <img src={casa.fotos[0]} alt={`Decoração de ${nomeCasa(casa)}`} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl">🏠</div>
        )}
        <span className="absolute top-3 left-3 rounded-full bg-vermelho px-3 py-1 text-sm font-black text-white shadow-lg">
          #{String(casa.numero ?? 0).padStart(2, "0")}
        </span>
        {casa.fotos.length > 1 && (
          <span className="absolute right-3 bottom-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white">
            📷 {casa.fotos.length}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="text-lg leading-tight font-extrabold">{nomeCasa(casa)}</h3>
        <p className="text-sm text-tinta-suave">
          📍 {casa.rua}, {casa.numeroCasa}
        </p>
        {casa.descricao && <p className="mt-1 line-clamp-3 text-sm">{casa.descricao}</p>}
        {children && <div className="mt-auto pt-3">{children}</div>}
      </div>
    </article>
  );
}
