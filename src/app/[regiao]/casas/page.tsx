import type { Metadata } from "next";
import { TreePine } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { CartaoCasa } from "@/components/CartaoCasa";
import { MapaCasas } from "@/components/MapaCasas";
import { Aviso, Titulo } from "@/components/Titulo";
import { casasAprovadas } from "@/lib/casas";
import { faseAtual } from "@/lib/db";
import type { Regiao } from "@/lib/regioes";
import { regiaoDaRota } from "@/lib/rota";

export const metadata: Metadata = { title: "Casas participantes" };

async function Lista({ regiao }: { regiao: Regiao }) {
  const [casas, { fase }] = await Promise.all([casasAprovadas(regiao.id), faseAtual()]);
  if (casas.length === 0) {
    return (
      <Aviso icone={TreePine} titulo="Nenhuma casa ainda">
        As casas aparecem aqui assim que a inscrição é aprovada pela organização.
      </Aviso>
    );
  }
  return (
    <>
      <p className="mb-6 text-center text-tinta-suave">
        {casas.length} {casas.length === 1 ? "casa participando" : "casas participando"}. Passeie pelo bairro e confira
        de pertinho!
      </p>
      {casas.some((c) => c.latitude != null) && (
        <div className="mb-10">
          <MapaCasas regiao={regiao.id} casas={casas} votacao={fase === "votacao"} />
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {casas.map((c) => (
          <CartaoCasa key={c.id} casa={c}>
            <div className="flex flex-wrap gap-2">
              <Link href={`/${regiao.id}/casas/${c.id}`} className="btn btn-contorno px-4 py-2 text-sm text-verde">
                Ver fotos
              </Link>
              {fase === "votacao" && (
                <Link href={`/${regiao.id}/votar?casa=${c.id}`} className="btn btn-vermelho px-4 py-2 text-sm">
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

export default async function PaginaCasas({ params }: PageProps<"/[regiao]/casas">) {
  const regiao = await regiaoDaRota(params);
  return (
    <>
      <Titulo titulo="Casas participantes" subtitulo={`Conheça as decorações que estão iluminando o ${regiao.nome}.`} />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Suspense fallback={<p className="text-center text-tinta-suave">Carregando casas…</p>}>
          <Lista regiao={regiao} />
        </Suspense>
      </div>
    </>
  );
}
