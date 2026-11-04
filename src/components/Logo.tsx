/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

/** Logo do cabeçalho: logo do Marcos Teles (com contorno branco) + nome do concurso. */
export function Logo({ claro = true }: { claro?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3 leading-none" aria-label="Natal Iluminado no Scaffid II — início">
      <img
        src="/marcos-logo-contorno-p.webp"
        alt="Marcos Teles"
        className="h-12 w-auto drop-shadow-[0_4px_10px_#0008] transition-transform group-hover:-rotate-3 sm:h-14"
      />
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
