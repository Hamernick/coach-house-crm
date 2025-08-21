# Marketing Module Design Brief

## File Map
```
src/
  app/
    marketing/
      page.tsx                      # dashboard
      campaigns/
        page.tsx                    # list
        new/page.tsx                # create
        [id]/page.tsx               # composer
      templates/
        page.tsx                    # list
        new/page.tsx                # create
        [id]/page.tsx               # edit
  components/marketing/
    Dashboard.tsx                   # stats & recent
    CampaignComposer.tsx
    RecipientsTable.tsx
    TemplateGrid.tsx
    TemplateEditor.tsx
    Breadcrumbs.tsx                 # uses BreadcrumbPortal
    AutosaveBadge.tsx
  lib/marketing/
    autosave.ts                     # shared hook
    maily.ts                        # render helpers
  app/api/
    campaigns/route.ts              # GET,POST
    campaigns/[id]/route.ts         # GET,PATCH,DELETE
    campaigns/[id]/schedule/route.ts
    campaigns/[id]/targets/route.ts
    templates/route.ts
    templates/[id]/route.ts
    autosave/route.ts               # entity,id,blob
```

## Data Model (Prisma)
```prisma
model Campaign {
  id          String   @id @default(cuid())
  orgId       String
  name        String
  subject     String
  preheader   String?
  fromName    String?
  fromEmail   String?
  replyToEmail String?
  status      CampaignStatus @default(DRAFT)
  templateId  String?
  template    CampaignTemplate? @relation(fields: [templateId], references: [id])
  contentJson Json
  htmlRendered String
  scheduleAt  DateTime?
  sentAt      DateTime?
  metrics     Json?              // {sends,opens,openRate,clicks,clickRate}
  createdBy   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  @@index([orgId])
  @@index([orgId,status])
}

model CampaignTemplate {
  id          String   @id @default(cuid())
  orgId       String
  name        String
  description String?
  contentJson Json
  htmlRendered String
  createdBy   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  @@index([orgId])
}

enum TargetType { CONTACT SEGMENT }

model CampaignTarget {
  id         String   @id @default(cuid())
  orgId      String
  campaignId String
  targetType TargetType
  contactId  String?
  segmentId  String?
  addedBy    String
  addedAt    DateTime @default(now())
  campaign   Campaign @relation(fields: [campaignId], references: [id])
  @@index([orgId])
  @@unique([campaignId, contactId])
  @@unique([campaignId, segmentId])
}
```

## API Contracts
- `GET/POST /api/campaigns` → list/create (cursor `nextCursor`)
- `GET/PATCH/DELETE /api/campaigns/:id`
- `POST /api/campaigns/:id/schedule` → {scheduleAt}
- `GET/POST/DELETE /api/campaigns/:id/targets` → manage contacts/segments; dedupe by email
- `GET/POST /api/templates`
- `GET/PATCH/DELETE /api/templates/:id`
- `POST /api/autosave` → {entity:"campaign"|"template", id?, blob}
All handlers derive `{orgId,userId,role}` via `getSessionOrg` & Supabase session; return 401/403/422 when violated.

## Components
- **Dashboard**: empty state with CTA cards or stats + recent campaigns and templates row.
- **CampaignComposer**: centered `<Editor>` from `@maily-to/core`; autosaves `contentJson`; save/preview uses `@maily-to/render`.
- **RecipientsTable**: tabs for segments and individuals; dedupe emails; compute deliverable count.
- **TemplateEditor**: same editor; "Use template" prefills new campaign.
- **Breadcrumbs**: `Marketing / {New|Name}` via `BreadcrumbPortal`.
- **AutosaveBadge**: indicates pending/saved status using shared hook.

## Autosave
- `useAutosave` debounced 1s; posts to `/api/autosave` with key `entity:id`.
- Optimistic SWR update; rollback on error.
- Composer and template pages hydrate from autosave drafts when id missing.

## Auth & SWR
- Org and role resolved server-side; RLS ensures `row.orgId = session.org`.
- Members can create/update; only owners/admins delete.
- Use `swr` with keys per list/detail; prefetch detail on hover; optimistic updates for create/schedule/targets; light polling for scheduled status.

## Testing Plan
- **API**: campaigns CRUD, schedule guard (422 past), target dedupe, org access for templates and campaigns.
- **UI**: autosave fires once, breadcrumbs render, recipient dedupe & deliverable counts, dashboard stats compute.
- **Render**: snapshot JSON→HTML via `@maily-to/render` with variable substitution.

## Repo-driven Deviations
- Current `/api/autosave` accepts `{key,data}`; will migrate to `{entity,id,blob}`.
- `swr` dependency absent; add and adapt `lib/fetch` as SWR fetcher.
- `lib/store.ts` lacks templates/targets; extend for tests.
- Existing `Campaign` model minimal; expanded to include subject, sender info, metrics, template link.
