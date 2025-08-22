-- Initial CRM and marketing schema with RLS and storage

-- Enums
create type membership_role as enum ('owner','admin','member');
create type campaign_status as enum ('draft','scheduled','sending','sent');
create type email_status as enum ('pending','sending','sent','failed');

-- Helper functions
create function public.is_org_member(uid uuid, org uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.memberships m
    where m.user_id = uid and m.org_id = org
  );
$$;

create function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Tables
create table public.profiles (
  id uuid primary key references auth.users(id),
  display_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.touch_updated_at();

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger organizations_updated_at before update on public.organizations
  for each row execute function public.touch_updated_at();

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role membership_role not null default 'member',
  created_at timestamptz default now()
);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  first_name text,
  last_name text,
  email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger contacts_updated_at before update on public.contacts
  for each row execute function public.touch_updated_at();

create table public.segments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger segments_updated_at before update on public.segments
  for each row execute function public.touch_updated_at();

create table public.segment_members (
  segment_id uuid references public.segments(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete cascade,
  org_id uuid not null references public.organizations(id) on delete cascade,
  primary key (segment_id, contact_id)
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  content_json jsonb,
  status campaign_status not null default 'draft',
  scheduled_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger campaigns_updated_at before update on public.campaigns
  for each row execute function public.touch_updated_at();

create table public.campaign_segments (
  campaign_id uuid references public.campaigns(id) on delete cascade,
  segment_id uuid references public.segments(id) on delete cascade,
  primary key (campaign_id, segment_id)
);

create table public.emails (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns(id) on delete cascade,
  recipient text not null,
  status email_status not null default 'pending',
  created_at timestamptz default now()
);

create table public.sequences (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger sequences_updated_at before update on public.sequences
  for each row execute function public.touch_updated_at();

create table public.sequence_steps (
  id uuid primary key default gen_random_uuid(),
  sequence_id uuid references public.sequences(id) on delete cascade,
  step_order integer not null,
  wait_days integer default 0,
  template jsonb,
  created_at timestamptz default now()
);

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  path text not null,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
create policy "profile_self" on public.profiles
  for select using (id = auth.uid());
create policy "profile_self_update" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

alter table public.organizations enable row level security;
create policy "org_members_select" on public.organizations
  for select using (public.is_org_member(auth.uid(), id));

alter table public.memberships enable row level security;
create policy "select_own_membership" on public.memberships
  for select using (user_id = auth.uid());
create policy "manage_memberships" on public.memberships
  for all using (
    exists (select 1 from public.memberships m
      where m.org_id = memberships.org_id
        and m.user_id = auth.uid()
        and m.role in ('admin','owner')
    )
  ) with check (
    exists (select 1 from public.memberships m
      where m.org_id = memberships.org_id
        and m.user_id = auth.uid()
        and m.role in ('admin','owner')
    )
  );

-- Apply standard org policies
-- tables: contacts, segments, segment_members, campaigns, campaign_segments, emails, sequences, sequence_steps, assets
alter table public.contacts enable row level security;
alter table public.segments enable row level security;
alter table public.segment_members enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_segments enable row level security;
alter table public.emails enable row level security;
alter table public.sequences enable row level security;
alter table public.sequence_steps enable row level security;
alter table public.assets enable row level security;

DO $$
DECLARE tbl text;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'contacts','segments','segment_members','campaigns','campaign_segments','emails','sequences','sequence_steps','assets'
  ]) LOOP
    EXECUTE format('create policy org_select on public.%I for select using (public.is_org_member(auth.uid(), org_id));', tbl);
    EXECUTE format('create policy org_modify on public.%I for insert with check (public.is_org_member(auth.uid(), org_id));', tbl);
    EXECUTE format('create policy org_update on public.%I for update using (public.is_org_member(auth.uid(), org_id)) with check (public.is_org_member(auth.uid(), org_id));', tbl);
    EXECUTE format('create policy org_delete on public.%I for delete using (public.is_org_member(auth.uid(), org_id));', tbl);
  END LOOP;
END $$;

-- Storage bucket and policies
insert into storage.buckets (id, name, public)
values ('uploads','uploads', true)
on conflict do nothing;

alter table storage.objects enable row level security;
create policy "uploads_public_read" on storage.objects
  for select using (bucket_id = 'uploads');
create policy "uploads_member_write" on storage.objects
  for all using (
    bucket_id = 'uploads' and public.is_org_member(auth.uid(), split_part(name,'/',1)::uuid)
  ) with check (
    bucket_id = 'uploads' and public.is_org_member(auth.uid(), split_part(name,'/',1)::uuid)
  );
