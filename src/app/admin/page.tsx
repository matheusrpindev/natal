/* eslint-disable @next/next/no-img-element */
import { Ban, CalendarDays, CircleCheck, Hourglass, MapPin, TriangleAlert, Trophy, User } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { nomeCasa } from "@/components/CartaoCasa";
import { Selo } from "@/components/Icones";
import { estaLogado } from "@/lib/admin";
import { formatarDataHora } from "@/lib/config";
import { db, faseAtual, usandoSupabase, type Inscricao, type StatusInscricao } from "@/lib/db";
import { NOME_FASE } from "@/lib/phase";
import { ranking } from "@/lib/ranking";
import { sair } from "./actions";
import { BotoesStatus } from "./BotoesStatus";
import { Login } from "./Login";
import { SeletorFase } from "./SeletorFase";

export const metadata: Metadata = { title: "Organização", robots: { index: false } };

const GRUPOS: { status: StatusInscricao; titulo: string; icone: typeof Ban; cor: "dourado" | "verde" | "vermelho" }[] = [
  { status: "pendente", titulo: "Aguardando aprovação", icone: Hourglass, cor: "dourado" },
  { status: "aprovada", titulo: "Aprovadas", icone: CircleCheck, cor: "verde" },
  { status: "recusada", titulo: "Recusadas", icone: Ban, cor: "vermelho" },
];

function CartaoInscricao({ i, urlFoto }: { i: Inscricao; urlFoto: (c: string) => string }) {
  return (
    <li className="cartao flex flex-col gap-4 p-4 md:flex-row">
      <div className="flex shrink-0 gap-2">
        {i.fotos.map((f) => (
          <a key={f} href={urlFoto(f)} target="_blank" rel="noreferrer">
            <img src={urlFoto(f)} alt="" className="h-24 w-24 rounded-lg object-cover" loading="lazy" />
          </a>
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-1 text-sm">
        <p className="text-base font-extrabold">
          {i.numero != null && <span className="mr-2 rounded bg-vermelho px-2 text-white">#{i.numero}</span>}
          {i.numero != null ? nomeCasa({ numero: i.numero, titulo: i.titulo }) : i.titulo || "(sem nome)"}
        </p>
        <p className="flex items-center gap-1.5">
          <MapPin size={14} className="shrink-0 text-vermelho" aria-hidden /> {i.rua}, {i.numeroCasa}
          {i.cep && ` · CEP ${i.cep}`}
          {i.complemento && ` · ${i.complemento}`}
          {i.latitude != null && i.longitude != null && (
            <a
              href={`https://www.google.com/maps?q=${i.latitude},${i.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="ml-1 font-bold text-verde underline"
            >
              ver no mapa
            </a>
          )}
        </p>
        <p className="flex flex-wrap items-center gap-1.5">
          <User size={14} className="shrink-0 text-verde" aria-hidden /> {i.responsavel} ·{" "}
          <a href={`https://wa.me/55${i.whatsapp}`} target="_blank" rel="noreferrer" className="font-bold text-verde underline">
            WhatsApp {i.whatsapp}
          </a>
          {i.email && ` · ${i.email}`}
        </p>
        {i.descricao && <p className="text-tinta-suave">“{i.descricao}”</p>}
        <p className="text-xs text-tinta-suave">
          Protocolo {i.protocolo} · enviada em {formatarDataHora(new Date(i.criadoEm))}
        </p>
        <div className="mt-2">
          <BotoesStatus id={i.id} status={i.status} />
        </div>
      </div>
    </li>
  );
}

async function Painel() {
  if (!(await estaLogado())) return <Login />;
  const store = await db();
  const [inscricoes, { fase }, { lista, total }] = await Promise.all([
    store.listarInscricoes(),
    faseAtual(),
    ranking(),
  ]);
  const urlFoto = (c: string) => store.urlFoto(c);
  const conta = (s: StatusInscricao) => inscricoes.filter((i) => i.status === s).length;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-festiva text-4xl font-bold text-vermelho">Painel da organização</h1>
        <form action={sair}>
          <button className="btn btn-contorno px-4 py-2 text-sm text-tinta-suave">Sair</button>
        </form>
      </div>

      {!usandoSupabase && (
        <p className="flex items-start gap-2 rounded-xl bg-dourado/25 p-4 text-sm">
          <TriangleAlert size={18} className="shrink-0 text-dourado-escuro" aria-hidden />
          <span><strong>Modo de teste:</strong> os dados estão sendo salvos em arquivo local (<code>.data/</code>). Configure o
          Supabase antes de publicar o site.</span>
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          ["Fase atual", NOME_FASE[fase]],
          ["Pendentes", conta("pendente")],
          ["Aprovadas", conta("aprovada")],
          ["Votos", total],
        ].map(([r, v]) => (
          <div key={r} className="cartao p-4">
            <p className="text-sm font-bold text-tinta-suave">{r}</p>
            <p className="text-2xl font-black text-verde">{v}</p>
          </div>
        ))}
      </div>

      <section className="cartao p-6">
        <h2 className="flex items-center gap-3 text-xl font-extrabold">
          <Selo icone={CalendarDays} cor="verde" tamanho={40} /> Fase do concurso
        </h2>
        <p className="mt-1 text-sm text-tinta-suave">
          Você decide quando cada fase começa. O site mostra para o público só o que vale na fase atual. Clique numa fase
          para mudar.
        </p>
        <SeletorFase atual={fase} />
      </section>

      <section className="cartao p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-3 text-xl font-extrabold">
            <Selo icone={Trophy} cor="dourado" tamanho={40} /> Apuração ao vivo
          </h2>
          <div className="flex gap-2">
            <a href="/api/admin/exportar?tipo=ranking" className="btn btn-contorno px-4 py-2 text-sm text-verde">
              Baixar ranking (CSV)
            </a>
            <a href="/api/admin/exportar?tipo=inscricoes" className="btn btn-contorno px-4 py-2 text-sm text-verde">
              Baixar inscrições (CSV)
            </a>
          </div>
        </div>
        <p className="mt-1 text-sm text-tinta-suave">Só a organização vê esta parcial. O público vê o resultado a partir do dia da divulgação.</p>
        {lista.length === 0 ? (
          <p className="mt-4 text-tinta-suave">Nenhuma casa aprovada ainda.</p>
        ) : (
          <ol className="mt-4 divide-y divide-borda">
            {lista.map((c) => (
              <li key={c.casa.id} className="flex items-center gap-3 py-2">
                <span className="w-8 font-black text-tinta-suave">{c.posicao}º</span>
                <span className="flex-1">
                  #{c.casa.numero} {nomeCasa(c.casa)} <span className="text-sm text-tinta-suave">· {c.casa.rua}</span>
                </span>
                <span className="font-black text-verde">{c.votos}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      {GRUPOS.map((g) => {
        const itens = inscricoes.filter((i) => i.status === g.status);
        return (
          <section key={g.status}>
            <h2 className="flex items-center gap-3 text-xl font-extrabold">
              <Selo icone={g.icone} cor={g.cor} tamanho={36} /> {g.titulo} <span className="text-tinta-suave">({itens.length})</span>
            </h2>
            {itens.length === 0 ? (
              <p className="mt-2 text-tinta-suave">Nenhuma.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-3">
                {itens.map((i) => (
                  <CartaoInscricao key={i.id} i={i} urlFoto={urlFoto} />
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

export default function PaginaAdmin() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Suspense fallback={<p className="text-center text-tinta-suave">Carregando…</p>}>
        <Painel />
      </Suspense>
    </div>
  );
}
