import { soDigitos } from "@/lib/cpf";
import { db, faseAtual } from "@/lib/db";
import { contestacaoAberta } from "@/lib/phase";

function texto(f: FormData, campo: string, max: number) {
  const v = f.get(campo);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function erro(msg: string, status = 400) {
  return Response.json({ erro: msg }, { status });
}

/** Contestação da classificação preliminar (regulamento 9.3 e 9.4). */
export async function POST(req: Request) {
  const { fase } = await faseAtual();
  if (!contestacaoAberta(fase)) return erro("O prazo de contestação não está aberto.", 403);

  let f: FormData;
  try {
    f = await req.formData();
  } catch {
    return erro("Envio inválido.");
  }
  if (texto(f, "site", 100)) return Response.json({ protocolo: "CT-OK" }); // robô

  const protocoloInscricao = texto(f, "protocoloInscricao", 20).toUpperCase().replace(/\s/g, "");
  const nome = texto(f, "nome", 120);
  const whatsapp = soDigitos(texto(f, "whatsapp", 20));
  const email = texto(f, "email", 160);
  const descricao = texto(f, "descricao", 3000);
  const evidencias = texto(f, "evidencias", 2000);
  if (!nome) return erro("Informe seu nome.");
  if (whatsapp.length < 10 || whatsapp.length > 11) return erro("Informe um WhatsApp válido com DDD.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return erro("E-mail inválido.");
  if (descricao.length < 20) return erro("Descreva o fato com pelo menos 20 caracteres.");

  const store = await db();
  const inscricoes = await store.listarInscricoes();
  const inscricao = inscricoes.find((i) => i.protocolo === protocoloInscricao);
  if (!inscricao) {
    return erro("Não encontramos esse protocolo de inscrição. Ele está na mensagem de confirmação da inscrição (ex.: NI-ABC123).");
  }
  const c = await store.criarContestacao({
    regiao: inscricao.regiao,
    protocoloInscricao,
    nome,
    whatsapp,
    email: email || null,
    descricao,
    evidencias: evidencias || null,
  });
  return Response.json({ protocolo: c.protocolo, criadoEm: c.criadoEm });
}
