/**
 * Ruas que participam do concurso em cada região (dados em src/lib/dados/<regiao>-ruas.json),
 * geradas a partir do OpenStreetMap (traçado recortado na área) + ViaCEP/Correios (nome oficial, CEP e bairro).
 * - "inteira": a rua toda fica dentro da área
 * - "parcial": só um trecho fica dentro (a casa precisa ser conferida no mapa)
 */
export type SituacaoRua = "inteira" | "parcial";

export interface Rua {
  nome: string;
  /** CEPs da rua (ruas longas podem ter um CEP por faixa de numeração). Vazio quando não achamos. */
  ceps: string[];
  bairro: string | null;
  situacao: SituacaoRua;
  /** Trechos da rua dentro da área: listas de [latitude, longitude] */
  tracado: [number, number][][];
}

const soDigitos = (v: string) => v.replace(/\D/g, "");

/** Nome sem acentos, minúsculo e sem o tipo (Rua, Avenida...), para comparar nomes de rua. */
export function nomeComparavel(nome: string) {
  return nome
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/^(rua|avenida|av\.?|estrada|alameda|viela|travessa|rodovia)\s+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function ruaPorCep(ruas: Rua[], cep: string): Rua | null {
  const d = soDigitos(cep);
  return ruas.find((r) => r.ceps.some((c) => soDigitos(c) === d)) ?? null;
}

export function ruaPorNome(ruas: Rua[], nome: string): Rua | null {
  const n = nomeComparavel(nome);
  return n ? (ruas.find((r) => nomeComparavel(r.nome) === n) ?? null) : null;
}

export function ordenarRuas(ruas: Rua[]) {
  return [...ruas].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

/** Centro aproximado do trecho da rua que fica dentro da área (para posicionar o mapa). */
export function centroDaRua(rua: Rua): [number, number] {
  const pts = rua.tracado.flat();
  return [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
}
