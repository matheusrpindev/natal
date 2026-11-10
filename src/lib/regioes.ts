/**
 * Regiões do Natal Iluminado. Cada região é um concurso separado (inscrições, votação,
 * numeração das casas e vencedor próprios), com o mesmo calendário e o mesmo prêmio.
 */
import marengoArea from "./dados/marengo-area.json";
import marengoRuas from "./dados/marengo-ruas.json";
import scaffidArea from "./dados/scaffid-ii-area.json";
import scaffidCepsFora from "./dados/scaffid-ii-ceps-fora.json";
import scaffidRuas from "./dados/scaffid-ii-ruas.json";
import type { Rua } from "./ruas";

export const IDS_REGIAO = ["scaffid-ii", "marengo"] as const;
export type RegiaoId = (typeof IDS_REGIAO)[number];

export interface Regiao {
  id: RegiaoId;
  /** Nome completo do bairro. */
  nome: string;
  /** Nome curto (botões, menus). */
  nomeCurto: string;
  /** Nome do concurso desta região. */
  concurso: string;
  /** Bairros (como os Correios chamam) desta região. */
  bairrosCorreios: string[];
  /** CEPs do bairro que ficam fora da área desta edição. */
  cepsForaDaArea: string[];
  /** Contorno da área: [latitude, longitude]. */
  area: [number, number][];
  ruas: Rua[];
  /** Logo do evento com o nome da região (com contorno branco). */
  logo: { grande: string; pequeno: string };
  /** Descrição curta dos limites da área. */
  limites: string;
  cepExemplo: string;
}

export const REGIOES: Record<RegiaoId, Regiao> = {
  "scaffid-ii": {
    id: "scaffid-ii",
    nome: "Scaffid II",
    nomeCurto: "Scaffid II",
    concurso: "Natal Iluminado do Scaffid II",
    bairrosCorreios: ["Parque Residencial Scaffid II"],
    cepsForaDaArea: scaffidCepsFora,
    area: scaffidArea as [number, number][],
    ruas: scaffidRuas as Rua[],
    logo: { grande: "/logo-natal.webp", pequeno: "/logo-natal-p.webp" },
    limites: "Parque Residencial Scaffid II, dentro do contorno vermelho do mapa",
    cepExemplo: "08587-000",
  },
  marengo: {
    id: "marengo",
    nome: "Parque Residencial Marengo",
    nomeCurto: "Marengo",
    concurso: "Natal Iluminado do Parque Residencial Marengo",
    bairrosCorreios: ["Parque Residencial Marengo"],
    cepsForaDaArea: [],
    area: marengoArea as [number, number][],
    ruas: marengoRuas as Rua[],
    logo: { grande: "/logo-natal-marengo.webp", pequeno: "/logo-natal-marengo-p.webp" },
    limites: "Parque Residencial Marengo, dentro do contorno vermelho do mapa (limite do bairro)",
    cepExemplo: "08594-000",
  },
};

export const LISTA_REGIOES = IDS_REGIAO.map((id) => REGIOES[id]);

export function isRegiaoId(v: unknown): v is RegiaoId {
  return typeof v === "string" && (IDS_REGIAO as readonly string[]).includes(v);
}

export function regiaoOuNula(v: unknown): Regiao | null {
  return isRegiaoId(v) ? REGIOES[v] : null;
}
