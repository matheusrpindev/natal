import { randomBytes } from "node:crypto";

const ALFABETO = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function gerarProtocolo() {
  const b = randomBytes(6);
  let s = "";
  for (const x of b) s += ALFABETO[x % ALFABETO.length];
  return `NI-${s}`;
}

export function extensao(tipo: string) {
  if (tipo === "image/png") return "png";
  if (tipo === "image/webp") return "webp";
  return "jpg";
}
