# Database Setup

## Schema Map
Tables use `snake_case` and live in `supabase/migrations/`. Key tables:
- `profiles`
- `organizations`
- `memberships` (`role` enum: owner, admin, member)
- `contacts`, `segments`, `segment_members`
- `campaigns`, `campaign_segments`, `emails`
- `sequences`, `sequence_steps`
- `assets` (storage metadata)

Helper functions:
- `is_org_member(uid, org_id)`
- `touch_updated_at` trigger to maintain `updated_at`

## Policy Matrix
RLS enabled on all tables.
- `profiles`: users may read/update their own row.
- `organizations`: visible if `is_org_member`.
- `memberships`: users see their own; admins/owners manage.
- Org-scoped tables (contacts, segments, segment_members, campaigns, campaign_segments, emails, sequences, sequence_steps, assets): members can read/write within their organization.

Storage bucket `uploads` is public read; write restricted to org members by prefix `<org_id>/`.

## Seed Data
`supabase/seed.sql` provides a sample org, one owner membership, five contacts, two segments, a campaign, a sequence and an asset record.  After signup replace the placeholder user id in `memberships` with the real user:
```
update memberships set user_id = '<real-user-id>' where role = 'owner';
```

## CLI
```
# reset local database and apply migrations
supabase db reset
# apply seed data
supabase db query < supabase/seed.sql
# push to remote after verification
supabase db push
```

## Test Checklist
- Member CRUD within org
- Non-member access denied
- Storage upload/read with org scoping
- Scheduler picks up `scheduled` campaigns
