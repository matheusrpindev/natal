import { Neve } from "./Neve";

/** Faixa de título usada no topo das páginas internas. */
export function Titulo({ titulo, subtitulo }: { titulo: string; subtitulo?: string }) {
  return (
    <section className="ceu-noturno relative overflow-hidden text-white">
      <Neve />
      <div className="relative mx-auto max-w-6xl px-4 py-10 text-center sm:py-14">
        <h1 className="font-festiva brilho-dourado text-4xl font-bold sm:text-6xl">{titulo}</h1>
        {subtitulo && <p className="mx-auto mt-3 max-w-2xl text-white/85 sm:text-lg">{subtitulo}</p>}
      </div>
    </section>
  );
}

export function Aviso({ emoji, titulo, children }: { emoji: string; titulo: string; children?: React.ReactNode }) {
  return (
    <div className="cartao mx-auto max-w-xl p-8 text-center">
      <div className="text-5xl" aria-hidden>
        {emoji}
      </div>
      <h2 className="font-festiva mt-3 text-3xl font-bold text-vermelho">{titulo}</h2>
      {children && <div className="mt-3 text-tinta-suave">{children}</div>}
    </div>
  );
}
