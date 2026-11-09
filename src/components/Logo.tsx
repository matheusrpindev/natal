/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

/** Cabeçalho: logo do evento + logo do Marcos Teles (ambos com contorno branco). */
export function Logo() {
  return (
    <div className="flex items-center gap-3 leading-none">
      <Link href="/" className="group" aria-label="Natal Iluminado do Scaffid II — início">
        <img
          src="/logo-natal-p.webp"
          alt="Natal Iluminado Scaffid 2"
          className="h-14 w-auto drop-shadow-[0_4px_10px_#0008] transition-transform group-hover:-rotate-2 sm:h-16"
        />
      </Link>
      <span className="h-10 w-px bg-white/25" aria-hidden />
      <img
        src="/marcos-logo-contorno-p.webp"
        alt="Uma iniciativa de Marcos Teles"
        className="h-11 w-auto drop-shadow-[0_4px_10px_#0008] sm:h-12"
      />
    </div>
  );
}
