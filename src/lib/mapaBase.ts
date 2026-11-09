"use client";

import "leaflet/dist/leaflet.css";
import type * as Leaflet from "leaflet";
import { useEffect, useState, type RefObject } from "react";
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
 *
 * `cancelado` evita criar o mapa se o componente já foi desmontado enquanto a
 * biblioteca carregava (no modo de desenvolvimento o React monta tudo duas vezes,
 * e criar dois mapas no mesmo elemento dá o erro "Map container is already initialized").
 */
export async function montarMapa(
  el: HTMLElement,
  cancelado: () => boolean,
  opcoes: { travarArea?: boolean; aoAvisar?: (msg: string) => void } = {},
): Promise<MapaMontado | null> {
  const L = (await import("leaflet")).default;
  if (cancelado() || (el as HTMLElement & { _leaflet_id?: number })._leaflet_id) return null;
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

  // Se as imagens de satélite não carregarem (bloqueador, rede), troca para o mapa de ruas.
  let carregouSatelite = false;
  let falhasSatelite = 0;
  satelite.on("tileload", () => (carregouSatelite = true));
  satelite.on("tileerror", () => {
    if (carregouSatelite || ++falhasSatelite < 4 || !mapa.hasLayer(satelite)) return;
    mapa.removeLayer(satelite);
    ruas.addTo(mapa);
  });
  let carregouRuas = false;
  let falhasRuas = 0;
  ruas.on("tileload", () => (carregouRuas = true));
  ruas.on("tileerror", () => {
    if (carregouRuas || ++falhasRuas !== 4) return;
    opcoes.aoAvisar?.(
      "As imagens do mapa não carregaram. Se você usa bloqueador de anúncios ou rede corporativa, libere este site e recarregue.",
    );
  });
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

/**
 * Monta o mapa num elemento e chama `configurar` quando ele estiver pronto.
 * Devolve uma mensagem de erro/aviso para mostrar por cima do mapa, se algo der errado.
 */
export function useMapa(caixa: RefObject<HTMLDivElement | null>, configurar: (m: MapaMontado) => void | (() => void)) {
  const [aviso, setAviso] = useState<string | null>(null);
  useEffect(() => {
    let cancelado = false;
    let montado: MapaMontado | null = null;
    let limpar: void | (() => void);
    (async () => {
      if (!caixa.current) return;
      try {
        montado = await montarMapa(caixa.current, () => cancelado, { aoAvisar: (m) => !cancelado && setAviso(m) });
        if (!montado) return;
        if (cancelado) {
          montado.mapa.remove();
          montado = null;
          return;
        }
        limpar = configurar(montado);
      } catch (e) {
        console.error("[mapa]", e);
        if (!cancelado) setAviso(`Não foi possível abrir o mapa (${(e as Error).message}). Recarregue a página.`);
      }
    })();
    return () => {
      cancelado = true;
      if (typeof limpar === "function") limpar();
      montado?.mapa.remove();
      montado = null;
    };
    // O mapa é montado uma vez; `configurar` usa refs para o que muda depois.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return aviso;
}
