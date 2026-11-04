import "server-only";
import { cookies } from "next/headers";
import { adminPassword, hmac, iguais } from "./secrets";

export const COOKIE_ADMIN = "ni_admin";

export function tokenAdmin(): string | null {
  const senha = adminPassword();
  return senha ? hmac(senha, "admin-sessao") : null;
}

export async function estaLogado() {
  const token = tokenAdmin();
  const atual = (await cookies()).get(COOKIE_ADMIN)?.value;
  return Boolean(token && atual && iguais(atual, token));
}

export async function exigirAdmin() {
  if (!(await estaLogado())) throw new Error("Acesso negado.");
}
