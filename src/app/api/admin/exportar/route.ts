import { estaLogado } from "@/lib/admin";
import { db } from "@/lib/db";
import { ranking } from "@/lib/ranking";

function csv(linhas: (string | number | null)[][]) {
  const esc = (v: string | number | null) => {
    let s = String(v ?? "");
    if (/^[=+\-@]/.test(s)) s = `'${s}`; // evita fórmulas no Excel
    return `"${s.replace(/"/g, '""')}"`;
  };
  // BOM para o Excel abrir acentos corretamente
  return "﻿" + linhas.map((l) => l.map(esc).join(";")).join("\r\n");
}

export async function GET(req: Request) {
  if (!(await estaLogado())) return new Response("Acesso negado", { status: 401 });
  const tipo = new URL(req.url).searchParams.get("tipo");
  let conteudo: string;
  if (tipo === "ranking") {
    const { lista } = await ranking();
    conteudo = csv([
      ["Posição", "Número", "Casa", "Rua", "Nº", "Votos"],
      ...lista.map((c) => [c.posicao, c.casa.numero, c.casa.titulo, c.casa.rua, c.casa.numeroCasa, c.votos]),
    ]);
  } else {
    const store = await db();
    const lista = await store.listarInscricoes();
    conteudo = csv([
      ["Protocolo", "Status", "Número", "Responsável", "WhatsApp", "E-mail", "CEP", "Rua", "Nº", "Complemento", "Nome da casa", "Latitude", "Longitude", "Autoriza número e mapa", "Enviada em"],
      ...lista.map((i) => [
        i.protocolo,
        i.status,
        i.numero,
        i.responsavel,
        i.whatsapp,
        i.email,
        i.cep,
        i.rua,
        i.numeroCasa,
        i.complemento,
        i.titulo,
        i.latitude,
        i.longitude,
        i.autorizaLocalizacao ? "sim" : "não",
        i.criadoEm,
      ]),
    ]);
  }
  return new Response(conteudo, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="natal-iluminado-${tipo === "ranking" ? "ranking" : "inscricoes"}.csv"`,
    },
  });
}
