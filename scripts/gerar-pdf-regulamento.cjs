/* eslint-disable @typescript-eslint/no-require-imports -- script Node (CommonJS) */
/**
 * Gera os PDFs do regulamento completo de cada região em public/regulamentos/.
 * Uso: com o site rodando (npm run build && npm start), rode
 *   node scripts/gerar-pdf-regulamento.cjs http://localhost:3000
 * Precisa do Playwright (npx playwright install chromium, se ainda não tiver).
 */
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const BASE = process.argv[2] || "http://localhost:3000";
const REGIOES = { "scaffid-ii": "Scaffid II", marengo: "Parque Residencial Marengo" };
const SAIDA = path.join(__dirname, "..", "public", "regulamentos");

(async () => {
  fs.mkdirSync(SAIDA, { recursive: true });
  const navegador = await chromium.launch();
  const pagina = await navegador.newPage({ viewport: { width: 900, height: 1200 } });
  for (const [id, nome] of Object.entries(REGIOES)) {
    await pagina.goto(`${BASE}/${id}/regulamento/completo`, { waitUntil: "networkidle" });
    // espera o mapa carregar as imagens
    await pagina.waitForSelector(".leaflet-tile-loaded", { timeout: 20000 }).catch(() => {});
    await pagina.waitForTimeout(2500);
    const arquivo = path.join(SAIDA, `regulamento-natal-iluminado-${id}.pdf`);
    await pagina.pdf({
      path: arquivo,
      format: "A4",
      printBackground: true,
      margin: { top: "12mm", bottom: "14mm", left: "10mm", right: "10mm" },
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate: `<div style="width:100%;font-size:8px;color:#555;text-align:center;font-family:sans-serif">Regulamento oficial — Natal Iluminado do ${nome} 2026 — página <span class="pageNumber"></span> de <span class="totalPages"></span></div>`,
    });
    console.log("gerado", path.relative(process.cwd(), arquivo), Math.round(fs.statSync(arquivo).size / 1024), "KB");
  }
  await navegador.close();
})();
