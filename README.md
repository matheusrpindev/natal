# 🎄 Natal Iluminado no Scaffid II

Site do concurso de decoração de Natal do Scaffid II, uma iniciativa de **Marcos Teles**.

| Página | O que faz |
|---|---|
| `/` | Apresentação, contagem regressiva e chamada da fase atual |
| `/inscricao` | Formulário de inscrição com até 3 fotos (abre de 09/11 a 30/11) |
| `/casas` | Galeria e mapa das casas aprovadas |
| `/votar` | Votação, 1 voto por CPF, com mapa/roteiro das casas |
| `/resultado` | Pódio e ranking (aparece a partir de 18/12) |
| `/regulamento` | Regulamento (rascunho, revisar) |
| `/admin` | Painel da organização: aprovar inscrições, apuração ao vivo, exportar CSV, controle de fase |

**Quem define a fase é a organização**, no painel `/admin`: Em breve → Inscrições → Votação → Votação encerrada → Resultado. O menu do site mostra só o que vale na fase atual (ex.: nas inscrições aparece só "Inscrever minha casa"). As datas em `src/lib/config.ts` servem apenas para os textos e a contagem regressiva.

## Rodar no computador

```bash
npm install
npm run dev
```

Abra http://localhost:3000. Sem configurar nada, os dados ficam em `.data/` (modo de teste) e a senha do painel é `natal2026`.

## Publicar (Supabase + Vercel, plano gratuito)

1. **Supabase**: crie um projeto em https://supabase.com, abra o *SQL Editor*, cole o conteúdo de `supabase/schema.sql` e clique em *Run*. Isso cria as tabelas e o bucket de fotos.
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
- **Área do concurso (mapa da inscrição)**: contorno em `src/lib/area.ts`, reproduzido do desenho no Google Earth. Para deixar exato, exporte o desenho como KML e troque os pontos. A inscrição só é aceita com a casa marcada dentro da área (conferido também no servidor).
- **Ruas participantes**: `src/lib/ruas.ts` (nome oficial e CEP dos Correios, traçado do OpenStreetMap; "inteira" ou "parcial"). Aparecem no regulamento, no "Minha casa pode participar?" da página inicial e no preenchimento do CEP da inscrição.
- **Foto do Marcos**: salve em `public/marcos.jpg` (aparece na seção "Uma iniciativa de" da página inicial).
- **Logo**: salve em `public/logo.png` e siga o comentário em `src/components/Logo.tsx`
- **Prêmios**: seção "Prêmios" em `src/app/page.tsx`
- **Regulamento**: `src/app/regulamento/page.tsx`

## Segurança e privacidade

- O CPF **nunca é salvo**: o banco guarda só um hash (HMAC-SHA256), que garante 1 voto por CPF.
- Os CPFs são validados pelos dígitos verificadores. Mesmo assim, existem geradores de CPF válido na internet. Para auditoria, cada voto registra também o IP (só como hash) e o navegador, consultáveis na tabela `votos` do Supabase.
- Telefone e e-mail dos inscritos aparecem só no painel da organização.
