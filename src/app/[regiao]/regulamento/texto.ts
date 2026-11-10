import { EVENTO } from "@/lib/config";
import { LISTA_REGIOES, type Regiao } from "@/lib/regioes";

/**
 * Texto oficial do regulamento (edição 2026), com os dados de cada região.
 * Trechos entre *asteriscos* aparecem em negrito.
 * Itens especiais: "mapa" (mapa da área), "ruas" (listas de ruas), "tabela-desempate" e "link" (atalho no site).
 */
export type ItemRegulamento =
  | string
  | { tipo: "mapa" | "ruas" | "tabela-desempate" }
  | { tipo: "link"; href: string; texto: string };

export interface SecaoRegulamento {
  numero: number;
  titulo: string;
  itens: ItemRegulamento[];
}

const IG = `@${EVENTO.instagram}`;

export const CRITERIOS_DESEMPATE: [string, string][] = [
  ["Iluminação e composição visual", "40%"],
  ["Criatividade e originalidade", "30%"],
  ["Identificação com o tema natalino", "20%"],
  ["Visibilidade a partir da rua", "10%"],
];

export function regulamentoDa(regiao: Regiao): SecaoRegulamento[] {
  const R = regiao.nome;
  const outra = LISTA_REGIOES.find((r) => r.id !== regiao.id)!;
  const inteiras = regiao.ruas.filter((r) => r.situacao === "inteira").length;
  const parciais = regiao.ruas.length - inteiras;
  return [
    {
      numero: 1,
      titulo: "Sobre o concurso",
      itens: [
        `1.1. O ${regiao.concurso} é um concurso comunitário destinado a valorizar a criatividade dos moradores, incentivar a decoração natalina e promover o espírito de união e confraternização no bairro ${R}, em Itaquaquecetuba, São Paulo.`,
        `1.2. O concurso é uma iniciativa de *${EVENTO.organizadorCompleto}, conhecido como ${EVENTO.organizador}*, responsável pela organização e divulgação da iniciativa.`,
        `1.3. As informações oficiais também poderão ser divulgadas pelo Instagram *${IG}*, sem prejuízo da publicação obrigatória das regras, dos comunicados e do resultado no site oficial.`,
        "1.4. A participação e a votação são inteiramente gratuitas, não sendo exigido qualquer pagamento, compra, doação ou contrapartida.",
        "1.5. O objetivo é eleger, por votação popular, a residência com decoração natalina que obtiver o maior número de votos válidos.",
        "1.6. *Haverá apenas uma residência vencedora, correspondente ao primeiro lugar.* Não haverá premiação para segundo ou terceiro colocados.",
        `1.7. O Natal Iluminado também é realizado no ${outra.nome}, em concurso independente, com inscrições, votação, apuração e residência vencedora próprias. Este regulamento trata do concurso do ${R}.`,
      ],
    },
    {
      numero: 2,
      titulo: "Quem pode participar",
      itens: [
        `2.1. Poderão participar exclusivamente residências localizadas no bairro ${R}, dentro do perímetro oficial delimitado em vermelho no mapa disponível no site.`,
        "2.2. A residência deverá estar localizada em uma das ruas elegíveis relacionadas neste regulamento, observadas as delimitações estabelecidas para ruas parcialmente incluídas.",
        "2.3. Cada residência poderá ter somente uma inscrição válida, independentemente da quantidade de moradores ou famílias.",
        "2.4. A inscrição deverá ser realizada por um morador maior de 18 anos ou por pessoa maior de 18 anos expressamente autorizada pelo responsável pela residência.",
        "2.5. A decoração deverá possuir elementos natalinos iluminados e estar instalada em área visível da rua, como fachada, muro, portão, janela ou quintal frontal.",
        "2.6. Não será exigida quantidade mínima de luzes, valor mínimo de investimento ou contratação de empresa especializada.",
        "2.7. Não serão aceitas inscrições de estabelecimentos exclusivamente comerciais, terrenos sem residência ou imóveis situados fora do perímetro oficial.",
        "2.8. Pessoas diretamente envolvidas na administração da votação, na apuração dos resultados ou na comissão de desempate não poderão inscrever suas próprias residências.",
      ],
    },
    {
      numero: 3,
      titulo: "Área do concurso e ruas participantes",
      itens: [
        `3.1. O concurso será realizado exclusivamente no ${R}, respeitando o contorno vermelho apresentado no mapa oficial.`,
        { tipo: "mapa" },
        `3.2. A área elegível está distribuída em ${inteiras} ruas integralmente incluídas e ${parciais} ruas parcialmente incluídas.`,
        { tipo: "ruas" },
        "3.3. Nas ruas parcialmente incluídas, somente poderão participar os imóveis cuja entrada principal esteja localizada no trecho compreendido pelo contorno vermelho do mapa oficial.",
        "3.4. A presença do nome de uma rua na relação não garante a participação de todos os seus imóveis. A localização efetiva da residência deverá atender à delimitação oficial.",
        "3.5. Em caso de dúvida sobre a localização, a organização realizará a conferência da marcação e do endereço cadastrado, utilizando o perímetro previamente publicado como referência.",
        "3.6. O mapa oficial será preservado como referência da edição de 2026. Eventuais correções técnicas deverão ser documentadas, justificadas e comunicadas aos participantes afetados.",
        `3.7. Residências situadas fora da área oficial não poderão participar, ainda que estejam próximas ao ${R}.`,
      ],
    },
    {
      numero: 4,
      titulo: "Inscrições",
      itens: [
        "4.1. As inscrições ocorrerão entre *9 e 30 de novembro de 2026*, exclusivamente pelo site oficial.",
        "4.2. O prazo de inscrição será encerrado em 30 de novembro de 2026, às 23h59, horário de Brasília.",
        "4.3. Para participar, o responsável deverá preencher o formulário com informações verdadeiras, identificar a residência, marcar sua localização no mapa e enviar de uma a três fotografias reais da decoração natalina.",
        "4.4. As fotografias deverão mostrar a decoração efetivamente instalada na residência participante.",
        "4.5. Não serão permitidas imagens de outras residências, fotografias retiradas da internet, imagens geradas por inteligência artificial ou montagens digitais que acrescentem elementos inexistentes à decoração.",
        "4.6. Pequenos ajustes de brilho, contraste e enquadramento serão permitidos, desde que não alterem a aparência real da decoração.",
        "4.7. O preenchimento do formulário não representa aprovação automática. A organização verificará o cumprimento das regras antes de homologar a inscrição.",
        "4.8. Cada residência aprovada receberá um número exclusivo para identificação na galeria e na votação.",
        "4.9. Em caso de inscrições duplicadas para o mesmo imóvel, prevalecerá a primeira inscrição válida, ressalvadas situações comprovadas de cadastro não autorizado.",
        "4.10. Inscrições com irregularidades poderão ser recusadas mediante apresentação do motivo e oportunidade de correção, quando possível dentro do calendário do concurso.",
        "4.11. Todas as residências aprovadas deverão ser disponibilizadas para votação no mesmo momento, assegurando igualdade no período de recebimento de votos.",
      ],
    },
    {
      numero: 5,
      titulo: "Votação popular",
      itens: [
        "5.1. A votação ocorrerá de *1º a 14 de dezembro de 2026*, exclusivamente no site oficial.",
        "5.2. Qualquer pessoa poderá votar, inclusive moradores de outros bairros e cidades, desde que cumpra as regras de identificação e votação.",
        "5.3. Cada CPF terá direito a somente um voto durante todo o concurso, destinado a uma única residência.",
        "5.4. O voto deverá ser realizado pelo próprio titular do CPF, sendo proibida a utilização de dados de terceiros, mesmo quando fornecidos voluntariamente para votação por outra pessoa.",
        "5.5. Após a confirmação do registro, o voto não poderá ser alterado ou transferido para outra residência.",
        "5.6. Serão considerados apenas os votos efetivamente registrados e validados pelo sistema oficial.",
        "5.7. Votos, curtidas, comentários, enquetes ou compartilhamentos realizados no Instagram, WhatsApp, Facebook ou outras plataformas não serão contabilizados.",
        "5.8. Os participantes poderão divulgar suas residências e solicitar votos livremente, desde que não utilizem métodos fraudulentos.",
        "5.9. É proibido oferecer dinheiro, presentes, brindes, sorteios ou qualquer benefício em troca de votos.",
        "5.10. É proibida a utilização de robôs, sistemas automatizados, perfis falsos, CPFs utilizados indevidamente ou mecanismos destinados a multiplicar artificialmente os votos.",
        "5.11. A utilização do mesmo aparelho ou da mesma rede de internet por pessoas diferentes não será considerada fraude por si só.",
        "5.12. A votação será encerrada às 23h59 do dia 14 de dezembro de 2026, horário de Brasília.",
      ],
    },
    {
      numero: 6,
      titulo: "Segurança e fiscalização dos votos",
      itens: [
        "6.1. A organização adotará procedimentos técnicos destinados a prevenir duplicidades, automações e tentativas de manipulação da votação.",
        "6.2. A quantidade de votos registrada durante a disputa terá caráter provisório até a conclusão da conferência.",
        "6.3. Votos identificados como potencialmente irregulares poderão ser submetidos à verificação técnica.",
        "6.4. A anulação de votos dependerá da identificação de irregularidade fundamentada e documentada.",
        "6.5. O crescimento repentino da votação de uma residência não será considerado, isoladamente, prova de fraude.",
        "6.6. A residência beneficiada por votos fraudulentos não será automaticamente desclassificada. A desclassificação dependerá de evidências de participação ou envolvimento do responsável na irregularidade.",
        "6.7. Antes de uma eventual desclassificação, o responsável terá direito de apresentar esclarecimentos e documentos.",
        "6.8. Os mesmos procedimentos de fiscalização serão aplicados a todos os participantes.",
        "6.9. As informações necessárias à conferência deverão ser preservadas pela organização durante o período de apuração e contestação, respeitada a legislação de proteção de dados.",
      ],
    },
    {
      numero: 7,
      titulo: "Manutenção da decoração",
      itens: [
        "7.1. A decoração deverá permanecer instalada durante todo o período de votação.",
        "7.2. A iluminação deverá estar disponível para apreciação noturna, ressalvadas interrupções justificadas por razões de segurança, manutenção ou falta de energia elétrica.",
        "7.3. A organização poderá solicitar fotografias complementares para confirmar que a decoração corresponde às imagens utilizadas na inscrição.",
        "7.4. Poderá ser realizada verificação visual da decoração a partir da via pública, sem ingresso no imóvel.",
        "7.5. A retirada definitiva da decoração durante o período de votação poderá resultar em desclassificação, após confirmação da situação e oportunidade de manifestação do responsável.",
        "7.6. Alterações que melhorem a decoração durante a disputa serão permitidas, desde que não envolvam a apresentação de imagens falsas ou de outro imóvel.",
      ],
    },
    {
      numero: 8,
      titulo: "Classificação e desempate",
      itens: [
        "8.1. Será considerada vencedora a residência que alcançar o maior número de votos válidos após a apuração.",
        "8.2. *Somente o primeiro colocado será premiado.*",
        "8.3. Em caso de empate no primeiro lugar, será realizada uma avaliação de desempate por uma comissão de três avaliadores imparciais designados antes da apuração final.",
        "8.4. A avaliação observará os seguintes critérios:",
        { tipo: "tabela-desempate" },
        "8.5. Cada avaliador atribuirá notas de 0 a 10 para cada critério. A pontuação final será calculada pela média das notas ponderadas dos três avaliadores.",
        "8.6. Persistindo o empate, será utilizada a maior média obtida, sucessivamente, nos critérios de iluminação, criatividade, temática natalina e visibilidade.",
        "8.7. Se a igualdade permanecer em todos os critérios, prevalecerá a inscrição válida registrada primeiro no sistema, considerando a data e o horário de envio.",
        "8.8. Os critérios não poderão ser modificados depois do início da votação.",
      ],
    },
    {
      numero: 9,
      titulo: "Apuração e reclamações",
      itens: [
        "9.1. Após o encerramento da votação, a organização realizará a conferência dos votos e das condições de participação.",
        "9.2. A classificação preliminar será divulgada em 15 de dezembro de 2026.",
        "9.3. Os responsáveis pelas residências inscritas poderão apresentar contestação fundamentada até as 18h do dia 16 de dezembro de 2026.",
        "9.4. As contestações deverão ser encaminhadas pelo canal oficial de recursos disponibilizado no site, com identificação do participante, descrição do fato e eventuais evidências.",
        { tipo: "link", href: `/${regiao.id}/contestacao`, texto: "Canal oficial de contestação" },
        "9.5. A organização analisará as contestações de maneira fundamentada e comunicará o resultado da análise ao interessado.",
        "9.6. O resultado definitivo será divulgado em *18 de dezembro de 2026*, após conclusão da conferência e dos recursos apresentados dentro do prazo.",
        "9.7. A classificação definitiva será baseada exclusivamente nos votos válidos e nas regras de desempate estabelecidas neste regulamento.",
        "9.8. A homologação do resultado encerrará a fase administrativa regular do concurso, sem prejuízo dos direitos assegurados pela legislação.",
      ],
    },
    {
      numero: 10,
      titulo: "Premiação",
      itens: [
        "10.1. O concurso contemplará *uma única residência vencedora, classificada em primeiro lugar*.",
        "10.2. Não haverá premiações para segundo lugar, terceiro lugar ou demais posições.",
        `10.3. *Prêmio do primeiro lugar: ${EVENTO.premio}.* A imagem do kit divulgada no site e nas redes é meramente ilustrativa.`,
        "10.4. A premiação deverá ser definida e divulgada oficialmente antes do início da competição, com informações sobre o que será entregue e as condições de recebimento.",
        "10.5. O prêmio será entregue ao responsável pela inscrição vencedora, mediante confirmação de sua identidade e da legitimidade da participação.",
        "10.6. A entrega será realizada sem cobrança de qualquer taxa ao vencedor.",
        "10.7. A data, o local e o prazo de entrega deverão ser estabelecidos previamente e comunicados pelo site oficial.",
        "10.8. A premiação anunciada não poderá ser reduzida unilateralmente ou substituída em prejuízo do participante, ressalvadas hipóteses legalmente admitidas.",
      ],
    },
    {
      numero: 11,
      titulo: "Uso de imagem e divulgação",
      itens: [
        `11.1. As fotografias enviadas poderão ser utilizadas na galeria do concurso, na apresentação dos participantes, na votação e na divulgação do ${regiao.concurso}.`,
        `11.2. A divulgação poderá ocorrer no site oficial e nos canais de comunicação do organizador, incluindo o Instagram *${IG}*.`,
        "11.3. A identificação das residências será realizada preferencialmente pelo número de participante e pelo nome da rua.",
        "11.4. A publicação do número exato do imóvel ou de sua localização precisa no mapa público dependerá de autorização específica do responsável.",
        "11.5. As imagens não poderão ser utilizadas para finalidades estranhas ao concurso sem fundamento legal adequado.",
        "11.6. A participação não obriga o morador a aparecer pessoalmente em fotografias ou vídeos.",
      ],
    },
    {
      numero: 12,
      titulo: "Proteção de dados pessoais — LGPD",
      itens: [
        "12.1. Os dados coletados serão utilizados para identificação de participantes, administração das inscrições, controle da votação, prevenção de fraudes, divulgação dos resultados e entrega da premiação.",
        "12.2. Os dados pessoais dos responsáveis, como telefone, e-mail e documentos, não serão publicados no site ou nas redes sociais.",
        "12.3. Os CPFs utilizados na votação deverão receber proteção técnica adequada, com medidas para impedir acesso não autorizado e exposição indevida.",
        "12.4. Os dados não poderão ser vendidos ou utilizados automaticamente para campanhas comerciais ou políticas.",
        "12.5. A coleta e o tratamento dos dados observarão a Lei Geral de Proteção de Dados Pessoais — Lei nº 13.709/2018.",
        "12.6. A política de privacidade do site deverá informar o responsável pelo tratamento, as finalidades, as bases legais, as medidas de proteção, o período de conservação e o canal de atendimento dos titulares.",
        { tipo: "link", href: "/privacidade", texto: "Política de privacidade do site" },
        "12.7. Os dados serão eliminados ou anonimizados quando não forem mais necessários, observando-se o prazo previsto de até 90 dias após o encerramento do concurso, ressalvadas hipóteses legais de conservação.",
      ],
    },
    {
      numero: 13,
      titulo: "Falhas técnicas",
      itens: [
        "13.1. A organização deverá manter mecanismos para registrar e identificar eventuais falhas no sistema de inscrições e votação.",
        "13.2. Em caso de falha técnica relevante que afete a igualdade entre participantes, a ocorrência será apurada e documentada.",
        "13.3. Eventuais medidas corretivas deverão ser justificadas publicamente e aplicadas de forma isonômica, respeitadas as exigências legais.",
        "13.4. Problemas individuais de conexão, aparelho ou navegador não garantirão o registro posterior de votos que não tenham sido confirmados pelo sistema.",
        "13.5. Nenhum voto poderá ser acrescentado manualmente à contagem sem previsão regulamentar e comprovação técnica de sua efetiva validação.",
      ],
    },
    {
      numero: 14,
      titulo: "Organização e comunicação oficial",
      itens: [
        `14.1. A organização do ${regiao.concurso} é de responsabilidade de *${EVENTO.organizadorCompleto} (${EVENTO.organizador})*.`,
        `14.2. O Instagram *${IG}* será um dos canais de divulgação da iniciativa, incluindo convites, informações, comunicados e apresentação do resultado.`,
        "14.3. O site do concurso será a referência oficial para inscrições, votação, consulta ao regulamento e publicação da classificação definitiva.",
        "14.4. Mensagens enviadas ao Instagram não substituirão inscrições, votos ou recursos apresentados pelos canais específicos do site.",
        "14.5. O concurso não exige que o participante siga o perfil do organizador, curta publicações ou compartilhe conteúdos para participar ou receber o prêmio.",
        "14.6. Nenhuma inscrição ou voto poderá ser condicionado a manifestação de apoio político ou pessoal ao organizador.",
      ],
    },
    {
      numero: 15,
      titulo: "Disposições gerais",
      itens: [
        "15.1. A inscrição implica ciência e concordância com as regras deste regulamento, respeitados os direitos legalmente assegurados.",
        "15.2. O regulamento deverá permanecer disponível no site durante todo o concurso.",
        "15.3. As regras de participação, votação, classificação e desempate não poderão ser modificadas arbitrariamente após o início da competição.",
        "15.4. Situações não previstas serão analisadas pela organização com base em critérios de transparência, igualdade entre os participantes, boa-fé e legislação aplicável.",
        "15.5. Toda decisão que resulte em anulação de votos ou desclassificação deverá ser fundamentada e documentada.",
        "15.6. A realização e a premiação do concurso ficam sujeitas à observância das exigências legais aplicáveis.",
      ],
    },
  ];
}

/** Quadro-resumo do fim do regulamento. */
export const resumoDa = (regiao: Regiao): [string, string][] => [
  ["Organização", `${EVENTO.organizadorCompleto} (${EVENTO.organizador})`],
  ["Instagram", IG],
  ["Área participante", `Exclusivamente ${regiao.nome} — Itaquaquecetuba/SP`],
  ["Premiação", `Exclusivamente primeiro lugar: ${EVENTO.premio}`],
  ["Resultado definitivo", "18 de dezembro de 2026"],
];
