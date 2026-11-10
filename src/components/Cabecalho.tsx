"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Logo } from "./Logo";
import { Luzes } from "./Luzes";

export interface ItemMenu {
  href: string;
  rotulo: string;
  /** Ativo só quando o endereço é exatamente este (páginas iniciais). */
  exato?: boolean;
}

const ESTILO = "whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-bold transition-colors";
const INATIVO = `${ESTILO} text-white/90 hover:bg-white/10`;

function LinkMenu({ href, rotulo, exato }: ItemMenu) {
  const caminho = usePathname();
  const ativo = exato ? caminho === href : caminho.startsWith(href);
  return (
    <Link href={href} className={ativo ? `${ESTILO} bg-dourado text-verde-noite` : INATIVO} aria-current={ativo ? "page" : undefined}>
      {rotulo}
    </Link>
  );
}

/** Topo com as luzinhas, o logo e o menu. */
export function Cabecalho({
  logo,
  links,
  faixa,
}: {
  logo: { src: string; alt: string; href: string };
  links: ItemMenu[];
  /** Linha fina acima do menu (ex.: troca de região). */
  faixa?: React.ReactNode;
}) {
  return (
    <header className="ceu-noturno relative z-20 text-white">
      <Luzes />
      {faixa}
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 pt-1 pb-4 md:flex-row md:justify-between">
        <Logo {...logo} />
        <nav aria-label="Menu principal" className="flex flex-wrap justify-center gap-1">
          {links.map((l) => (
            <Suspense
              key={l.href}
              fallback={
                <Link href={l.href} className={INATIVO}>
                  {l.rotulo}
                </Link>
              }
            >
              <LinkMenu {...l} />
            </Suspense>
          ))}
        </nav>
      </div>
      <div className="bengala h-2" />
    </header>
  );
}
