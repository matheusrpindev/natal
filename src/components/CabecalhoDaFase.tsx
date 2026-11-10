import { ArrowLeftRight } from "lucide-react";
import Link from "next/link";
import { faseAtual } from "@/lib/db";
import { MENU_FASE } from "@/lib/phase";
import { LISTA_REGIOES, type Regiao } from "@/lib/regioes";
import { Cabecalho, type ItemMenu } from "./Cabecalho";

/** Links fixos da região (antes de saber a fase). */
export function linksDaRegiao(regiao: Regiao, itensFase: ItemMenu[] = []): ItemMenu[] {
  const base = `/${regiao.id}`;
  return [
    { href: base, rotulo: "Início", exato: true },
    ...itensFase.map((i) => ({ ...i, href: `${base}${i.href}` })),
    { href: `${base}/regulamento`, rotulo: "Regulamento" },
  ];
}

export function FaixaRegiao({ regiao }: { regiao: Regiao }) {
  const outra = LISTA_REGIOES.find((r) => r.id !== regiao.id)!;
  return (
    <div className="relative mx-auto flex max-w-6xl justify-end px-4 pt-1 text-xs">
      <Link
        href={`/${outra.id}`}
        className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-bold text-white/85 hover:bg-white/20"
      >
        <ArrowLeftRight size={13} aria-hidden /> Ir para o {outra.nomeCurto}
      </Link>
    </div>
  );
}

export function CabecalhoRegiao({ regiao, itensFase = [] }: { regiao: Regiao; itensFase?: ItemMenu[] }) {
  return (
    <Cabecalho
      logo={{ src: regiao.logo.pequeno, alt: regiao.concurso, href: `/${regiao.id}` }}
      links={linksDaRegiao(regiao, itensFase)}
      faixa={<FaixaRegiao regiao={regiao} />}
    />
  );
}

export async function CabecalhoDaFase({ regiao }: { regiao: Regiao }) {
  const { fase } = await faseAtual();
  return <CabecalhoRegiao regiao={regiao} itensFase={MENU_FASE[fase]} />;
}
