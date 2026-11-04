import { DATAS } from "./config";

export const FASES = ["em-breve", "inscricoes", "aguardando-votacao", "votacao", "apuracao", "resultado"] as const;
export type Fase = (typeof FASES)[number];

export const NOME_FASE: Record<Fase, string> = {
  "em-breve": "Em breve",
  inscricoes: "Inscrições abertas",
  "aguardando-votacao": "Aguardando votação",
  votacao: "Votação aberta",
  apuracao: "Apuração",
  resultado: "Resultado",
};

/** Fase calculada só pelas datas do config. */
export function fasePelasDatas(agora: Date): Fase {
  const t = agora.getTime();
  if (t < DATAS.inscricoesInicio.getTime()) return "em-breve";
  if (t <= DATAS.inscricoesFim.getTime()) return "inscricoes";
  if (t < DATAS.votacaoInicio.getTime()) return "aguardando-votacao";
  if (t <= DATAS.votacaoFim.getTime()) return "votacao";
  if (t < DATAS.resultado.getTime()) return "apuracao";
  return "resultado";
}

export function isFase(v: unknown): v is Fase {
  return typeof v === "string" && (FASES as readonly string[]).includes(v);
}

/** Próximo marco no calendário (para contagem regressiva). */
export function proximoMarco(fase: Fase): { data: Date; rotulo: string } | null {
  switch (fase) {
    case "em-breve":
      return { data: DATAS.inscricoesInicio, rotulo: "As inscrições abrem em" };
    case "inscricoes":
      return { data: DATAS.inscricoesFim, rotulo: "As inscrições encerram em" };
    case "aguardando-votacao":
      return { data: DATAS.votacaoInicio, rotulo: "A votação começa em" };
    case "votacao":
      return { data: DATAS.votacaoFim, rotulo: "A votação encerra em" };
    case "apuracao":
      return { data: DATAS.resultado, rotulo: "O resultado sai em" };
    default:
      return null;
  }
}
