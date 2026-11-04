import "server-only";
import type { CasaPublica } from "@/components/CartaoCasa";
import { casasAprovadas } from "./casas";
import { db } from "./db";

export interface Colocacao {
  posicao: number;
  votos: number;
  casa: CasaPublica;
}

/** Ranking por votos. Empates dividem a mesma posição. */
export async function ranking(): Promise<{ lista: Colocacao[]; total: number }> {
  const store = await db();
  const [casas, contagem] = await Promise.all([casasAprovadas(), store.contarVotos()]);
  const ordenadas = casas
    .map((casa) => ({ casa, votos: contagem[casa.id] ?? 0 }))
    .sort((a, b) => b.votos - a.votos || (a.casa.numero ?? 0) - (b.casa.numero ?? 0));
  const lista: Colocacao[] = [];
  ordenadas.forEach((c, i) => {
    const anterior = lista[i - 1];
    lista.push({ ...c, posicao: anterior && anterior.votos === c.votos ? anterior.posicao : i + 1 });
  });
  return { lista, total: ordenadas.reduce((s, c) => s + c.votos, 0) };
}
