import type { Metadata, Viewport } from "next";
import { Mountains_of_Christmas, Nunito } from "next/font/google";
import { Suspense } from "react";
import { Cabecalho } from "@/components/Cabecalho";
import { CabecalhoDaFase } from "@/components/CabecalhoDaFase";
import { Rodape } from "@/components/Rodape";
import { EVENTO } from "@/lib/config";
import "./globals.css";

const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });
const festiva = Mountains_of_Christmas({ variable: "--font-reserva", subsets: ["latin"], weight: ["400", "700"] });

const urlSite = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(urlSite),
  title: { default: EVENTO.nome, template: `%s · ${EVENTO.nome}` },
  openGraph: { type: "website", locale: "pt_BR", siteName: EVENTO.nome },
  description: `Concurso da casa com a decoração de Natal mais bonita do ${EVENTO.local}. Uma iniciativa de ${EVENTO.organizador}.`,
};

export const viewport: Viewport = { themeColor: "#061f15" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} ${festiva.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Suspense fallback={<Cabecalho itensFase={[]} />}>
          <CabecalhoDaFase />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Rodape />
      </body>
    </html>
  );
}
