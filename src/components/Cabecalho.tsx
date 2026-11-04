"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { Logo } from "./Logo";
import { Luzes } from "./Luzes";

const LINKS = [
  { href: "/", rotulo: "Início" },
  { href: "/casas", rotulo: "Casas participantes" },
  { href: "/inscricao", rotulo: "Inscrição" },
  { href: "/votar", rotulo: "Votar" },
  { href: "/resultado", rotulo: "Resultado" },
  { href: "/regulamento", rotulo: "Regulamento" },
];

const ESTILO = "rounded-full px-3.5 py-2 text-sm font-bold transition-colors";
const INATIVO = `${ESTILO} text-white/90 hover:bg-white/10`;

function LinkMenu({ href, rotulo, aoClicar }: { href: string; rotulo: string; aoClicar: () => void }) {
  const caminho = usePathname();
  const ativo = href === "/" ? caminho === "/" : caminho.startsWith(href);
  return (
    <Link href={href} onClick={aoClicar} className={ativo ? `${ESTILO} bg-dourado text-verde-noite` : INATIVO}>
      {rotulo}
    </Link>
  );
}

export function Cabecalho() {
  const [aberto, setAberto] = useState(false);
  return (
    <header className="ceu-noturno relative z-20 text-white">
      <Luzes />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pt-1 pb-4">
        <Logo />
        <button
          className="rounded-full border border-white/30 px-4 py-2 text-sm font-bold lg:hidden"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls="menu-principal"
        >
          {aberto ? "Fechar ✕" : "Menu ☰"}
        </button>
        <nav
          id="menu-principal"
          className={`${aberto ? "flex" : "hidden"} absolute inset-x-0 top-full flex-col gap-1 bg-verde-noite/97 p-4 shadow-xl lg:static lg:flex lg:flex-row lg:bg-transparent lg:p-0 lg:shadow-none`}
        >
          {LINKS.map((l) => (
            <Suspense
              key={l.href}
              fallback={
                <Link href={l.href} className={INATIVO}>
                  {l.rotulo}
                </Link>
              }
            >
              <LinkMenu href={l.href} rotulo={l.rotulo} aoClicar={() => setAberto(false)} />
            </Suspense>
          ))}
        </nav>
      </div>
      <div className="bengala h-2" />
    </header>
  );
}
