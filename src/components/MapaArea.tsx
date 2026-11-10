"use client";

import type { Map as MapaLeaflet, Polyline } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { desenharRuas, destacarRua, useMapa, type L as Leaflet } from "@/lib/mapaBase";
import { AvisoMapa } from "./AvisoMapa";
import type { RegiaoId } from "@/lib/regioes";
import type { Rua } from "@/lib/ruas";

/** Mapa só para consulta: a área do concurso, as ruas participantes e (opcional) uma rua em destaque. */
export function MapaArea({
  regiao,
  destaque,
  mostrarRuas = true,
  altura = "h-80 sm:h-[28rem]",
}: {
  regiao: RegiaoId;
  destaque?: Rua | null;
  mostrarRuas?: boolean;
  altura?: string;
}) {
  const caixa = useRef<HTMLDivElement>(null);
  const mapa = useRef<MapaLeaflet | null>(null);
  const lib = useRef<Leaflet | null>(null);
  const linha = useRef<Polyline | null>(null);
  const [pronto, setPronto] = useState(false);

  const aviso = useMapa(caixa, regiao, ({ L, mapa: m }) => {
    if (mostrarRuas) desenharRuas(L, m, regiao);
    mapa.current = m;
    lib.current = L;
    setPronto(true);
    return () => {
      mapa.current = null;
      linha.current = null;
    };
  });

  useEffect(() => {
    const m = mapa.current;
    const L = lib.current;
    if (!pronto || !m || !L) return;
    linha.current?.remove();
    linha.current = null;
    if (!destaque) return;
    linha.current = destacarRua(L, m, destaque);
    linha.current.setStyle({ color: "#ffffff", weight: 8 });
    m.fitBounds(linha.current.getBounds(), { padding: [40, 40], maxZoom: 18 });
  }, [destaque, pronto]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-borda">
      <div ref={caixa} className={`${altura} w-full bg-verde-escuro`} aria-label="Mapa da área do concurso" />
      <AvisoMapa texto={aviso} />
    </div>
  );
}
