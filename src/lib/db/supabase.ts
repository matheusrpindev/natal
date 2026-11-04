import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isFase, type Fase } from "../phase";
import type { Inscricao, NovaInscricao, FotoUpload, NovoVoto, Store, StatusInscricao } from "./types";
import { extensao, gerarProtocolo } from "./util";

const BUCKET = "fotos";

let cliente: SupabaseClient | null = null;
function sb() {
  if (!cliente) {
    cliente = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cliente;
}

interface Linha {
  id: string;
  protocolo: string;
  created_at: string;
  status: StatusInscricao;
  numero: number | null;
  responsavel: string;
  whatsapp: string;
  email: string | null;
  cep: string | null;
  rua: string;
  numero_casa: string;
  complemento: string | null;
  titulo: string | null;
  descricao: string | null;
  latitude: number | null;
  longitude: number | null;
  fotos: string[];
}

function deLinha(l: Linha): Inscricao {
  return {
    id: l.id,
    protocolo: l.protocolo,
    criadoEm: l.created_at,
    status: l.status,
    numero: l.numero,
    responsavel: l.responsavel,
    whatsapp: l.whatsapp,
    email: l.email,
    cep: l.cep ?? null,
    rua: l.rua,
    numeroCasa: l.numero_casa,
    complemento: l.complemento,
    titulo: l.titulo,
    descricao: l.descricao,
    latitude: l.latitude ?? null,
    longitude: l.longitude ?? null,
    fotos: l.fotos ?? [],
  };
}

function falhou(op: string, error: { message: string } | null) {
  if (error) throw new Error(`Supabase (${op}): ${error.message}`);
}

export const supabaseStore: Store = {
  async criarInscricao(dados: NovaInscricao, fotos: FotoUpload[]) {
    const id = crypto.randomUUID();
    const caminhos: string[] = [];
    for (const [i, f] of fotos.entries()) {
      const caminho = `${id}/${i + 1}.${extensao(f.tipo)}`;
      const { error } = await sb().storage.from(BUCKET).upload(caminho, f.dados, { contentType: f.tipo });
      falhou("upload", error);
      caminhos.push(caminho);
    }
    const { data, error } = await sb()
      .from("inscricoes")
      .insert({
        id,
        protocolo: gerarProtocolo(),
        responsavel: dados.responsavel,
        whatsapp: dados.whatsapp,
        email: dados.email,
        cep: dados.cep,
        rua: dados.rua,
        numero_casa: dados.numeroCasa,
        complemento: dados.complemento,
        titulo: dados.titulo,
        descricao: dados.descricao,
        latitude: dados.latitude,
        longitude: dados.longitude,
        fotos: caminhos,
      })
      .select()
      .single();
    falhou("inserir inscrição", error);
    return deLinha(data as Linha);
  },
  async listarInscricoes(status?: StatusInscricao) {
    let q = sb().from("inscricoes").select("*").order("created_at");
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    falhou("listar inscrições", error);
    return (data as Linha[]).map(deLinha);
  },
  async buscarInscricao(id: string) {
    const { data, error } = await sb().from("inscricoes").select("*").eq("id", id).maybeSingle();
    falhou("buscar inscrição", error);
    return data ? deLinha(data as Linha) : null;
  },
  async mudarStatus(id: string, status: StatusInscricao) {
    const { error } = await sb().rpc("mudar_status_inscricao", { p_id: id, p_status: status });
    falhou("mudar status", error);
  },
  async registrarVoto(voto: NovoVoto) {
    const { error } = await sb().from("votos").insert({
      inscricao_id: voto.inscricaoId,
      cpf_hash: voto.cpfHash,
      nome: voto.nome,
      ip_hash: voto.ipHash,
      user_agent: voto.userAgent,
    });
    if (error?.code === "23505") return "cpf-ja-votou";
    falhou("registrar voto", error);
    return "ok";
  },
  async contarVotos() {
    const { data, error } = await sb().from("contagem_votos").select("inscricao_id,total");
    falhou("contar votos", error);
    const c: Record<string, number> = {};
    for (const r of data as { inscricao_id: string; total: number }[]) c[r.inscricao_id] = r.total;
    return c;
  },
  async totalVotos() {
    const { count, error } = await sb().from("votos").select("*", { count: "exact", head: true });
    falhou("total de votos", error);
    return count ?? 0;
  },
  async lerFase() {
    const { data, error } = await sb().from("configuracoes").select("valor").eq("chave", "fase").maybeSingle();
    falhou("ler fase", error);
    return isFase(data?.valor) ? data.valor : null;
  },
  async salvarFase(fase: Fase) {
    const { error } = await sb().from("configuracoes").upsert({ chave: "fase", valor: fase });
    falhou("salvar fase", error);
  },
  urlFoto(caminho: string) {
    return `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${caminho}`;
  },
};
