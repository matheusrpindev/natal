import { AtSign, TreePine } from "lucide-react";
import Link from "next/link";
import { EVENTO } from "@/lib/config";
import { LISTA_REGIOES } from "@/lib/regioes";
import { Iniciativa } from "./Iniciativa";

export function Rodape() {
  return (
    <footer className="mt-auto bg-verde-noite text-white/80">
      <div className="bengala h-2" />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center text-sm">
        <p className="font-festiva flex items-center gap-2 text-2xl text-dourado">
          <TreePine size={22} aria-hidden /> Feliz Natal!
        </p>
        <Iniciativa tamanho="h-14 sm:h-16" />
        <p>Natal Iluminado {EVENTO.ano} · Scaffid II e Parque Residencial Marengo</p>
        <a
          href={`https://www.instagram.com/${EVENTO.instagram}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-bold text-white underline-offset-4 hover:underline"
        >
          <AtSign size={16} aria-hidden /> {EVENTO.instagram}
        </a>
        <p className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <Link href="/" className="underline-offset-4 hover:underline">
            Início
          </Link>
          {LISTA_REGIOES.map((r) => (
            <Link key={r.id} href={`/${r.id}`} className="underline-offset-4 hover:underline">
              {r.nomeCurto}
            </Link>
          ))}
          <Link href="/privacidade" className="underline-offset-4 hover:underline">
            Privacidade
          </Link>
          <Link href="/admin" className="underline-offset-4 hover:underline">
            Organização
          </Link>
        </p>
      </div>
    </footer>
  );
}
