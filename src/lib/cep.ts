import { LISTA_REGIOES, REGIOES, type RegiaoId } from "./regioes";
import { ruaPorCep, ruaPorNome, type Rua } from "./ruas";

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
  /** CEP do bairro, mas fora da área desta edição. */
  | { status: "bairro-fora"; endereco: EnderecoCep | null }
  /** A rua não está na lista, mas o bairro participa: conferir no mapa. */
  | { status: "conferir"; endereco: EnderecoCep }
  /** O CEP é da outra região do concurso. */
  | { status: "outra-regiao"; regiao: RegiaoId; rua: Rua | null }
  | { status: "fora"; endereco: EnderecoCep | null }
  | { status: "nao-encontrado" };

function situacao(rua: Rua) {
  return rua.situacao === "inteira" ? ("sim" as const) : ("parcial" as const);
}

/** Diz se um CEP está entre as ruas participantes da região. */
export async function verificarCep(regiaoId: RegiaoId, cep: string): Promise<ResultadoParticipacao> {
  const regiao = REGIOES[regiaoId];
  const rua = ruaPorCep(regiao.ruas, cep);
  if (rua) return { status: situacao(rua), rua };
  for (const outra of LISTA_REGIOES) {
    if (outra.id === regiaoId) continue;
    const r = ruaPorCep(outra.ruas, cep);
    if (r) return { status: "outra-regiao", regiao: outra.id, rua: r };
  }
  const endereco = await buscarCep(cep);
  if (!endereco) return { status: "nao-encontrado" };
  const d = soDigitosCep(cep);
  if (regiao.cepsForaDaArea.some((c) => soDigitosCep(c) === d)) return { status: "bairro-fora", endereco };
  if (endereco.localidade === "Itaquaquecetuba") {
    // CEP que não está na lista, mas de uma rua que está (ex.: outra faixa de numeração).
    const mesmaRua = regiao.bairrosCorreios.includes(endereco.bairro) ? ruaPorNome(regiao.ruas, endereco.logradouro) : null;
    if (mesmaRua) return { status: situacao(mesmaRua), rua: mesmaRua };
    if (regiao.bairrosCorreios.includes(endereco.bairro)) return { status: "conferir", endereco };
    const outra = LISTA_REGIOES.find((o) => o.id !== regiaoId && o.bairrosCorreios.includes(endereco.bairro));
    if (outra) return { status: "outra-regiao", regiao: outra.id, rua: null };
  }
  return { status: "fora", endereco };
}
