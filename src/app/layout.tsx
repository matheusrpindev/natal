import type { Metadata, Viewport } from "next";
import { Mountains_of_Christmas, Nunito } from "next/font/google";
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
  title: { default: "Natal Iluminado 2026", template: "%s · Natal Iluminado" },
  openGraph: { type: "website", locale: "pt_BR", siteName: "Natal Iluminado" },
  description: `Concurso de decoração de Natal no Scaffid II e no Parque Residencial Marengo. O 1º lugar de cada região ganha ${EVENTO.premio}. Uma iniciativa de ${EVENTO.organizador}.`,
};

export const viewport: Viewport = { themeColor: "#061f15" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} ${festiva.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <Rodape />
      </body>
    </html>
  );
}
