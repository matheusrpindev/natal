import type { Metadata } from "next";
import { MapaArea } from "@/components/MapaArea";
import { Titulo } from "@/components/Titulo";
import { DATAS, EVENTO, formatarData } from "@/lib/config";
import { RUAS } from "@/lib/ruas";

export const metadata: Metadata = { title: "Regulamento" };

const SECOES: { titulo: string; itens: string[] }[] = [
  {
    titulo: "1. Sobre o concurso",
    itens: [
      `O ${EVENTO.nome} é um concurso que vai escolher as casas com a decoração de Natal mais bonita do bairro ${EVENTO.local}.`,
      `É uma iniciativa de ${EVENTO.organizador}, sem custo para participar ou votar.`,
    ],
  },
  {
    titulo: "2. Quem pode se inscrever",
    itens: [
      `Residências localizadas no ${EVENTO.local}, dentro da área e nas ruas listadas abaixo. Cada endereço pode ter uma única inscrição.`,
      "Na inscrição, o participante marca no mapa onde fica a casa. Essa marcação é usada para conferir a participação e poderá ser usada num mapa das casas participantes.",
      "A decoração deve estar na fachada, no muro, no quintal ou em janelas, visível da rua.",
      "A inscrição deve ser feita pelo morador ou com autorização dele.",
    ],
  },
  {
    titulo: "3. Inscrições",
    itens: [
      `As inscrições vão de ${formatarData(DATAS.inscricoesInicio)} a ${formatarData(DATAS.inscricoesFim)}, exclusivamente por este site.`,
      `É obrigatório enviar de 1 a ${EVENTO.maxFotos} fotos reais da decoração da casa inscrita.`,
      "A organização confere as inscrições e pode recusar as que não cumprirem este regulamento.",
      "Cada casa aprovada recebe um número de participante, que aparece na galeria e na votação.",
    ],
  },
  {
    titulo: "4. Votação",
    itens: [
      `A votação vai de ${formatarData(DATAS.votacaoInicio)} a ${formatarData(DATAS.votacaoFim)}, exclusivamente por este site.`,
      "Qualquer pessoa pode votar, mesmo quem não mora no bairro.",
      "Cada CPF pode votar uma única vez, em uma única casa. O voto não pode ser alterado.",
      "É proibido usar CPF de outra pessoa sem autorização, robôs ou qualquer forma de fraude. Votos suspeitos podem ser anulados e a casa beneficiada pode ser desclassificada.",
      "Os participantes devem manter a decoração montada e, se possível, acesa à noite durante o período de votação.",
    ],
  },
  {
    titulo: "5. Resultado e premiação",
    itens: [
      `O resultado será divulgado em ${formatarData(DATAS.resultado)}, neste site.`,
      "Vence a casa com mais votos válidos. Em caso de empate, a organização define o critério de desempate.",
      "Os prêmios serão anunciados pela organização.",
    ],
  },
  {
    titulo: "6. Uso de imagem e dados pessoais (LGPD)",
    itens: [
      "Ao se inscrever, o participante autoriza a publicação das fotos, do nome da rua e do número da casa no site e nas redes sociais do concurso.",
      "Nome do responsável, telefone e e-mail não são divulgados e são usados só para contato sobre o concurso.",
      "O CPF dos votantes é guardado apenas de forma criptografada (hash), para garantir um voto por pessoa, e não é compartilhado com ninguém.",
      "Os dados serão apagados até 90 dias após o fim do concurso.",
    ],
  },
  {
    titulo: "7. Disposições gerais",
    itens: ["Casos não previstos neste regulamento serão decididos pela organização."],
  },
];

const ordenar = (lista: typeof RUAS) => [...lista].sort((x, y) => x.nome.localeCompare(y.nome, "pt-BR"));
const INTEIRAS = ordenar(RUAS.filter((r) => r.situacao === "inteira"));
const PARCIAIS = ordenar(RUAS.filter((r) => r.situacao === "parcial"));

function Secao({ s }: { s: (typeof SECOES)[number] }) {
  return (
    <section>
      <h2 className="text-xl font-extrabold text-vermelho">{s.titulo}</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5">
        {s.itens.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </section>
  );
}

function AreaDoConcurso() {
  return (
    <section id="area" className="scroll-mt-6">
      <h2 className="text-xl font-extrabold text-vermelho">Área do concurso e ruas participantes</h2>
      <p className="mt-3">
        Participam as casas dentro do contorno vermelho. Passe o dedo ou o mouse sobre uma rua para ver o nome.
      </p>
      <div className="mt-4">
        <MapaArea />
      </div>
      <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-tinta-suave">
        <span className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-6 rounded bg-dourado" /> rua inteira na área
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-6 rounded border-t-2 border-dashed border-[#ffb38a]" /> só um trecho na área
        </span>
      </p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="font-extrabold">Ruas inteiras ({INTEIRAS.length})</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {INTEIRAS.map((r) => (
              <li key={r.nome} className="flex justify-between gap-3 border-b border-borda pb-1">
                <span>{r.nome}</span>
                <span className="text-tinta-suave tabular-nums">{r.cep ?? "—"}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-extrabold">Só um trecho ({PARCIAIS.length})</h3>
          <p className="mt-1 text-sm text-tinta-suave">Participa só a parte da rua que fica dentro do contorno.</p>
          <ul className="mt-2 space-y-1 text-sm">
            {PARCIAIS.map((r) => (
              <li key={r.nome} className="flex justify-between gap-3 border-b border-borda pb-1">
                <span>{r.nome}</span>
                <span className="text-tinta-suave tabular-nums">{r.cep ?? "—"}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function PaginaRegulamento() {
  return (
    <>
      <Titulo titulo="Regulamento" subtitulo={`${EVENTO.nome} ${EVENTO.ano}`} />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="cartao space-y-8 p-6 sm:p-10">
          {SECOES.slice(0, 2).map((s) => (
            <Secao key={s.titulo} s={s} />
          ))}
          <AreaDoConcurso />
          {SECOES.slice(2).map((s) => (
            <Secao key={s.titulo} s={s} />
          ))}
        </div>
      </div>
    </>
  );
}
