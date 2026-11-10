import { Cabecalho } from "@/components/Cabecalho";
import { LISTA_REGIOES } from "@/lib/regioes";

export default function LayoutGeral({ children }: LayoutProps<"/">) {
  return (
    <>
      <Cabecalho
        logo={{ src: "/logo-natal-geral-p.webp", alt: "Natal Iluminado 2026", href: "/" }}
        links={[{ href: "/", rotulo: "Início", exato: true }, ...LISTA_REGIOES.map((r) => ({ href: `/${r.id}`, rotulo: r.nomeCurto }))]}
      />
      <main className="flex-1">{children}</main>
    </>
  );
}
