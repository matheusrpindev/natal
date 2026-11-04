import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import type { Fase } from "../phase";
import type { Inscricao, NovaInscricao, FotoUpload, NovoVoto, Store, StatusInscricao } from "./types";
import { extensao, gerarProtocolo } from "./util";

/**
 * Armazenamento em arquivo JSON, para rodar localmente sem configurar nada.
 * NÃO use em produção na Vercel (o disco lá é somente leitura). Use o Supabase.
 */
const DIR = path.join(process.cwd(), ".data");
export const UPLOADS_DIR = path.join(DIR, "uploads");
const ARQ = path.join(DIR, "db.json");

interface Dados {
  inscricoes: Inscricao[];
  votos: (NovoVoto & { criadoEm: string })[];
  fase?: Fase | null;
}

let fila: Promise<unknown> = Promise.resolve();

async function ler(): Promise<Dados> {
  try {
    return JSON.parse(await readFile(ARQ, "utf8")) as Dados;
  } catch {
    return { inscricoes: [], votos: [], fase: null };
  }
}

async function gravar(d: Dados) {
  await mkdir(DIR, { recursive: true });
  const tmp = `${ARQ}.tmp`;
  await writeFile(tmp, JSON.stringify(d, null, 2));
  await rename(tmp, ARQ);
}

/** Executa alterações uma de cada vez para não corromper o arquivo. */
function mutar<T>(fn: (d: Dados) => T | Promise<T>): Promise<T> {
  const p = fila.then(async () => {
    const d = await ler();
    const r = await fn(d);
    await gravar(d);
    return r;
  });
  fila = p.catch(() => {});
  return p;
}

/** Inscrições gravadas antes de novos campos existirem. */
function comPadroes(i: Inscricao): Inscricao {
  return { ...i, miniaturas: i.miniaturas ?? [], cep: i.cep ?? null, latitude: i.latitude ?? null, longitude: i.longitude ?? null };
}

export const localStore: Store = {
  async criarInscricao(dados: NovaInscricao, fotos: FotoUpload[]) {
    const id = randomUUID();
    await mkdir(UPLOADS_DIR, { recursive: true });
    const caminhos: string[] = [];
    const miniaturas: string[] = [];
    for (const [i, f] of fotos.entries()) {
      const nome = `${id}-${i + 1}.${extensao(f.tipo)}`;
      await writeFile(path.join(UPLOADS_DIR, nome), f.dados);
      caminhos.push(nome);
      if (f.miniatura) {
        const mini = `${id}-${i + 1}-mini.jpg`;
        await writeFile(path.join(UPLOADS_DIR, mini), f.miniatura);
        miniaturas.push(mini);
      }
    }
    return mutar((d) => {
      const nova: Inscricao = {
        ...dados,
        id,
        protocolo: gerarProtocolo(),
        criadoEm: new Date().toISOString(),
        status: "pendente",
        numero: null,
        fotos: caminhos,
        miniaturas: miniaturas.length === caminhos.length ? miniaturas : [],
      };
      d.inscricoes.push(nova);
      return nova;
    });
  },
  async listarInscricoes(status?: StatusInscricao) {
    const d = await ler();
    return d.inscricoes.filter((i) => !status || i.status === status).map(comPadroes);
  },
  async buscarInscricao(id: string) {
    const d = await ler();
    const i = d.inscricoes.find((x) => x.id === id);
    return i ? comPadroes(i) : null;
  },
  async mudarStatus(id: string, status: StatusInscricao) {
    await mutar((d) => {
      const ins = d.inscricoes.find((i) => i.id === id);
      if (!ins) return;
      ins.status = status;
      if (status === "aprovada" && ins.numero == null) {
        ins.numero = Math.max(0, ...d.inscricoes.map((i) => i.numero ?? 0)) + 1;
      }
    });
  },
  async registrarVoto(voto: NovoVoto) {
    return mutar((d) => {
      if (d.votos.some((v) => v.cpfHash === voto.cpfHash)) return "cpf-ja-votou" as const;
      d.votos.push({ ...voto, criadoEm: new Date().toISOString() });
      return "ok" as const;
    });
  },
  async contarVotos() {
    const d = await ler();
    const c: Record<string, number> = {};
    for (const v of d.votos) c[v.inscricaoId] = (c[v.inscricaoId] ?? 0) + 1;
    return c;
  },
  async totalVotos() {
    return (await ler()).votos.length;
  },
  async lerFase() {
    return (await ler()).fase ?? null;
  },
  async salvarFase(fase: Fase) {
    await mutar((d) => {
      d.fase = fase;
    });
  },
  urlFoto(caminho: string) {
    return `/api/fotos/${encodeURIComponent(caminho)}`;
  },
};
