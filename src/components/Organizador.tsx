/* eslint-disable @next/next/no-img-element */
import { existsSync } from "node:fs";
import path from "node:path";
import { AtSign, User } from "lucide-react";
import { EVENTO } from "@/lib/config";

/** Foto do organizador: salve em public/marcos.jpg (fundo branco fica ótimo). */
const FOTO = "/marcos.jpg";
const temFoto = existsSync(path.join(process.cwd(), "public", FOTO));

export function Organizador() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-14">
      <div className="cartao grid items-center gap-6 overflow-hidden md:grid-cols-[18rem_1fr]">
        <div className="relative flex justify-center bg-white md:h-full">
          {temFoto ? (
            <img src={FOTO} alt={`${EVENTO.organizador} de gorro de Papai Noel`} className="h-80 w-full object-contain object-bottom md:h-full" />
          ) : (
            <div className="flex h-64 w-full items-center justify-center text-borda" aria-hidden>
              <User size={96} strokeWidth={1.5} />
            </div>
          )}
          <div className="bengala absolute inset-x-0 bottom-0 h-2 md:inset-y-0 md:right-0 md:left-auto md:h-auto md:w-2" />
        </div>
        <div className="p-6 pt-0 text-center md:p-8 md:pl-2 md:text-left">
          <p className="text-sm font-extrabold tracking-[0.2em] text-verde uppercase">Uma iniciativa de</p>
          <h2 className="mt-2">
            <img src="/marcos-logo-contorno.webp" alt={EVENTO.organizador} className="mx-auto h-28 w-auto drop-shadow-[0_4px_10px_#5a2a0a33] sm:h-32 md:mx-0" />
          </h2>
          <p className="mt-4 text-lg text-tinta-suave">
            O Natal Iluminado nasceu para valorizar quem capricha na decoração e para unir os vizinhos do Scaffid II na
            época mais bonita do ano. Participe, passeie pelo bairro e ajude a escolher a casa mais iluminada!
          </p>
          <a
            href={`https://www.instagram.com/${EVENTO.instagram}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 font-bold text-verde underline-offset-4 hover:underline"
          >
            <AtSign size={18} aria-hidden /> {EVENTO.instagram} no Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
