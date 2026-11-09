/**
 * Área do concurso: Scaffid II e bairros vizinhos (Chácara Cuiabá, Jardim Caiubi, Jardim Carolina e outros).
 * Contorno reproduzido a partir do desenho feito no Google Maps (encaixado na imagem de satélite).
 * Limites: Rodovia Ayrton Senna ao sul, Estrada Alberto Hinoto a oeste e a mata ao norte.
 * Para deixar exato, exporte o desenho como KML e substitua estes pontos.
 * Formato: [latitude, longitude]
 */
export const AREA: [number, number][] = [
  [-23.423207, -46.317731],
  [-23.423801, -46.312883],
  [-23.427847, -46.306669],
  [-23.429413, -46.305399],
  [-23.432087, -46.303979],
  [-23.432024, -46.304722],
  [-23.432141, -46.305917],
  [-23.433591, -46.307745],
  [-23.436557, -46.307702],
  [-23.442559, -46.306921],
  [-23.443239, -46.308947],
  [-23.445316, -46.318353],
  [-23.446696, -46.325328],
  [-23.444449, -46.324857],
  [-23.441291, -46.324887],
  [-23.439152, -46.325578],
  [-23.434042, -46.3277],
  [-23.431991, -46.323772],
  [-23.429093, -46.319509],
];

export const CENTRO_AREA: [number, number] = [
  AREA.reduce((s, p) => s + p[0], 0) / AREA.length,
  AREA.reduce((s, p) => s + p[1], 0) / AREA.length,
];

/** Verifica se um ponto está dentro da área (algoritmo de ray casting). */
export function dentroDaArea(lat: number, lng: number) {
  let dentro = false;
  for (let i = 0, j = AREA.length - 1; i < AREA.length; j = i++) {
    const [yi, xi] = AREA[i];
    const [yj, xj] = AREA[j];
    if (
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    )
      dentro = !dentro;
  }
  return dentro;
}
