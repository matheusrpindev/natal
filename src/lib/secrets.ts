import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const DEV_SECRET = "dev-secret-troque-em-producao";
const DEV_ADMIN_PASSWORD = "natal2026";
const isProd = process.env.NODE_ENV === "production";

function appSecret() {
  const s = process.env.APP_SECRET;
  if (s && s.length >= 16) return s;
  if (isProd) throw new Error("Defina APP_SECRET (mínimo 16 caracteres) nas variáveis de ambiente.");
  return DEV_SECRET;
}

export function adminPassword(): string | null {
  const p = process.env.ADMIN_PASSWORD;
  if (p) return p;
  return isProd ? null : DEV_ADMIN_PASSWORD;
}

export function hmac(valor: string, contexto: string) {
  return createHmac("sha256", appSecret()).update(`${contexto}:${valor}`).digest("hex");
}

export function iguais(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}
