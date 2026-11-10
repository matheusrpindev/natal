/* eslint-disable @next/next/no-img-element */
import { MapPin, Vote } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { enderecoPublico, nomeCasa, paraPublico } from "@/components/CartaoCasa";
import { db, faseAtual } from "@/lib/db";
import { regiaoOuNula } from "@/lib/regioes";

async function Detalhe({ params }: { params: Promise<{ id: string; regiao: string }> }) {
  const { id, regiao: r } = await params;
  const regiao = regiaoOuNula(r);
  if (!regiao) notFound();
  const store = await db();
  const ins = /^[0-9a-f-]{36}$/i.test(id) ? await store.buscarInscricao(id) : null;
  if (!ins || ins.status !== "aprovada" || ins.regiao !== regiao.id) notFound();
  const casa = paraPublico(ins, (c) => store.urlFoto(c));
  const { fase } = await faseAtual();
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href={`/${regiao.id}/casas`} className="font-bold text-verde hover:underline">
        ← Todas as casas
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-vermelho px-3 py-1 font-black text-white">
          #{String(casa.numero ?? 0).padStart(2, "0")}
        </span>
        <h1 className="font-festiva text-4xl font-bold text-verde sm:text-5xl">{nomeCasa(casa)}</h1>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-lg text-tinta-suave">
        <MapPin size={18} className="text-vermelho" aria-hidden /> {enderecoPublico(casa)}
      </p>
      {casa.descricao && <p className="mt-4 text-lg">{casa.descricao}</p>}
      {fase === "votacao" && (
        <Link href={`/${regiao.id}/votar?casa=${casa.id}`} className="btn btn-vermelho mt-6">
          <Vote size={18} aria-hidden /> Votar nesta casa
        </Link>
      )}
      <div className="mt-8 grid gap-4">
        {casa.fotos.map((f, i) => (
          <img key={f} src={f} alt={`Foto ${i + 1} de ${nomeCasa(casa)}`} className="cartao w-full object-contain" />
        ))}
      </div>
    </div>
  );
}

export default function PaginaCasa({ params }: PageProps<"/[regiao]/casas/[id]">) {
  return (
    <Suspense fallback={<p className="py-20 text-center text-tinta-suave">Carregando…</p>}>
      <Detalhe params={params} />
    </Suspense>
  );
}
