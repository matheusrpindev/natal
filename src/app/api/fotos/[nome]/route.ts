import { readFile } from "node:fs/promises";
import path from "node:path";
import { UPLOADS_DIR } from "@/lib/db/local";

/** Serve as fotos quando o site roda com armazenamento local (sem Supabase). */
export async function GET(_req: Request, ctx: RouteContext<"/api/fotos/[nome]">) {
  const { nome } = await ctx.params;
  if (!/^[\w-]+\.(jpg|png|webp)$/.test(nome)) return new Response("Não encontrado", { status: 404 });
  try {
    const dados = await readFile(path.join(UPLOADS_DIR, nome));
    const tipo = nome.endsWith(".png") ? "image/png" : nome.endsWith(".webp") ? "image/webp" : "image/jpeg";
    return new Response(dados, { headers: { "Content-Type": tipo, "Cache-Control": "public, max-age=86400" } });
  } catch {
    return new Response("Não encontrado", { status: 404 });
  }
}
