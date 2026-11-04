import Link from "next/link";
import { Estrela } from "./Icones";

/**
 * Logo provisório em texto. Quando o logo oficial chegar, salve em
 * public/logo.png e troque o conteúdo do Link por:
 *   <img src="/logo.png" alt="Natal Iluminado no Scaffid II" className="h-12 w-auto" />
 */
export function Logo({ claro = true }: { claro?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2 leading-none" aria-label="Natal Iluminado no Scaffid II — início">
      <span className="transition-transform group-hover:rotate-12">
        <Estrela />
      </span>
      <span className="flex flex-col">
        <span className={`font-festiva text-2xl font-bold whitespace-nowrap sm:text-3xl ${claro ? "brilho-dourado" : "text-vermelho"}`}>
          Natal Iluminado
        </span>
        <span className={`text-[0.7rem] font-extrabold tracking-[0.25em] uppercase ${claro ? "text-white/85" : "text-verde"}`}>
          no Scaffid II
        </span>
      </span>
    </Link>
  );
}
