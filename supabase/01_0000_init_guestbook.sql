-- Create the guestbook table
create table public.guestbook (
  id uuid not null default gen_random_uuid (),
  created_at timestamptz not null default now(),
  name text not null,
  message text not null,
  constraint guestbook_pkey primary key (id)
);

-- Set up Row Level Security (RLS)
-- Enable RLS
alter table public.guestbook enable row level security;

-- Create Policy: Allow anonymous users to select (read) rows
create policy "Allow public read access"
on public.guestbook
for select
to anon
using (true);

-- Create Policy: Allow anonymous users to insert (write) rows
create policy "Allow public insert access"
on public.guestbook
for insert
to anon
with check (true);

-- Create Policy: Allow anonymous users to delete rows
create policy "Allow public delete access"
on public.guestbook
for delete
to anon
using (true);
