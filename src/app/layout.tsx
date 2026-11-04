import type { Metadata, Viewport } from "next";
import { Mountains_of_Christmas, Nunito } from "next/font/google";
import { Cabecalho } from "@/components/Cabecalho";
import { Rodape } from "@/components/Rodape";
import { EVENTO } from "@/lib/config";
import "./globals.css";

const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });
const festiva = Mountains_of_Christmas({ variable: "--font-reserva", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: { default: EVENTO.nome, template: `%s · ${EVENTO.nome}` },
  description: `Concurso da casa com a decoração de Natal mais bonita do ${EVENTO.local}. Uma iniciativa de ${EVENTO.organizador}.`,
};

export const viewport: Viewport = { themeColor: "#061f15" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} ${festiva.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Cabecalho />
        <main className="flex-1">{children}</main>
        <Rodape />
      </body>
    </html>
  );
}
