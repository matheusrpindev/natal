"use client";

import type { Map as MapaLeaflet, Polyline } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { desenharRuas, destacarRua, montarMapa, type L as Leaflet } from "@/lib/mapaBase";
import type { Rua } from "@/lib/ruas";

/** Mapa só para consulta: a área do concurso, as ruas participantes e (opcional) uma rua em destaque. */
export function MapaArea({ destaque, mostrarRuas = true, altura = "h-80 sm:h-[28rem]" }: { destaque?: Rua | null; mostrarRuas?: boolean; altura?: string }) {
  const caixa = useRef<HTMLDivElement>(null);
  const mapa = useRef<MapaLeaflet | null>(null);
  const lib = useRef<Leaflet | null>(null);
  const linha = useRef<Polyline | null>(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      if (!caixa.current) return;
      const montado = await montarMapa(caixa.current, () => cancelado);
      if (!montado) return;
      const { L, mapa: m } = montado;
      if (mostrarRuas) desenharRuas(L, m);
      mapa.current = m;
      lib.current = L;
      setPronto(true);
    })();
    return () => {
      cancelado = true;
      mapa.current?.remove();
      mapa.current = null;
      linha.current = null;
    };
  }, [mostrarRuas]);

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
    <div className="overflow-hidden rounded-xl border border-borda">
      <div ref={caixa} className={`${altura} w-full bg-verde-escuro`} aria-label="Mapa da área do concurso" />
    </div>
  );
}
