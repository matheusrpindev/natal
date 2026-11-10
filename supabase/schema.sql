-- Natal Iluminado (Scaffid II e Parque Residencial Marengo) — estrutura do banco (Supabase / Postgres)
-- Cole este arquivo inteiro no SQL Editor do Supabase e clique em "Run".
-- Pode ser rodado de novo sem perder dados: só cria o que estiver faltando.

create table if not exists inscricoes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  protocolo text not null unique,
  status text not null default 'pendente' check (status in ('pendente', 'aprovada', 'recusada')),
  -- Região (concurso) da casa
  regiao text not null default 'scaffid-ii' check (regiao in ('scaffid-ii', 'marengo')),
  -- Número público da casa, único dentro da região
  numero int,
  responsavel text not null,
  whatsapp text not null,
  email text,
  cep text,
  rua text not null,
  numero_casa text not null,
  complemento text,
  titulo text,
  descricao text,
  latitude double precision,
  longitude double precision,
  fotos text[] not null default '{}',
  miniaturas text[] not null default '{}',
  -- Autorização específica para mostrar o número da casa e o ponto no mapa público (regulamento 11.4)
  autoriza_localizacao boolean not null default false
);
-- Para bancos criados antes do mapa:
alter table inscricoes add column if not exists cep text;
alter table inscricoes add column if not exists miniaturas text[] not null default '{}';
alter table inscricoes add column if not exists latitude double precision;
alter table inscricoes add column if not exists longitude double precision;
-- Para bancos criados antes do regulamento oficial:
alter table inscricoes add column if not exists autoriza_localizacao boolean not null default false;
-- Para bancos criados antes das duas regiões:
alter table inscricoes add column if not exists regiao text not null default 'scaffid-ii';
alter table inscricoes drop constraint if exists inscricoes_regiao_check;
alter table inscricoes add constraint inscricoes_regiao_check check (regiao in ('scaffid-ii', 'marengo'));
alter table inscricoes drop constraint if exists inscricoes_numero_key;
create unique index if not exists inscricoes_regiao_numero_idx on inscricoes (regiao, numero);

create table if not exists votos (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  inscricao_id uuid not null references inscricoes(id) on delete cascade,
  -- O CPF nunca é salvo: guardamos só um hash (HMAC) para garantir 1 voto por CPF.
  cpf_hash text not null unique,
  nome text not null,
  ip_hash text,
  user_agent text
);
create index if not exists votos_inscricao_idx on votos (inscricao_id);

-- Contestações da classificação preliminar (regulamento 9.3 e 9.4)
create table if not exists contestacoes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  protocolo text not null unique,
  status text not null default 'recebida' check (status in ('recebida', 'respondida')),
  regiao text not null default 'scaffid-ii',
  protocolo_inscricao text not null,
  nome text not null,
  whatsapp text not null,
  email text,
  descricao text not null,
  evidencias text
);

alter table contestacoes add column if not exists regiao text not null default 'scaffid-ii';

create table if not exists configuracoes (
  chave text primary key,
  valor text not null
);

create or replace view contagem_votos with (security_invoker = true) as
  select inscricao_id, count(*)::int as total from votos group by inscricao_id;

-- Aprova/recusa e atribui o número público da casa (sequência própria de cada região) de forma atômica.
create or replace function mudar_status_inscricao(p_id uuid, p_status text)
returns void language plpgsql as $$
begin
  lock table inscricoes in share row exclusive mode;
  update inscricoes
     set status = p_status,
         numero = case
           when p_status = 'aprovada' and numero is null
             then (select coalesce(max(i.numero), 0) + 1 from inscricoes i where i.regiao = inscricoes.regiao)
           else numero
         end
   where id = p_id;
end $$;

-- O site acessa o banco só pelo servidor (service role). Bloqueia o acesso público direto.
alter table inscricoes enable row level security;
alter table votos enable row level security;
alter table configuracoes enable row level security;
alter table contestacoes enable row level security;
revoke all on inscricoes, votos, configuracoes, contestacoes, contagem_votos from anon, authenticated;
revoke execute on function mudar_status_inscricao(uuid, text) from public, anon, authenticated;

-- Bucket público para as fotos das casas
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do nothing;
