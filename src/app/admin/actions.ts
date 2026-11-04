"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { COOKIE_ADMIN, exigirAdmin, tokenAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { isFase } from "@/lib/phase";
import { adminPassword, iguais } from "@/lib/secrets";

export async function entrar(_anterior: string | null, dados: FormData): Promise<string | null> {
  const senha = adminPassword();
  if (!senha) return "Senha de administrador não configurada (ADMIN_PASSWORD).";
  const digitada = String(dados.get("senha") ?? "");
  if (!iguais(digitada, senha)) {
    await new Promise((r) => setTimeout(r, 1000));
    return "Senha incorreta.";
  }
  (await cookies()).set(COOKIE_ADMIN, tokenAdmin()!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return null;
}

export async function sair() {
  (await cookies()).delete(COOKIE_ADMIN);
}

export async function mudarStatus(id: string, status: "aprovada" | "recusada" | "pendente") {
  await exigirAdmin();
  const store = await db();
  await store.mudarStatus(id, status);
  revalidatePath("/", "layout");
}

export async function definirFase(fase: string) {
  await exigirAdmin();
  if (!isFase(fase)) throw new Error("Fase inválida.");
  const store = await db();
  await store.salvarFase(fase);
  revalidatePath("/", "layout");
}
