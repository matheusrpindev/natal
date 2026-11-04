import type { Fase } from "../phase";

export type StatusInscricao = "pendente" | "aprovada" | "recusada";

export interface Inscricao {
  id: string;
  protocolo: string;
  criadoEm: string;
  status: StatusInscricao;
  /** Número público da casa no concurso; definido ao aprovar. */
  numero: number | null;
  responsavel: string;
  whatsapp: string;
  email: string | null;
  rua: string;
  numeroCasa: string;
  complemento: string | null;
  titulo: string | null;
  descricao: string | null;
  /** Caminhos das fotos no armazenamento. */
  fotos: string[];
}

export type NovaInscricao = Omit<Inscricao, "id" | "protocolo" | "criadoEm" | "status" | "numero" | "fotos">;

export interface FotoUpload {
  nome: string;
  tipo: string;
  dados: Buffer;
}

export interface NovoVoto {
  inscricaoId: string;
  cpfHash: string;
  nome: string;
  ipHash: string | null;
  userAgent: string | null;
}

export type ResultadoVoto = "ok" | "cpf-ja-votou";

export interface Store {
  criarInscricao(dados: NovaInscricao, fotos: FotoUpload[]): Promise<Inscricao>;
  listarInscricoes(status?: StatusInscricao): Promise<Inscricao[]>;
  buscarInscricao(id: string): Promise<Inscricao | null>;
  mudarStatus(id: string, status: StatusInscricao): Promise<void>;
  registrarVoto(voto: NovoVoto): Promise<ResultadoVoto>;
  contarVotos(): Promise<Record<string, number>>;
  totalVotos(): Promise<number>;
  lerFase(): Promise<Fase | null>;
  salvarFase(fase: Fase): Promise<void>;
  urlFoto(caminho: string): string;
}
