"use client";

import "leaflet/dist/leaflet.css";
import type { Map as MapaLeaflet, Marker } from "leaflet";
import { CircleCheck, LocateFixed, MapPinned, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AREA, dentroDaArea } from "@/lib/area";

export interface Ponto {
  lat: number;
  lng: number;
}

const PINO = `<svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
  <path d="M17 43s15-14.6 15-26A15 15 0 0 0 2 17c0 11.4 15 26 15 26z" fill="#c8102e" stroke="#fff" stroke-width="2.5"/>
  <circle cx="17" cy="17" r="6" fill="#fff"/></svg>`;

/** Mapa para a pessoa marcar onde fica a casa, só dentro da área do concurso. */
export function MapaLocalizacao({ valor, aoMudar }: { valor: Ponto | null; aoMudar: (p: Ponto | null) => void }) {
  const caixa = useRef<HTMLDivElement>(null);
  const mapa = useRef<MapaLeaflet | null>(null);
  const marcador = useRef<Marker | null>(null);
  const aoMudarRef = useRef(aoMudar);
  const marcarRef = useRef<((lat: number, lng: number, centralizar?: boolean) => boolean) | null>(null);
  const ultimoValido = useRef<Ponto | null>(valor);
  const [aviso, setAviso] = useState<string | null>(null);
  const [localizando, setLocalizando] = useState(false);

  useEffect(() => {
    aoMudarRef.current = aoMudar;
  }, [aoMudar]);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelado || !caixa.current || mapa.current) return;

      const m = L.map(caixa.current, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
      mapa.current = m;

      const satelite = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19, maxNativeZoom: 18, attribution: "Imagens © Esri" },
      );
      const ruas = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      });
      satelite.addTo(m);
      L.control.layers({ Satélite: satelite, Ruas: ruas }, undefined, { position: "topright" }).addTo(m);

      // Escurece tudo que está fora da área e contorna a área em vermelho.
      const mundo: [number, number][] = [
        [-89, -179],
        [-89, 179],
        [89, 179],
        [89, -179],
      ];
      L.polygon([mundo, AREA], { stroke: false, fillColor: "#061f15", fillOpacity: 0.6, interactive: false }).addTo(m);
      const contorno = L.polygon(AREA, { color: "#ff3b3b", weight: 3, fill: false, interactive: false }).addTo(m);
      m.fitBounds(contorno.getBounds(), { padding: [12, 12] });
      m.setMinZoom(m.getZoom() - 1);
      m.setMaxBounds(contorno.getBounds().pad(0.6));

      const icone = L.divIcon({ html: PINO, className: "", iconSize: [34, 44], iconAnchor: [17, 43] });

      const marcar = (lat: number, lng: number, centralizar = false) => {
        if (!dentroDaArea(lat, lng)) {
          setAviso("Esse ponto está fora da área do concurso. Marque uma casa dentro do contorno vermelho.");
          return false;
        }
        setAviso(null);
        if (marcador.current) marcador.current.setLatLng([lat, lng]);
        else {
          marcador.current = L.marker([lat, lng], { icon: icone, draggable: true }).addTo(m);
          marcador.current.on("dragend", () => {
            const p = marcador.current!.getLatLng();
            // Arrastou para fora: o pino volta para o último lugar válido.
            if (!marcar(p.lat, p.lng) && ultimoValido.current) {
              marcador.current!.setLatLng([ultimoValido.current.lat, ultimoValido.current.lng]);
            }
          });
        }
        // Longe demais para acertar o telhado? Aproxima no ponto marcado.
        if (centralizar || m.getZoom() < 17) m.setView([lat, lng], 18);
        ultimoValido.current = { lat, lng };
        aoMudarRef.current({ lat, lng });
        return true;
      };

      marcarRef.current = marcar;
      m.on("click", (e) => marcar(e.latlng.lat, e.latlng.lng));
      if (ultimoValido.current) marcar(ultimoValido.current.lat, ultimoValido.current.lng);
    })();
    return () => {
      cancelado = true;
      mapa.current?.remove();
      mapa.current = null;
      marcador.current = null;
      marcarRef.current = null;
    };
  }, []);

  function usarMinhaLocalizacao() {
    if (!navigator.geolocation) {
      setAviso("Seu navegador não permite pegar a localização. Toque no mapa para marcar.");
      return;
    }
    setLocalizando(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocalizando(false);
        marcarRef.current?.(pos.coords.latitude, pos.coords.longitude, true);
      },
      () => {
        setLocalizando(false);
        setAviso("Não conseguimos pegar sua localização. Toque no mapa para marcar a casa.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative overflow-hidden rounded-xl border border-borda">
        <div ref={caixa} className="h-80 w-full bg-verde-escuro sm:h-96" aria-label="Mapa da área do concurso" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-sm font-bold" aria-live="polite">
          {valor ? (
            <span className="flex items-center gap-1.5 text-verde">
              <CircleCheck size={16} aria-hidden /> Casa marcada no mapa. Se precisar, arraste o pino.
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-tinta-suave">
              <MapPinned size={16} aria-hidden /> Toque no mapa, em cima da sua casa. Se estiver em casa, use sua localização.
            </span>
          )}
        </p>
        <button type="button" onClick={usarMinhaLocalizacao} disabled={localizando} className="btn btn-contorno px-4 py-2 text-sm text-verde">
          <LocateFixed size={16} aria-hidden /> {localizando ? "Localizando…" : "Usar minha localização"}
        </button>
      </div>
      {aviso && (
        <p role="alert" className="flex items-start gap-1.5 rounded-xl bg-vermelho/10 p-3 text-sm font-bold text-vermelho">
          <TriangleAlert size={16} className="mt-0.5 shrink-0" aria-hidden /> {aviso}
        </p>
      )}
    </div>
  );
}
