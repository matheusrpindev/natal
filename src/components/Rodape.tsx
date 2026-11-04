import { TreePine } from "lucide-react";
import Link from "next/link";
import { EVENTO } from "@/lib/config";

export function Rodape() {
  return (
    <footer className="mt-auto bg-verde-noite text-white/80">
      <div className="bengala h-2" />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center text-sm">
        <p className="font-festiva flex items-center gap-2 text-2xl text-dourado">
          <TreePine size={22} aria-hidden /> Feliz Natal, Scaffid II!
        </p>
        <p>
          {EVENTO.nome} {EVENTO.ano} · Uma iniciativa de <strong className="text-white">{EVENTO.organizador}</strong>
        </p>
        <p className="flex gap-4">
          <Link href="/regulamento" className="underline-offset-4 hover:underline">
            Regulamento
          </Link>
          <Link href="/admin" className="underline-offset-4 hover:underline">
            Organização
          </Link>
        </p>
      </div>
    </footer>
  );
}
