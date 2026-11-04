import { EVENTO } from "@/lib/config";
import { soDigitos } from "@/lib/cpf";
import { db, faseAtual } from "@/lib/db";
import type { FotoUpload } from "@/lib/db/types";

const TIPOS = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 3 * 1024 * 1024;

function texto(f: FormData, campo: string, max: number) {
  const v = f.get(campo);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function erro(msg: string, status = 400) {
  return Response.json({ erro: msg }, { status });
}

export async function POST(req: Request) {
  const { fase } = await faseAtual();
  if (fase !== "inscricoes") return erro("As inscrições não estão abertas no momento.", 403);

  let f: FormData;
  try {
    f = await req.formData();
  } catch {
    return erro("Envio inválido.");
  }
  if (texto(f, "site", 100)) return Response.json({ protocolo: "NI-OK" }); // robô

  const responsavel = texto(f, "responsavel", 120);
  const whatsapp = texto(f, "whatsapp", 20);
  const rua = texto(f, "rua", 120);
  const numeroCasa = texto(f, "numeroCasa", 12);
  if (!responsavel || !rua || !numeroCasa) return erro("Preencha nome, rua e número.");
  const tel = soDigitos(whatsapp);
  if (tel.length < 10 || tel.length > 11) return erro("Informe um WhatsApp válido com DDD.");
  if (!f.get("aceite")) return erro("É preciso aceitar o regulamento.");
  const email = texto(f, "email", 160);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return erro("E-mail inválido.");

  const arquivos = f.getAll("fotos").filter((x): x is File => x instanceof File && x.size > 0);
  if (arquivos.length === 0) return erro("Envie pelo menos uma foto.");
  if (arquivos.length > EVENTO.maxFotos) return erro(`Envie no máximo ${EVENTO.maxFotos} fotos.`);
  const fotos: FotoUpload[] = [];
  for (const a of arquivos) {
    if (!TIPOS.has(a.type)) return erro("As fotos precisam ser JPG, PNG ou WEBP.");
    if (a.size > MAX_BYTES) return erro("Cada foto pode ter no máximo 3 MB.");
    fotos.push({ nome: a.name, tipo: a.type, dados: Buffer.from(await a.arrayBuffer()) });
  }

  const store = await db();
  const nova = await store.criarInscricao(
    {
      responsavel,
      whatsapp: tel,
      email: email || null,
      rua,
      numeroCasa,
      complemento: texto(f, "complemento", 120) || null,
      titulo: texto(f, "titulo", 60) || null,
      descricao: texto(f, "descricao", 500) || null,
    },
    fotos,
  );
  return Response.json({ protocolo: nova.protocolo });
}
