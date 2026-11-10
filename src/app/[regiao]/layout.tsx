import type { Metadata } from "next";
import { Suspense } from "react";
import { Cabecalho } from "@/components/Cabecalho";
import { CabecalhoDaFase } from "@/components/CabecalhoDaFase";
import { EVENTO } from "@/lib/config";
import { IDS_REGIAO, regiaoOuNula } from "@/lib/regioes";
import { regiaoDaRota } from "@/lib/rota";

export function generateStaticParams() {
  return IDS_REGIAO.map((regiao) => ({ regiao }));
}

export async function generateMetadata({ params }: LayoutProps<"/[regiao]">): Promise<Metadata> {
  const regiao = regiaoOuNula((await params).regiao);
  if (!regiao) return {};
  return {
    title: { default: regiao.concurso, template: `%s · ${regiao.concurso}` },
    description: `Concurso da casa com a decoração de Natal mais bonita do ${regiao.nome}. O 1º lugar ganha ${EVENTO.premio}. Uma iniciativa de ${EVENTO.organizador}.`,
  };
}

const CABECALHO_NEUTRO = <Cabecalho logo={{ src: "/logo-natal-geral-p.webp", alt: "Natal Iluminado 2026", href: "/" }} links={[]} />;

async function CabecalhoDaRegiao({ params }: { params: Promise<{ regiao: string }> }) {
  const regiao = await regiaoDaRota(params);
  return <CabecalhoDaFase regiao={regiao} />;
}

/**
 * A região vem da URL. Ela é lida dentro de <Suspense> (cabeçalho e página) para que o Next
 * consiga montar a "casca" estática da rota mesmo sem saber a região.
 */
export default function LayoutRegiao({ children, params }: LayoutProps<"/[regiao]">) {
  return (
    <>
      <Suspense fallback={CABECALHO_NEUTRO}>
        <CabecalhoDaRegiao params={params} />
      </Suspense>
      <main className="flex-1">
        <Suspense fallback={<p className="py-24 text-center text-tinta-suave">Carregando…</p>}>{children}</Suspense>
      </main>
    </>
  );
}
