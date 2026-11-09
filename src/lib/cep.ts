import { CEPS_BAIRRO_FORA_DA_AREA, ruaPorCep, type Rua } from "./ruas";

export interface EnderecoCep {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export const soDigitosCep = (v: string) => v.replace(/\D/g, "").slice(0, 8);
export const mascararCep = (v: string) => soDigitosCep(v).replace(/^(\d{5})(\d)/, "$1-$2");

/** Consulta o CEP no ViaCEP (direto do navegador). */
export async function buscarCep(cep: string): Promise<EnderecoCep | null> {
  const d = soDigitosCep(cep);
  if (d.length !== 8) return null;
  const r = await fetch(`https://viacep.com.br/ws/${d}/json/`);
  if (!r.ok) throw new Error("Não foi possível consultar o CEP agora.");
  const j = await r.json();
  return j.erro ? null : (j as EnderecoCep);
}

export type ResultadoParticipacao =
  | { status: "sim"; rua: Rua }
  | { status: "parcial"; rua: Rua }
  | { status: "bairro-fora"; endereco: EnderecoCep | null }
  | { status: "fora"; endereco: EnderecoCep | null }
  | { status: "nao-encontrado" };

/** Diz se um CEP está entre as ruas participantes. */
export async function verificarCep(cep: string): Promise<ResultadoParticipacao> {
  const rua = ruaPorCep(cep);
  if (rua) return { status: rua.situacao === "inteira" ? "sim" : "parcial", rua };
  const endereco = await buscarCep(cep);
  if (!endereco) return { status: "nao-encontrado" };
  const d = soDigitosCep(cep);
  if (CEPS_BAIRRO_FORA_DA_AREA.some((c) => soDigitosCep(c) === d)) return { status: "bairro-fora", endereco };
  return { status: "fora", endereco };
}
