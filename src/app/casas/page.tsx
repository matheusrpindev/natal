import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CartaoCasa } from "@/components/CartaoCasa";
import { Aviso, Titulo } from "@/components/Titulo";
import { casasAprovadas } from "@/lib/casas";
import { faseAtual } from "@/lib/db";

export const metadata: Metadata = { title: "Casas participantes" };

async function Lista() {
  const [casas, { fase }] = await Promise.all([casasAprovadas(), faseAtual()]);
  if (casas.length === 0) {
    return (
      <Aviso emoji="🎄" titulo="Nenhuma casa ainda">
        As casas aparecem aqui assim que a inscrição é aprovada pela organização.
      </Aviso>
    );
  }
  return (
    <>
      <p className="mb-6 text-center text-tinta-suave">
        {casas.length} {casas.length === 1 ? "casa participando" : "casas participando"}. Passeie pelo bairro e confira
        de pertinho! ✨
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {casas.map((c) => (
          <CartaoCasa key={c.id} casa={c}>
            <div className="flex flex-wrap gap-2">
              <Link href={`/casas/${c.id}`} className="btn btn-contorno px-4 py-2 text-sm text-verde">
                Ver fotos
              </Link>
              {fase === "votacao" && (
                <Link href={`/votar?casa=${c.id}`} className="btn btn-vermelho px-4 py-2 text-sm">
                  Votar nesta casa
                </Link>
              )}
            </div>
          </CartaoCasa>
        ))}
      </div>
    </>
  );
}

export default function PaginaCasas() {
  return (
    <>
      <Titulo titulo="Casas participantes" subtitulo="Conheça as decorações que estão iluminando o Scaffid II." />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Suspense fallback={<p className="text-center text-tinta-suave">Carregando casas…</p>}>
          <Lista />
        </Suspense>
      </div>
    </>
  );
}
