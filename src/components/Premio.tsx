/* eslint-disable @next/next/no-img-element */
import { EVENTO } from "@/lib/config";
import { Enfeite } from "./Icones";

/** Foto do prêmio com o aviso de imagem ilustrativa. */
export function FotoPremio({ className = "" }: { className?: string }) {
  return (
    <figure className={`relative overflow-hidden rounded-3xl border-4 border-dourado bg-verde-noite shadow-[0_20px_60px_#000a] ${className}`}>
      <img src={EVENTO.fotoPremio} alt="Kit churrasco com carnes, linguiças, frango, queijo e pão de alho" className="aspect-[600/366] w-full object-cover" />
      <span className="absolute top-3 left-3">
        <Enfeite posicao={1} tamanho={58} />
      </span>
      <figcaption className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent px-4 pt-8 pb-2 text-right text-xs font-bold text-white/90">
        Imagem meramente ilustrativa
      </figcaption>
    </figure>
  );
}

/** Faixa do prêmio usada nas páginas das regiões. */
export function SecaoPremio({ regiao }: { regiao?: string }) {
  return (
    <section className="bg-verde text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2">
        <div>
          <p className="text-sm font-extrabold tracking-[0.2em] text-dourado uppercase">Prêmio do 1º lugar</p>
          <h2 className="font-festiva mt-2 text-5xl font-bold text-dourado sm:text-6xl">Kit churrasco</h2>
          <p className="mt-4 max-w-xl text-lg text-white/90">
            A casa mais votada {regiao ? `do ${regiao}` : "de cada região"} ganha <strong className="text-white">{EVENTO.premio}</strong>.
            Só o 1º lugar é premiado.
          </p>
        </div>
        <FotoPremio />
      </div>
    </section>
  );
}
