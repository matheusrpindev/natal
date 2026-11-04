/* eslint-disable @next/next/no-img-element */
import { EVENTO } from "@/lib/config";

/** "Uma iniciativa de" + logo do Marcos Teles (com contorno branco, para fundos escuros). */
export function Iniciativa({ tamanho = "h-16 sm:h-20", className = "" }: { tamanho?: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="text-right text-[0.7rem] leading-tight font-extrabold tracking-[0.2em] text-white/80 uppercase">
        Uma
        <br />
        iniciativa de
      </span>
      <img
        src="/marcos-logo-contorno.webp"
        alt={EVENTO.organizador}
        className={`${tamanho} w-auto drop-shadow-[0_6px_14px_#0009]`}
      />
    </div>
  );
}
