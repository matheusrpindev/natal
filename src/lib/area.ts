/**
 * Área do concurso: ruas do Parque Residencial Scaffid II que podem participar.
 * Contorno reproduzido a partir do desenho feito no Google Earth.
 * Para deixar exato, exporte o desenho como KML e substitua estes pontos.
 * Formato: [latitude, longitude]
 */
export const AREA: [number, number][] = [
  [-23.427584, -46.312735],
  [-23.427718, -46.311834],
  [-23.427885, -46.310895],
  [-23.428086, -46.310144],
  [-23.42822, -46.309768],
  [-23.428186, -46.309111],
  [-23.428287, -46.308266],
  [-23.428304, -46.307327],
  [-23.42822, -46.306389],
  [-23.42817, -46.3056],
  [-23.428555, -46.305375],
  [-23.429308, -46.305525],
  [-23.429977, -46.30545],
  [-23.430596, -46.305168],
  [-23.431232, -46.304849],
  [-23.431734, -46.304567],
  [-23.432002, -46.30453],
  [-23.431868, -46.305074],
  [-23.431651, -46.305732],
  [-23.431366, -46.306295],
  [-23.431232, -46.306576],
  [-23.431567, -46.306708],
  [-23.432236, -46.306802],
  [-23.43227, -46.307327],
  [-23.43237, -46.307928],
  [-23.432906, -46.308116],
  [-23.433575, -46.308266],
  [-23.434111, -46.308398],
  [-23.434044, -46.309205],
  [-23.433876, -46.310144],
  [-23.433659, -46.310745],
  [-23.432906, -46.310857],
  [-23.431902, -46.310932],
  [-23.431098, -46.310895],
  [-23.430831, -46.31127],
  [-23.430931, -46.311834],
  [-23.431098, -46.312397],
  [-23.431065, -46.312772],
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
