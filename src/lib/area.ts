/**
 * Áreas do concurso: contornos em src/lib/dados/<regiao>-area.json ([latitude, longitude]).
 * Scaffid II: reproduzido do desenho no Google Earth. Marengo: limite do bairro no Google Maps.
 * Para deixar exato, exporte o desenho como KML e substitua os pontos.
 */

export function centroDaArea(area: [number, number][]): [number, number] {
  return [area.reduce((s, p) => s + p[0], 0) / area.length, area.reduce((s, p) => s + p[1], 0) / area.length];
}

/** Verifica se um ponto está dentro da área (algoritmo de ray casting). */
export function dentroDaArea(area: [number, number][], lat: number, lng: number) {
  let dentro = false;
  for (let i = 0, j = area.length - 1; i < area.length; j = i++) {
    const [yi, xi] = area[i];
    const [yj, xj] = area[j];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) dentro = !dentro;
  }
  return dentro;
}
