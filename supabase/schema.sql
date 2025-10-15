-- Supabase / Postgres schema for kumarpoojastore

-- products table
create table if not exists products (
  id text primary key,
  slug text,
  name text,
  description text,
  images jsonb,
  stock int
);

-- orders table
create table if not exists orders (
  id text primary key,
  created_at timestamptz default now(),
  data jsonb,
  status text
);
