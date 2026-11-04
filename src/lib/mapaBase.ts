"use client";

import "leaflet/dist/leaflet.css";
import type * as Leaflet from "leaflet";
import { AREA } from "./area";
import { RUAS, type Rua } from "./ruas";

export type L = typeof Leaflet;

export interface MapaMontado {
  L: L;
  mapa: Leaflet.Map;
  contorno: Leaflet.Polygon;
}

/**
 * Cria um mapa com satélite/ruas, a área do concurso contornada em vermelho
 * e tudo que está fora dela escurecido.
 */
export async function montarMapa(el: HTMLElement, opcoes: { travarArea?: boolean } = {}): Promise<MapaMontado> {
  const L = (await import("leaflet")).default;
  const mapa = L.map(el, { scrollWheelZoom: false });

  const satelite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 19, maxNativeZoom: 18, attribution: "Imagens © Esri" },
  );
  const ruas = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  });
  satelite.addTo(mapa);
  L.control.layers({ Satélite: satelite, Ruas: ruas }, undefined, { position: "topright" }).addTo(mapa);

  const mundo: [number, number][] = [
    [-89, -179],
    [-89, 179],
    [89, 179],
    [89, -179],
  ];
  L.polygon([mundo, AREA], { stroke: false, fillColor: "#061f15", fillOpacity: 0.6, interactive: false }).addTo(mapa);
  const contorno = L.polygon(AREA, { color: "#ff3b3b", weight: 3, fill: false, interactive: false }).addTo(mapa);
  mapa.fitBounds(contorno.getBounds(), { padding: [12, 12] });
  if (opcoes.travarArea !== false) {
    mapa.setMinZoom(mapa.getZoom() - 1);
    mapa.setMaxBounds(contorno.getBounds().pad(0.6));
  }
  return { L, mapa, contorno };
}

/** Desenha uma rua em destaque (amarelo) e devolve a camada. */
export function destacarRua(L: L, mapa: Leaflet.Map, rua: Rua) {
  return L.polyline(rua.tracado, { color: "#f4c542", weight: 7, opacity: 0.95, lineCap: "round" })
    .bindTooltip(rua.nome, { sticky: true })
    .addTo(mapa);
}

/** Desenha todas as ruas participantes, com o nome ao passar o dedo/mouse. */
export function desenharRuas(L: L, mapa: Leaflet.Map) {
  return RUAS.map((r) =>
    L.polyline(r.tracado, {
      color: r.situacao === "inteira" ? "#f4c542" : "#ffb38a",
      weight: 5,
      opacity: 0.85,
      dashArray: r.situacao === "parcial" ? "6 6" : undefined,
    })
      .bindTooltip(r.nome + (r.situacao === "parcial" ? " (trecho)" : ""), { sticky: true })
      .addTo(mapa),
  );
}
