import type { Metadata } from "next";
import Link from "next/link";
import { Titulo } from "@/components/Titulo";
import { EVENTO } from "@/lib/config";

export const metadata: Metadata = { title: "Política de privacidade" };

const IG = `@${EVENTO.instagram}`;

const SECOES: { titulo: string; itens: React.ReactNode[] }[] = [
  {
    titulo: "1. Quem é o responsável pelos dados",
    itens: [
      <>
        O controlador dos dados é <strong>{EVENTO.organizadorCompleto}</strong> ({EVENTO.organizador}), organizador do{" "}
        {EVENTO.nome}.
      </>,
      <>
        Canal de atendimento dos titulares: mensagem direta no Instagram <strong>{IG}</strong>. Pedidos sobre dados pessoais
        (acesso, correção, eliminação e outros) são respondidos por esse canal.
      </>,
    ],
  },
  {
    titulo: "2. Quais dados coletamos",
    itens: [
      <>
        <strong>Na inscrição:</strong> nome do responsável, WhatsApp, e-mail (opcional), CEP e endereço da casa, ponto
        marcado no mapa, nome e descrição da decoração (opcionais) e de 1 a 3 fotos da decoração.
      </>,
      <>
        <strong>Na votação:</strong> nome de quem vota e o CPF. O CPF <strong>não é guardado</strong>: o site guarda só um
        código criptográfico (hash HMAC) gerado a partir dele, que serve para saber se aquele CPF já votou. Também
        guardamos um código do endereço de internet (IP, em hash) e o tipo de navegador, para a conferência de fraudes.
      </>,
      <>
        <strong>Na contestação:</strong> protocolo da inscrição, nome, WhatsApp, e-mail (opcional), a descrição do fato e as
        evidências enviadas.
      </>,
    ],
  },
  {
    titulo: "3. Para que usamos (finalidades)",
    itens: [
      "Identificar os participantes e administrar as inscrições.",
      "Controlar a votação (um voto por CPF) e prevenir e apurar fraudes.",
      "Analisar contestações e divulgar a classificação e o resultado.",
      "Entrar em contato com os participantes sobre o concurso e entregar o prêmio.",
      "Os dados não são vendidos nem usados para campanhas comerciais ou políticas.",
    ],
  },
  {
    titulo: "4. Bases legais (LGPD, Lei nº 13.709/2018)",
    itens: [
      <>
        <strong>Inscrição e contestação:</strong> execução das regras do concurso aceitas pelo participante (art. 7º, V) e
        consentimento para a divulgação das fotos e do nome da rua (art. 7º, I).
      </>,
      <>
        <strong>Número da casa e ponto no mapa público:</strong> só com a autorização específica marcada na inscrição
        (consentimento, art. 7º, I). Sem ela, a casa aparece só com o nome da rua.
      </>,
      <>
        <strong>CPF em hash, IP em hash e navegador:</strong> legítimo interesse de garantir uma votação justa, com um voto
        por pessoa e prevenção de fraudes (art. 7º, IX), com o mínimo de dados necessário.
      </>,
    ],
  },
  {
    titulo: "5. O que é público",
    itens: [
      "São públicos: fotos da decoração, nome da casa, descrição, número de participante, nome da rua e quantidade de votos na classificação.",
      "O número da casa e o ponto no mapa só aparecem com autorização específica do responsável.",
      "Nunca são publicados: nome do responsável, telefone, e-mail, CPF ou dados de quem votou.",
    ],
  },
  {
    titulo: "6. Como protegemos",
    itens: [
      "O banco de dados só é acessado pelo servidor do site; o acesso público direto é bloqueado.",
      "O CPF é transformado em hash com uma chave secreta antes de ser guardado. Não é possível recuperar o CPF a partir dele.",
      "O painel da organização é protegido por senha.",
      "Serviços usados para operar o site: Vercel (hospedagem), Supabase (banco de dados e fotos), ViaCEP (consulta de CEP feita pelo seu navegador) e mapas da Esri e do OpenStreetMap. Os servidores desses serviços podem ficar fora do Brasil.",
    ],
  },
  {
    titulo: "7. Por quanto tempo guardamos",
    itens: [
      "Os dados são eliminados ou anonimizados até 90 dias após o encerramento do concurso, salvo quando a lei exigir guardar por mais tempo.",
      "As informações necessárias à conferência dos votos ficam guardadas durante a apuração e o prazo de contestação.",
    ],
  },
  {
    titulo: "8. Seus direitos",
    itens: [
      <>
        Você pode pedir confirmação de que tratamos seus dados, acesso, correção, eliminação, informações sobre
        compartilhamento e revogar consentimentos, pelo Instagram <strong>{IG}</strong>.
      </>,
      "A revogação da autorização de número e mapa vale a partir do pedido. Pedir a exclusão da inscrição durante o concurso retira a casa da disputa.",
    ],
  },
];

export default function PaginaPrivacidade() {
  return (
    <>
      <Titulo titulo="Privacidade" subtitulo={`Como o ${EVENTO.nome} cuida dos seus dados pessoais.`} />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="cartao space-y-8 p-6 sm:p-10">
          {SECOES.map((s) => (
            <section key={s.titulo}>
              <h2 className="text-xl font-extrabold text-vermelho uppercase">{s.titulo}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                {s.itens.map((i, k) => (
                  <li key={k}>{i}</li>
                ))}
              </ul>
            </section>
          ))}
          <p className="text-sm text-tinta-suave">
            Esta política complementa o item 12 do{" "}
            <Link href="/regulamento#secao-12" className="font-bold text-verde underline">
              regulamento
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
