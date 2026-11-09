/**
 * Configuração central do concurso.
 * Todas as datas estão no horário de Brasília (UTC-03:00).
 */
export const EVENTO = {
  nome: "Natal Iluminado do Scaffid II",
  nomeCurto: "Natal Iluminado",
  local: "Scaffid II",
  organizador: "Marcos Teles",
  /** Nome completo do organizador (regulamento e política de privacidade). */
  organizadorCompleto: "Marcos Diego Teles Monteiro",
  instagram: "omarcosteles",
  /** Descrição do prêmio do 1º lugar. Enquanto for null, o site diz que será divulgado antes da votação. */
  premio: null as string | null,
  ano: 2026,
  /** Quantas fotos cada casa pode enviar. */
  maxFotos: 3,
} as const;

export const DATAS = {
  inscricoesInicio: new Date("2026-11-09T00:00:00-03:00"),
  inscricoesFim: new Date("2026-11-30T23:59:59-03:00"),
  votacaoInicio: new Date("2026-12-01T00:00:00-03:00"),
  votacaoFim: new Date("2026-12-14T23:59:59-03:00"),
  /** Divulgação da classificação preliminar. */
  preliminar: new Date("2026-12-15T00:00:00-03:00"),
  /** Prazo para contestações. */
  contestacaoFim: new Date("2026-12-16T18:00:00-03:00"),
  resultado: new Date("2026-12-18T00:00:00-03:00"),
} as const;

export const TIMEZONE = "America/Sao_Paulo";

export function formatarData(d: Date, opts: Intl.DateTimeFormatOptions = {}) {
  return d.toLocaleDateString("pt-BR", { timeZone: TIMEZONE, day: "2-digit", month: "2-digit", ...opts });
}

export function formatarDataHora(d: Date) {
  return d.toLocaleString("pt-BR", {
    timeZone: TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
