import "server-only";
import { connection } from "next/server";
import { fasePelasDatas, type Fase } from "../phase";
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

/** Fase atual: manual (definida no painel) ou pelas datas do config. */
export async function faseAtual(): Promise<{ fase: Fase; manual: boolean }> {
  const store = await db();
  const manual = await store.lerFaseManual();
  if (manual) return { fase: manual, manual: true };
  return { fase: fasePelasDatas(new Date()), manual: false };
}

export type { Inscricao, StatusInscricao } from "./types";
