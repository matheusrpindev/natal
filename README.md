# 🎄 Natal Iluminado do Scaffid II

Site do concurso de decoração de Natal do Scaffid II, uma iniciativa de **Marcos Teles** (Marcos Diego Teles Monteiro, Instagram @omarcosteles).

Agora são **dois concursos** com o mesmo calendário e o mesmo prêmio (kit churrasco para o 1º lugar de cada bairro):
**Scaffid II** (`/scaffid-ii`) e **Parque Residencial Marengo** (`/marengo`). Cada um tem área, ruas, inscrições,
numeração das casas, votação (1 voto por CPF em cada bairro), contestações e vencedor próprios. Os endereços antigos
(`/inscricao`, `/votar`...) levam ao Scaffid II.

| Página | O que faz |
|---|---|
| `/` | Página de entrada: prêmio, botão "Inscreva minha casa" / "Votar" e escolha do bairro |
| `/<regiao>` | Início do bairro: contagem regressiva, "Minha casa pode participar?", prêmio |
| `/<regiao>/inscricao` | Inscrição com até 3 fotos e marcação no mapa |
| `/<regiao>/casas` | Galeria e mapa das casas aprovadas |
| `/<regiao>/votar` | Votação, 1 voto por CPF no bairro |
| `/<regiao>/resultado` | Classificação preliminar e resultado definitivo |
| `/<regiao>/contestacao` | Contestação da classificação preliminar (até 16/12 às 18h) |
| `/<regiao>/regulamento` | Resumo das regras, mapa e ruas, com link para o PDF |
| `/<regiao>/regulamento/completo` | Regulamento completo (texto em `src/app/[regiao]/regulamento/texto.ts`) |
| `/privacidade` | Política de privacidade (LGPD) |
| `/admin` | Painel: fase (vale para os dois bairros), abas por bairro com inscrições, apuração, contestações e CSV |

**Quem define a fase é a organização**, no painel `/admin`: Em breve → Inscrições → Votação → Votação encerrada → Classificação preliminar (15/12, abre contestações) → Resultado definitivo (18/12). O menu do site mostra só o que vale na fase atual. As datas em `src/lib/config.ts` servem apenas para os textos e a contagem regressiva.

**PDF do regulamento**: fica em `public/regulamentos/`. Se mudar o texto, gere de novo com o site rodando:
`node scripts/gerar-pdf-regulamento.cjs http://localhost:3000`

## Rodar no computador

```bash
npm install
npm run dev
```

Abra http://localhost:3000. Sem configurar nada, os dados ficam em `.data/` (modo de teste) e a senha do painel é `natal2026`.

## Publicar (Supabase + Vercel, plano gratuito)

1. **Supabase**: crie um projeto em https://supabase.com, abra o *SQL Editor*, cole o conteúdo de `supabase/schema.sql` e clique em *Run*. Isso cria as tabelas e o bucket de fotos. O arquivo pode ser rodado de novo sem perder dados: rode outra vez sempre que ele mudar (ex.: autorização de número/mapa e contestações).
2. Copie a **Project URL** (*Project Settings → Data API*) e a **secret key** (*Project Settings → API Keys*; a antiga **service_role** também funciona).
3. **GitHub**: suba este projeto para um repositório.
4. **Vercel**: em https://vercel.com, importe o repositório e configure as variáveis de ambiente:

| Variável | Valor |
|---|---|
| `SUPABASE_URL` | Project URL do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | chave service_role (nunca compartilhe) |
| `ADMIN_PASSWORD` | senha do painel `/admin` |
| `APP_SECRET` | texto aleatório longo, com 32+ caracteres |

5. (Opcional) Compre um domínio no Registro.br e conecte na Vercel.

O arquivo `vercel.json` agenda uma chamada diária a `/api/saude`, que consulta o banco e impede o Supabase gratuito de pausar por inatividade.

> ⚠️ **Não troque o `APP_SECRET` depois que a votação começar.** Ele é usado para criptografar os CPFs, e trocar o valor permitiria que um CPF votasse de novo.

## Personalizar

- **Datas, nome e organizador**: `src/lib/config.ts`
- **Fonte dos títulos (P22 Yule Heavy Snow)**: coloque o arquivo em `public/fonts/p22-yule-heavy-snow.woff2` (veja `public/fonts/LEIA-ME.txt`). Sem o arquivo, os títulos usam a Mountains of Christmas.
- **Bairros**: `src/lib/regioes.ts` (nome, logo, contorno e ruas de cada bairro).
- **Área do concurso (mapa da inscrição)**: contornos em `src/lib/dados/<regiao>-area.json` (Scaffid II: desenho no Google Earth; Marengo: limite do bairro no Google Maps). Para deixar exato, exporte o desenho como KML e troque os pontos. A inscrição só é aceita com a casa marcada dentro da área do bairro (conferido também no servidor).
- **Ruas participantes**: `src/lib/dados/<regiao>-ruas.json` (nome oficial e CEPs dos Correios, traçado do OpenStreetMap recortado na área; "inteira" ou "parcial").
- **Foto do Marcos**: salve em `public/marcos.jpg` (aparece na seção "Uma iniciativa de" da página inicial).
- **Logo**: salve em `public/logo.png` e siga o comentário em `src/components/Logo.tsx`
- **Prêmio do 1º lugar** (o mesmo nos dois bairros): `premio` e `fotoPremio` em `src/lib/config.ts`. A foto aparece sempre com o aviso "imagem meramente ilustrativa".
- **Regulamento**: texto em `src/app/regulamento/texto.ts`
- **Número da casa e ponto no mapa público**: só aparecem quando o responsável marca a autorização na inscrição (regulamento 11.4). O painel mostra quem não autorizou.

## Segurança e privacidade

- O CPF **nunca é salvo**: o banco guarda só um hash (HMAC-SHA256), que garante 1 voto por CPF.
- Os CPFs são validados pelos dígitos verificadores. Mesmo assim, existem geradores de CPF válido na internet. Para auditoria, cada voto registra também o IP (só como hash) e o navegador, consultáveis na tabela `votos` do Supabase.
- Telefone e e-mail dos inscritos aparecem só no painel da organização.
