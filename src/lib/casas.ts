import "server-only";
import { paraPublico, type CasaPublica } from "@/components/CartaoCasa";
import { db } from "./db";

/** Casas aprovadas, ordenadas pelo número, sem dados pessoais. */
export async function casasAprovadas(): Promise<CasaPublica[]> {
  const store = await db();
  const lista = await store.listarInscricoes("aprovada");
  return lista
    .sort((a, b) => (a.numero ?? 0) - (b.numero ?? 0))
    .map((i) => paraPublico(i, (c) => store.urlFoto(c)));
}
