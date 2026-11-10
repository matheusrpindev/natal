import { CalendarCheck, ClipboardPen, Download, FileText, Gift, House, ShieldCheck, Vote } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Selo } from "@/components/Icones";
import { ListaRuas } from "@/components/ListaRuas";
import { Titulo } from "@/components/Titulo";
import { DATAS, EVENTO, formatarData, formatarDataHora } from "@/lib/config";
import { regiaoDaRota } from "@/lib/rota";
import { MapaComLegenda, urlPdf } from "./componentes";

export const metadata: Metadata = { title: "Regulamento" };

export default async function ResumoRegulamento({ params }: PageProps<"/[regiao]/regulamento">) {
  const regiao = await regiaoDaRota(params);
  const R = regiao.nome;
  const blocos = [
    {
      icone: House,
      cor: "verde" as const,
      titulo: "Quem pode participar",
      itens: [
        `Casas do ${R} dentro do contorno vermelho do mapa abaixo.`,
        "Uma inscrição por casa, feita por quem tem 18 anos ou mais (morador ou autorizado pelo responsável).",
        "A decoração precisa ter luzes e estar visível da rua. Comércios e terrenos sem casa não participam.",
      ],
    },
    {
      icone: ClipboardPen,
      cor: "vermelho" as const,
      titulo: "Inscrição",
      itens: [
        `De ${formatarData(DATAS.inscricoesInicio)} a ${formatarData(DATAS.inscricoesFim)} (até 23h59), só pelo site.`,
        "De 1 a 3 fotos reais da decoração desta casa, sem montagem nem inteligência artificial.",
        "A organização confere cada inscrição antes de aprovar e dar o número da casa.",
      ],
    },
    {
      icone: Vote,
      cor: "verde" as const,
      titulo: "Votação",
      itens: [
        `De ${formatarData(DATAS.votacaoInicio)} a ${formatarData(DATAS.votacaoFim)} (até 23h59), só pelo site.`,
        "Qualquer pessoa vota: 1 voto por CPF, do próprio titular, sem poder trocar.",
        "Curtidas e enquetes nas redes não contam. Comprar votos, robôs e CPF de outra pessoa são proibidos.",
      ],
    },
    {
      icone: CalendarCheck,
      cor: "dourado" as const,
      titulo: "Resultado",
      itens: [
        `Classificação preliminar em ${formatarData(DATAS.preliminar)}. Quem se inscreveu pode contestar pelo site até ${formatarDataHora(DATAS.contestacaoFim)}.`,
        `Resultado definitivo em ${formatarData(DATAS.resultado)}.`,
        "Empate no 1º lugar: uma comissão de 3 avaliadores decide (iluminação, criatividade, tema natalino e visibilidade).",
      ],
    },
    {
      icone: Gift,
      cor: "vermelho" as const,
      titulo: "Prêmio",
      itens: [
        `Só o 1º lugar é premiado: ${EVENTO.premio}. A foto do kit é meramente ilustrativa.`,
        "A entrega é gratuita, com confirmação da identidade do responsável pela inscrição.",
      ],
    },
    {
      icone: ShieldCheck,
      cor: "verde" as const,
      titulo: "Decoração e dados",
      itens: [
        "A decoração deve ficar montada e, se possível, acesa à noite durante a votação.",
        "Fotos e nome da rua são divulgados. Número da casa e ponto no mapa só com autorização.",
        "Telefone, e-mail e CPF não são divulgados. Os dados são apagados até 90 dias após o concurso.",
      ],
    },
  ];
  return (
    <>
      <Titulo titulo="Regulamento" subtitulo={`${regiao.concurso} — resumo das regras`} />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="cartao flex flex-col items-start gap-4 border-2 border-dourado p-6 sm:flex-row sm:items-center">
          <Selo icone={FileText} cor="dourado" tamanho={56} />
          <div className="flex-1">
            <p className="text-lg font-extrabold">Regulamento completo</p>
            <p className="text-tinta-suave">
              Esta página é um resumo. Em caso de dúvida, vale o regulamento completo do {R}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={urlPdf(regiao)} download className="btn btn-vermelho">
              <Download size={18} aria-hidden /> Baixar PDF
            </a>
            <Link href={`/${regiao.id}/regulamento/completo`} className="btn btn-contorno text-verde">
              Ler no site
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blocos.map((b) => (
            <section key={b.titulo} className="cartao p-6">
              <h2 className="flex items-center gap-3 text-xl font-extrabold">
                <Selo icone={b.icone} cor={b.cor} tamanho={40} /> {b.titulo}
              </h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-tinta-suave">
                {b.itens.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section id="area" className="cartao mt-10 scroll-mt-6 p-6 sm:p-8">
          <h2 className="text-xl font-extrabold text-vermelho uppercase">Área do concurso e ruas participantes</h2>
          <p className="mt-2 text-tinta-suave">
            Participam as casas do {R} dentro do contorno vermelho. Nas ruas com só um trecho dentro, vale a casa com a
            entrada principal dentro do contorno.
          </p>
          <div className="mt-4">
            <MapaComLegenda regiao={regiao} />
          </div>
          <ListaRuas regiao={regiao.id} />
        </section>
      </div>
    </>
  );
}
