# Segments & Marketing Plan

## File Tree
```
src/
  app/
    contacts/
      SegmentsSection.tsx        # card list on /contacts
      segments/[segmentId]/page.tsx
    campaigns/
      [campaignId]/page.tsx
      new/page.tsx
    sequences/
      [sequenceId]/page.tsx
      new/page.tsx
  components/
    marketing/
      CampaignComposer.tsx
      SequenceEditor.tsx
      BreadcrumbPortal.tsx
      AutosaveBadge.tsx
      SegmentDetail.tsx
  lib/
    autosave.ts
    auth/org.ts
    email/render.ts
  api/
    segments/route.ts            # GET, POST
    segments/[segmentId]/route.ts
    segments/[segmentId]/members/route.ts
    campaigns/route.ts
    campaigns/[campaignId]/route.ts
    campaigns/[campaignId]/send/route.ts
    sequences/route.ts
    sequences/[sequenceId]/route.ts
    sequences/[sequenceId]/steps/route.ts
```

## Data Model (Prisma)
```prisma
model Org {
  id          String  @id @default(cuid())
  name        String
  users       OrgUser[]
  contacts    Contact[]
  segments    Segment[]
  campaigns   Campaign[]
  sequences   Sequence[]
  @@index([name])
}

model OrgUser {
  id        String   @id @default(cuid())
  userId    String
  orgId     String
  role      OrgRole  @default(MEMBER)
  org       Org      @relation(fields: [orgId], references: [id])
  @@unique([userId, orgId])
}

enum OrgRole {
  OWNER
  ADMIN
  MEMBER
}

model Contact {
  id       String @id @default(cuid())
  orgId    String
  email    String
  name     String?
  org      Org    @relation(fields: [orgId], references: [id])
  segments SegmentMember[]
  @@index([orgId, email], name: "contact_org_email")
}

model Segment {
  id        String @id @default(cuid())
  orgId     String
  name      String
  dslJson   Json
  members   SegmentMember[]
  campaigns Campaign[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  org       Org @relation(fields: [orgId], references: [id])
  @@index([orgId, name])
}

model SegmentMember {
  segmentId String
  contactId String
  orgId     String
  segment   Segment @relation(fields: [segmentId], references: [id])
  contact   Contact @relation(fields: [contactId], references: [id])
  @@id([segmentId, contactId])
  @@index([orgId])
}

model Campaign {
  id          String @id @default(cuid())
  orgId       String
  name        String
  contentJson Json
  status      CampaignStatus @default(DRAFT)
  sendAt      DateTime?
  segmentId   String?
  segment     Segment? @relation(fields: [segmentId], references: [id])
  org         Org @relation(fields: [orgId], references: [id])
  @@index([orgId, status])
}

enum CampaignStatus {
  DRAFT
  SCHEDULED
  SENT
}

model Sequence {
  id        String @id @default(cuid())
  orgId     String
  name      String
  steps     SequenceStep[]
  segmentId String?
  segment   Segment? @relation(fields: [segmentId], references: [id])
  org       Org @relation(fields: [orgId], references: [id])
  @@index([orgId])
}

model SequenceStep {
  id         String @id @default(cuid())
  sequenceId String
  delayHours Int
  contentJson Json
  order      Int
  sequence   Sequence @relation(fields: [sequenceId], references: [id])
  @@index([sequenceId, order], name: "step_order")
}
```

## API Contracts
- `GET /api/segments` → { segments[], nextCursor }
- `POST /api/segments` { name, dslJson } → { segment }
- `GET /api/segments/:id` → { segment, members[] }
- `PATCH /api/segments/:id` { name?, dslJson? }
- `DELETE /api/segments/:id`
- `POST /api/segments/:id/members` { contactIds: string[] }
- `DELETE /api/segments/:id/members` { contactIds: string[] }
- `GET /api/campaigns` → { campaigns[], nextCursor }
- `POST /api/campaigns` { name, contentJson, segmentId?, sendAt? }
- `PATCH /api/campaigns/:id` { name?, contentJson?, sendAt?, status? }
- `POST /api/campaigns/:id/send` { sendAt? }
- `GET /api/sequences` → { sequences[], nextCursor }
- `POST /api/sequences` { name, steps: StepDTO[], segmentId? }
- `PATCH /api/sequences/:id` { name?, segmentId? }
- `PATCH /api/sequences/:id/steps` { steps: StepDTO[] }

All endpoints respond 200 on success, 400 on validation error, 401 unauthenticated, 403 unauthorized, 404 missing, 500 server error.

## UI Components
- `SegmentsSection`: props { segments: Segment[] }
- `SegmentDetail`: props { segment: Segment, members: Contact[] }
- `CampaignComposer`: props { draft: CampaignDraft, onChange(draft) }
- `SequenceEditor`: props { draft: SequenceDraft, onChange(draft) }
- `BreadcrumbPortal`: props { children }
- `AutosaveBadge`: props { saved: boolean }

## Autosave Pattern
- Draft state stored in local component.
- `useDebounce` 1s, call POST `/api/campaigns/:id` or `/api/sequences/:id` with `{ contentJson, updatedAt }`.
- Optimistically set `saved=true` and rollback on error.

## Security
- `orgId` derived from session JWT; all queries filtered by orgId.
- RLS: Supabase policies enforce `row.orgId = auth.org_id`.
- Roles: OWNER/ADMIN can delete; MEMBER can create/edit; read allowed for org members.

## Testing Plan
- Unit: Zod schemas, Prisma utilities for org scoping.
- API: route handlers with mocked auth; verify RLS and validation.
- UI: SegmentsSection renders, autosave triggers, sequence step reorder.

## Open Questions & Recommendations
- **Segment DSL**: start with simple AND of field comparisons; extend later.
- **Email Blocks**: JSON schema mapping to table-based HTML via `lib/email/render.ts`.
- **Scheduler**: use Postgres `pg_cron` or external worker; MVP uses immediate send and cron job for future times.
- **Rate Limits**: consider per-org throttling later.

## Deviations from Draft
- Added `BreadcrumbPortal` instead of SiteHeader modification to keep concerns separated.
- Combined autosave for campaigns and sequences into shared `autosave.ts` for DRYness.

