import { headers } from "next/headers";
import { cpfValido, soDigitos } from "@/lib/cpf";
import { db, faseAtual } from "@/lib/db";
import { hmac } from "@/lib/secrets";

function erro(msg: string, status = 400) {
  return Response.json({ erro: msg }, { status });
}

export async function POST(req: Request) {
  const { fase } = await faseAtual();
  if (fase !== "votacao") return erro("A votação não está aberta no momento.", 403);

  const corpo = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!corpo) return erro("Envio inválido.");
  if (corpo.site) return Response.json({ ok: true }); // robô

  const nome = typeof corpo.nome === "string" ? corpo.nome.trim().slice(0, 120) : "";
  const cpf = typeof corpo.cpf === "string" ? soDigitos(corpo.cpf) : "";
  const casaId = typeof corpo.casa === "string" ? corpo.casa : "";
  if (nome.length < 3) return erro("Informe seu nome completo.");
  if (!cpfValido(cpf)) return erro("CPF inválido. Confira os números.");
  if (corpo.aceite !== true) return erro("Confirme a declaração para votar.");

  const store = await db();
  const casa = /^[0-9a-f-]{36}$/i.test(casaId) ? await store.buscarInscricao(casaId) : null;
  if (!casa || casa.status !== "aprovada") return erro("Casa não encontrada.", 404);

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || null;
  const resultado = await store.registrarVoto({
    inscricaoId: casa.id,
    cpfHash: hmac(cpf, "cpf"),
    nome,
    ipHash: ip ? hmac(ip, "ip") : null,
    userAgent: h.get("user-agent")?.slice(0, 300) ?? null,
  });
  if (resultado === "cpf-ja-votou") return erro("Este CPF já votou. Cada CPF pode votar apenas uma vez.", 409);
  return Response.json({ ok: true });
}
