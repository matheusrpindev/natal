-- Natal Iluminado no Scaffid II — estrutura do banco (Supabase / Postgres)
-- Cole este arquivo inteiro no SQL Editor do Supabase e clique em "Run".

create table if not exists inscricoes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  protocolo text not null unique,
  status text not null default 'pendente' check (status in ('pendente', 'aprovada', 'recusada')),
  numero int unique,
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
  fotos text[] not null default '{}'
);
-- Para bancos criados antes do mapa:
alter table inscricoes add column if not exists cep text;
alter table inscricoes add column if not exists latitude double precision;
alter table inscricoes add column if not exists longitude double precision;

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

create table if not exists configuracoes (
  chave text primary key,
  valor text not null
);

create or replace view contagem_votos with (security_invoker = true) as
  select inscricao_id, count(*)::int as total from votos group by inscricao_id;

-- Aprova/recusa e atribui o número público da casa de forma atômica.
create or replace function mudar_status_inscricao(p_id uuid, p_status text)
returns void language plpgsql as $$
begin
  lock table inscricoes in share row exclusive mode;
  update inscricoes
     set status = p_status,
         numero = case
           when p_status = 'aprovada' and numero is null
             then (select coalesce(max(numero), 0) + 1 from inscricoes)
           else numero
         end
   where id = p_id;
end $$;

-- O site acessa o banco só pelo servidor (service role). Bloqueia o acesso público direto.
alter table inscricoes enable row level security;
alter table votos enable row level security;
alter table configuracoes enable row level security;
revoke all on inscricoes, votos, configuracoes, contagem_votos from anon, authenticated;
revoke execute on function mudar_status_inscricao(uuid, text) from public, anon, authenticated;

-- Bucket público para as fotos das casas
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do nothing;
