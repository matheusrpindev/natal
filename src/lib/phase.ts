import { DATAS, formatarData, formatarDataHora } from "./config";

/** Fases do concurso. Quem define a fase atual é a organização, pelo painel /admin. */
export const FASES = ["em-breve", "inscricoes", "votacao", "apuracao", "preliminar", "resultado"] as const;
export type Fase = (typeof FASES)[number];

export const FASE_INICIAL: Fase = "em-breve";

export const NOME_FASE: Record<Fase, string> = {
  "em-breve": "Em breve",
  inscricoes: "Inscrições abertas",
  votacao: "Votação aberta",
  apuracao: "Votação encerrada",
  preliminar: "Classificação preliminar",
  resultado: "Resultado definitivo",
};

export const DESCRICAO_FASE: Record<Fase, string> = {
  "em-breve": "Site só com a apresentação e o regulamento. Ninguém se inscreve nem vota.",
  inscricoes: "Libera o formulário de inscrição. Menu: Inscrever.",
  votacao: "Fecha as inscrições e libera a votação. Menu: Votar.",
  apuracao: "Fecha a votação. O resultado continua em segredo enquanto a organização confere os votos. Menu: Casas participantes.",
  preliminar: `Mostra a classificação preliminar (previsto: ${formatarData(DATAS.preliminar)}) e abre as contestações até ${formatarDataHora(DATAS.contestacaoFim)}. Menu: Classificação preliminar.`,
  resultado: "Mostra a casa vencedora e a classificação definitiva. Fecha as contestações. Menu: Resultado.",
};

/** Itens do menu (além de Início e Regulamento) em cada fase. */
export const MENU_FASE: Record<Fase, { href: string; rotulo: string }[]> = {
  "em-breve": [],
  inscricoes: [{ href: "/inscricao", rotulo: "Inscrever minha casa" }],
  votacao: [{ href: "/votar", rotulo: "Votar" }],
  apuracao: [{ href: "/casas", rotulo: "Casas participantes" }],
  preliminar: [{ href: "/resultado", rotulo: "Classificação preliminar" }],
  resultado: [{ href: "/resultado", rotulo: "Resultado" }],
};

export function isFase(v: unknown): v is Fase {
  return typeof v === "string" && (FASES as readonly string[]).includes(v);
}

/** Data prevista do próximo marco (para a contagem regressiva da página inicial). */
export function proximoMarco(fase: Fase): { data: Date; rotulo: string } | null {
  switch (fase) {
    case "em-breve":
      return { data: DATAS.inscricoesInicio, rotulo: "As inscrições abrem em" };
    case "inscricoes":
      return { data: DATAS.inscricoesFim, rotulo: "As inscrições encerram em" };
    case "votacao":
      return { data: DATAS.votacaoFim, rotulo: "A votação encerra em" };
    case "apuracao":
      return { data: DATAS.preliminar, rotulo: "A classificação preliminar sai em" };
    case "preliminar":
      return { data: DATAS.resultado, rotulo: "O resultado definitivo sai em" };
    default:
      return null;
  }
}

/** Contestações: só na fase de classificação preliminar e até o prazo do regulamento (9.3). */
export function contestacaoAberta(fase: Fase) {
  return fase === "preliminar" && Date.now() <= DATAS.contestacaoFim.getTime();
}
