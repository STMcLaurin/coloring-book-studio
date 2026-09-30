alter table public.publications add column if not exists marketplace text;
alter table public.publications add column if not exists status text not null default 'draft';
alter table public.publications add column if not exists price numeric(10,2);
alter table public.publications add column if not exists product_url text;
alter table public.publications add column if not exists published_at timestamptz;
alter table public.publications add column if not exists notes text;
create index if not exists publications_user_id_idx on public.publications(user_id);
create index if not exists publications_book_id_idx on public.publications(book_id);