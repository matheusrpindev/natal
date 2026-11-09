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
  cep: string | null;
  rua: string;
  numeroCasa: string;
  complemento: string | null;
  titulo: string | null;
  descricao: string | null;
  /** Ponto marcado no mapa (dentro da área do concurso). */
  latitude: number | null;
  longitude: number | null;
  /** Autorização específica (regulamento 11.4) para mostrar o número da casa e o ponto no mapa público. */
  autorizaLocalizacao: boolean;
  /** Caminhos das fotos no armazenamento. */
  fotos: string[];
  /** Caminhos das miniaturas (mesma ordem de `fotos`; pode ser vazio em inscrições antigas). */
  miniaturas: string[];
}

export type NovaInscricao = Omit<Inscricao, "id" | "protocolo" | "criadoEm" | "status" | "numero" | "fotos" | "miniaturas">;

export interface FotoUpload {
  nome: string;
  tipo: string;
  dados: Buffer;
  /** Versão pequena (480px) da mesma foto. */
  miniatura?: Buffer;
}

export interface NovoVoto {
  inscricaoId: string;
  cpfHash: string;
  nome: string;
  ipHash: string | null;
  userAgent: string | null;
}

export type ResultadoVoto = "ok" | "cpf-ja-votou";

export type StatusContestacao = "recebida" | "respondida";

/** Contestação da classificação preliminar (regulamento 9.3 e 9.4). */
export interface Contestacao {
  id: string;
  protocolo: string;
  criadoEm: string;
  status: StatusContestacao;
  /** Protocolo da inscrição de quem contesta. */
  protocoloInscricao: string;
  nome: string;
  whatsapp: string;
  email: string | null;
  descricao: string;
  /** Links ou explicação das evidências (opcional). */
  evidencias: string | null;
}

export type NovaContestacao = Omit<Contestacao, "id" | "protocolo" | "criadoEm" | "status">;

export interface Store {
  criarInscricao(dados: NovaInscricao, fotos: FotoUpload[]): Promise<Inscricao>;
  listarInscricoes(status?: StatusInscricao): Promise<Inscricao[]>;
  buscarInscricao(id: string): Promise<Inscricao | null>;
  mudarStatus(id: string, status: StatusInscricao): Promise<void>;
  registrarVoto(voto: NovoVoto): Promise<ResultadoVoto>;
  contarVotos(): Promise<Record<string, number>>;
  totalVotos(): Promise<number>;
  criarContestacao(dados: NovaContestacao): Promise<Contestacao>;
  listarContestacoes(): Promise<Contestacao[]>;
  mudarStatusContestacao(id: string, status: StatusContestacao): Promise<void>;
  lerFase(): Promise<Fase | null>;
  salvarFase(fase: Fase): Promise<void>;
  urlFoto(caminho: string): string;
}
