import "server-only";
import { connection } from "next/server";
import { FASE_INICIAL, isFase, type Fase } from "../phase";
import { localStore } from "./local";
import { supabaseStore } from "./supabase";
import type { Store } from "./types";

export const usandoSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

let avisou = false;

const base: Store = usandoSupabase ? supabaseStore : localStore;

/**
 * Toda leitura passa por connection() para que o Next não tente
 * pré-renderizar dados que mudam a cada acesso.
 */
export async function db(): Promise<Store> {
  await connection();
  if (!usandoSupabase && !avisou && process.env.NODE_ENV === "production") {
    avisou = true;
    console.warn("[natal-iluminado] Supabase não configurado: usando arquivo local (.data). Na Vercel os dados se perdem.");
  }
  return base;
}

/** Fase atual, definida pela organização no painel. */
export async function faseAtual(): Promise<{ fase: Fase }> {
  const store = await db();
  const fase = await store.lerFase();
  return { fase: isFase(fase) ? fase : FASE_INICIAL };
}

export type { Contestacao, Inscricao, StatusContestacao, StatusInscricao } from "./types";
