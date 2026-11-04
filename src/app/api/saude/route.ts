import { connection } from "next/server";
import { db } from "@/lib/db";

/**
 * Verificação de saúde. A Vercel chama esta rota uma vez por dia (vercel.json → crons),
 * o que faz uma consulta ao banco e impede o Supabase gratuito de pausar por inatividade.
 */
export async function GET() {
  await connection(); // sempre em tempo real (nunca pré-renderizada no build)
  try {
    const store = await db();
    await store.lerFase();
    return Response.json({ ok: true, em: new Date().toISOString() });
  } catch (e) {
    console.error("[saude]", e);
    return Response.json({ ok: false }, { status: 503 });
  }
}
