import { TriangleAlert } from "lucide-react";

/** Mensagem por cima do mapa quando algo dá errado (em vez de um quadrado vazio). */
export function AvisoMapa({ texto }: { texto: string | null }) {
  if (!texto) return null;
  return (
    <div role="alert" className="absolute inset-x-3 bottom-3 z-[1000] flex items-start gap-2 rounded-xl bg-white/95 p-3 text-sm font-bold text-vermelho shadow-lg">
      <TriangleAlert size={16} className="mt-0.5 shrink-0" aria-hidden /> {texto}
    </div>
  );
}
