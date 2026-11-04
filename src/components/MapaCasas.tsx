"use client";

import type { Map as MapaLeaflet } from "leaflet";
import { useEffect, useRef } from "react";
import { montarMapa } from "@/lib/mapaBase";
import { nomeCasa, type CasaPublica } from "./CartaoCasa";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const num = (n: number | null) => String(n ?? 0).padStart(2, "0");

/** Mapa com um pino numerado para cada casa participante (roteiro para visitar). */
export function MapaCasas({ casas, votacao = false }: { casas: CasaPublica[]; votacao?: boolean }) {
  const caixa = useRef<HTMLDivElement>(null);
  const mapa = useRef<MapaLeaflet | null>(null);
  const comLocal = casas.filter((c) => c.latitude != null && c.longitude != null);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      if (!caixa.current) return;
      const montado = await montarMapa(caixa.current, () => cancelado);
      if (!montado) return;
      const { L, mapa: m } = montado;
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
          ${c.fotos[0] ? `<img src="${esc(c.fotos[0])}" alt="" />` : ""}
          <strong>#${num(c.numero)} · ${esc(nomeCasa(c))}</strong>
          <span>${esc(c.rua)}, ${esc(c.numeroCasa)}</span>
          <div class="popup-acoes">
            <a href="/casas/${c.id}">Ver fotos</a>
            ${votacao ? `<a class="votar" href="/votar?casa=${c.id}">Votar</a>` : ""}
            <a href="${destino}" target="_blank" rel="noreferrer">Como chegar</a>
          </div>
        </div>`;
        L.marker([c.latitude!, c.longitude!], { icon: icone, title: nomeCasa(c) }).bindPopup(html, { maxWidth: 240 }).addTo(m);
      }
    })();
    return () => {
      cancelado = true;
      mapa.current?.remove();
      mapa.current = null;
    };
    // As casas vêm do servidor e não mudam enquanto a página está aberta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-borda">
      <div ref={caixa} className="h-96 w-full bg-verde-escuro sm:h-[30rem]" aria-label="Mapa das casas participantes" />
    </div>
  );
}
