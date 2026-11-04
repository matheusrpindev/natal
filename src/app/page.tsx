import { ArrowRight, ClipboardPen, Lightbulb, Trophy, Vote } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Contagem } from "@/components/Contagem";
import { Enfeite, Selo } from "@/components/Icones";
import { Neve } from "@/components/Neve";
import { Organizador } from "@/components/Organizador";
import { DATAS, EVENTO, formatarData } from "@/lib/config";
import { faseAtual } from "@/lib/db";
import { proximoMarco, type Fase } from "@/lib/phase";

const ETAPAS = [
  {
    icone: ClipboardPen,
    cor: "vermelho" as const,
    titulo: "Inscrições",
    quando: `${formatarData(DATAS.inscricoesInicio)} a ${formatarData(DATAS.inscricoesFim)}`,
    texto: "Monte sua decoração, tire fotos caprichadas e inscreva sua casa aqui no site.",
  },
  {
    icone: Vote,
    cor: "verde" as const,
    titulo: "Votação",
    quando: `${formatarData(DATAS.votacaoInicio)} a ${formatarData(DATAS.votacaoFim)}`,
    texto: "Qualquer pessoa pode votar: é um voto por CPF. Passeie pelo bairro e escolha a sua favorita!",
  },
  {
    icone: Trophy,
    cor: "dourado" as const,
    titulo: "Resultado",
    quando: formatarData(DATAS.resultado),
    texto: "Divulgação das casas mais iluminadas do Scaffid II e entrega dos prêmios.",
  },
];

const CHAMADA: Record<Fase, { texto: string; href: string; rotulo: string } | null> = {
  "em-breve": { texto: "As inscrições começam em breve. Já vá preparando as luzes!", href: "/regulamento", rotulo: "Ler o regulamento" },
  inscricoes: { texto: "Inscrições abertas! Mostre a decoração da sua casa.", href: "/inscricao", rotulo: "Inscrever minha casa" },
  votacao: { texto: "A votação está aberta! Escolha a casa mais bonita.", href: "/votar", rotulo: "Votar agora" },
  apuracao: { texto: "Votação encerrada! Estamos apurando os votos.", href: "/casas", rotulo: "Ver as casas" },
  resultado: { texto: "Saiu o resultado do Natal Iluminado!", href: "/resultado", rotulo: "Ver o resultado" },
};

async function Destaque() {
  const { fase } = await faseAtual();
  const marco = proximoMarco(fase);
  const chamada = CHAMADA[fase];
  return (
    <div className="flex flex-col items-center gap-7">
      {marco && <Contagem alvo={marco.data.toISOString()} rotulo={marco.rotulo} />}
      {chamada && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg font-bold text-white">{chamada.texto}</p>
          <Link href={chamada.href} className="btn btn-dourado text-lg">
            {chamada.rotulo} <ArrowRight size={20} aria-hidden />
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Inicio() {
  return (
    <>
      <section className="ceu-noturno relative overflow-hidden text-white">
        <Neve />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 pt-12 pb-16 text-center sm:pt-16 sm:pb-24">
          <p className="rounded-full border border-dourado/40 bg-dourado/10 px-4 py-1.5 text-xs font-extrabold tracking-[0.12em] text-dourado uppercase sm:tracking-[0.2em]">
            Concurso de decoração de Natal {EVENTO.ano}
          </p>
          <h1 className="font-festiva mt-5 text-5xl leading-[0.95] font-bold sm:text-7xl md:text-8xl">
            <span className="brilho-dourado drop-shadow-[0_0_25px_#f4c54255]">Natal Iluminado</span>
            <span className="mt-2 block text-3xl text-white sm:text-5xl">no Scaffid II</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/85 sm:text-xl">
            Vamos encher o bairro de luz! Decore sua casa, inscreva-se e concorra ao título de{" "}
            <strong className="text-dourado">casa mais bonita do Natal</strong>.
          </p>
          <p className="mt-2 text-sm text-white/70">
            Uma iniciativa de <strong className="text-white">{EVENTO.organizador}</strong>
          </p>
          <div className="mt-10 min-h-48">
            <Suspense fallback={null}>
              <Destaque />
            </Suspense>
          </div>
        </div>
        <svg viewBox="0 0 1440 80" className="relative block w-full text-creme" preserveAspectRatio="none" aria-hidden>
          <path
            fill="currentColor"
            d="M0 40 C 120 10, 240 70, 360 40 S 600 10, 720 40 960 70, 1080 40 1320 10, 1440 40 V80 H0 Z"
          />
        </svg>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-festiva text-center text-4xl font-bold text-vermelho sm:text-5xl">Como funciona</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {ETAPAS.map((e, i) => (
            <li key={e.titulo} className="cartao relative p-6 pt-8">
              <span className="absolute -top-4 left-6 flex h-9 w-9 items-center justify-center rounded-full bg-verde text-lg font-black text-white shadow-md">
                {i + 1}
              </span>
              <Selo icone={e.icone} cor={e.cor} />
              <h3 className="mt-3 text-xl font-extrabold">{e.titulo}</h3>
              <p className="mt-1 font-bold text-vermelho">{e.quando}</p>
              <p className="mt-2 text-tinta-suave">{e.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <Organizador />

      <section className="bg-verde text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-festiva text-4xl font-bold text-dourado sm:text-5xl">Prêmios</h2>
            <p className="mt-3 max-w-2xl text-lg text-white/90">
              Os prêmios serão anunciados em breve. Fique de olho aqui no site e nos grupos do bairro!
            </p>
          </div>
          <div className="flex items-start justify-center gap-5" aria-hidden>
            <Enfeite posicao={2} tamanho={72} />
            <span className="-mt-2">
              <Enfeite posicao={1} tamanho={92} />
            </span>
            <Enfeite posicao={3} tamanho={72} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="cartao p-6">
            <h3 className="flex items-center gap-3 text-xl font-extrabold">
              <Selo icone={Lightbulb} cor="dourado" tamanho={40} /> Dicas para a sua decoração
            </h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-tinta-suave">
              <li>A decoração precisa estar visível da rua.</li>
              <li>Tire fotos à noite, com as luzes acesas, e uma de dia para mostrar os detalhes.</li>
              <li>Mantenha as luzes ligadas durante o período de votação para o pessoal visitar.</li>
              <li>Vale reaproveitar materiais e soltar a criatividade!</li>
            </ul>
          </div>
          <div className="cartao p-6">
            <h3 className="flex items-center gap-3 text-xl font-extrabold">
              <Selo icone={Vote} cor="verde" tamanho={40} /> Sobre a votação
            </h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-tinta-suave">
              <li>Qualquer pessoa pode votar, morando ou não no bairro.</li>
              <li>Cada CPF vale um voto. Não é possível trocar o voto depois.</li>
              <li>Seu CPF fica guardado de forma criptografada e serve só para evitar votos repetidos.</li>
              <li>O resultado será divulgado no dia {formatarData(DATAS.resultado)}.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
