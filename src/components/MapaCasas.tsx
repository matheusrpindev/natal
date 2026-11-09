"use client";

import type { Map as MapaLeaflet } from "leaflet";
import { useRef } from "react";
import { useMapa } from "@/lib/mapaBase";
import { AvisoMapa } from "./AvisoMapa";
import { enderecoPublico, nomeCasa, type CasaPublica } from "./CartaoCasa";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const num = (n: number | null) => String(n ?? 0).padStart(2, "0");

/** Mapa com um pino numerado para cada casa participante (roteiro para visitar). */
export function MapaCasas({ casas, votacao = false }: { casas: CasaPublica[]; votacao?: boolean }) {
  const caixa = useRef<HTMLDivElement>(null);
  const mapa = useRef<MapaLeaflet | null>(null);
  const comLocal = casas.filter((c) => c.latitude != null && c.longitude != null);

  const aviso = useMapa(caixa, ({ L, mapa: m }) => {
    mapa.current = m;
    for (const c of comLocal) {
      const icone = L.divIcon({
        className: "",
        html: `<span class="pino-casa">${num(c.numero)}</span>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18],
      });
      const destino = `https://www.google.com/maps/dir/?api=1&destination=${c.latitude},${c.longitude}`;
      const html = `<div class="popup-casa">
        ${c.miniaturas[0] ? `<img src="${esc(c.miniaturas[0])}" alt="" />` : ""}
        <strong>#${num(c.numero)} · ${esc(nomeCasa(c))}</strong>
        <span>${esc(enderecoPublico(c))}</span>
        <div class="popup-acoes">
          <a href="/casas/${c.id}">Ver fotos</a>
          ${votacao ? `<a class="votar" href="/votar?casa=${c.id}">Votar</a>` : ""}
          <a href="${destino}" target="_blank" rel="noreferrer">Como chegar</a>
        </div>
      </div>`;
      L.marker([c.latitude!, c.longitude!], { icon: icone, title: nomeCasa(c) }).bindPopup(html, { maxWidth: 240 }).addTo(m);
    }
    return () => {
      mapa.current = null;
    };
  });

  return (
    <div className="relative overflow-hidden rounded-xl border border-borda">
      <div ref={caixa} className="h-96 w-full bg-verde-escuro sm:h-[30rem]" aria-label="Mapa das casas participantes" />
      <AvisoMapa texto={aviso} />
    </div>
  );
}
