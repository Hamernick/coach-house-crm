---
applyTo: "**"
---

Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

# Copilot Instructions - CoachHouse CRM Platform

> **Purpose**
> Guide GitHub Copilot (chat & autocomplete) to produce code that aligns with our design, architecture, and product vision.

---

## 1 Product Context

* **App**: CoachHouse CRM (multitenant SaaS)
* **Core features**: CRM contacts • Segments • Mass email & drip sequences • Social blasts • Finance (Stripe-sync, basic bookkeeping) • Reports dashboard • Apps/Connections marketplace
* **Audience**: Non-profit orgs & small foundations (< 600 contacts).
* **Design**: Apple-style minimalist, shadcn/ui + Tailwind CSS.

## 2 Tech Stack (hard constraints)

| Layer        | Choice                                                                            |
| ------------ | --------------------------------------------------------------------------------- |
| Front-end    | Next.js 14 / React 19 (App Router, Server Actions)                                |
| Styling      | Tailwind CSS, shadcn/ui components                                                |
| State / Data | Supabase (PostgreSQL) • React Query                                               |
| Validation   | Zod                                                                               |
| Auth         | Supabase Auth (Google + Email only) → RBAC (`owner`, `admin`, `member`, `viewer`) |
| Tests        | Vitest + React Testing Library                                                    |
| Tooling      | ESBuild, Turbo, TypeScript strict on                                              |

## 3 Project Structure

```
/apps
  web/        # Next.js app
/packages
  ui/         # shadcn-based shared components
  db/         # Supabase typed queries & Zod schemas
  emailer/    # shared email templating utils (MJML)
  finance/    # finance SDK wrapper (Stripe)
/config       # tailwind.config.ts, eslint, tsconfig
```

> *Rule*: Keep shared logic in `packages`, avoid cross-app imports that bypass packages.

## 4 Key Domain Modules

| Folder       | Responsibility                                  |
| ------------ | ----------------------------------------------- |
| `crm/`       | contacts, orgs, segments, tagging, merge-dedupe |
| `marketing/` | email templates, schedulers, social blasts      |
| `sequences/` | drip campaigns (time / trigger based)           |
| `finance/`   | Stripe webhooks, ledger entries, reports        |
| `reports/`   | dynamic dashboards (DAL + React Charts)         |
| `auth/`      | session, RBAC guards, user invite flow          |

### Module contract

* **API route** under `/api/{module}` with REST-y endpoints.
* **DB access** through typed Supabase RPC in `packages/db`.
* **Service layer** (`*.service.ts`) for business logic.
* **UI**: page → layout → server component → client component.

## 5 Coding Conventions

* TypeScript `strict`, no `any`.
* Functional React components, hooks > HOCs.
* **Tailwind** utility-first; extract class names with `clsx` for clarity.
* Filenames: kebab-case; React comps PascalCase; hooks `useX`.
* Prefer **composition** over inheritance.
* Keep files < 300 LoC; split when growing.

## 6 Patterns & Libraries

* Data fetching: `react-query` + `supabase-js` typed client.
* Form handling: `react-hook-form` + Zod resolver.
* Email templates: MJML components in `packages/emailer`.
* Charts: `recharts` minimal palette, no explicit colors unless asked.
* Animations: `framer-motion` for UI flourish.

## 7 Security & Compliance

* Never expose Stripe secret keys client-side.
* Sanitize user HTML input; use DOMPurify.
* Enforce row-level security in Supabase.
* GDPR: allow contact export/delete by org admins.

## 8 Performance

* Use Next.js dynamic imports for heavy charts/editors.
* Memoize expensive selectors/hooks.
* Background jobs via Supabase Edge Functions (cron, queues).
* Limit initial bundle < 150 KB gz.

## 9 Testing & CI

* Unit: Vitest → run on push.
* E2E: Playwright on main flows (auth, send email, create invoice).
* CI: Turborepo pipeline → type-check → unit tests → build.

## 10 Copilot Behaviour Guidelines

1. **When adding files**: place in correct module path; add barrel export if needed.
2. **DRY**: search existing utils before generating new.
3. **Comments**: top-level JSDoc for functions; minimal inline notes.
4. **Autofix lint errors** (`eslint:recommended`, `@typescript-eslint` rules).
5. **Respect file scopes** when `applyTo` front-matter exists.

## 11 Out-of-Scope / Anti-patterns

* No class-based React.
* No inline CSS except Tailwind `@apply`.
* Do not scaffold Docker or Kubernetes here.
* Avoid heavy CMS integrations.

## 12 UI / Layout Rules

* **Always** use shadcn/ui components + Tailwind for UI.
* Use **SidebarProvider**, **AppSidebar (variant="inset")**, and **SidebarInset** as the root layout.
* Navigation = `SidebarMenuButton asChild <Link>` → page routes (`/dashboard`, `/contacts`, …). Do **not** hand-roll sidebars or tab systems.
* Main section layout must follow official shadcn blocks (e.g. `dashboard-01`):

  * Header = `SiteHeader` with `SidebarTrigger` + breadcrumbs.
  * Content = flex/stack with container queries (`@container/main`).
  * KPIs = `SectionCards` grid.
  * Charts = `ChartAreaInteractive`.
  * Tables = TanStack DataTable with shadcn wrappers.
* When adding a new page, copy `app/dashboard/page.tsx` pattern: wrap content in `<SidebarInset>`.
* Do not invent other layout primitives (MUI, Chakra, raw CSS grids).
* Use `npx shadcn@latest add <block>` whenever possible, then adapt.

## 13 Screen Scaffold / Flow

### Auth & Home

* **/login** – Supabase Auth (Google + Email).
* **/signup** – Create org → role `owner`.
* **/invite** – Invite team members (`admin`, `member`, `viewer`).
* **/** (Home) – basic page already built; must remain part of flow.

### App Shell

* **Sidebar**: Dashboard • Contacts • Segments • Marketing • Sequences • Finance • Reports • Settings.
* **Main section**: always wrapped in `SidebarInset` with `SiteHeader`.

### Screens

* **Dashboard** – KPI cards, chart, recent activity.
* **Contacts** – DataTable, profile view.
* **Segments** – list + builder.
* **Marketing** – templates, campaigns, results.
* **Sequences** – drip campaign builder.
* **Finance** – Stripe sync, ledger, reports.
* **Reports** – dashboards, export.
* **Settings** – org profile, team, integrations, compliance.

### Flow

1. User signs up → creates org.
2. Onboarding (import contacts, connect Stripe, create first email template).
3. Daily use → navigate via sidebar; dashboard is overview, contacts are source of truth, other modules handle comms, finance, reporting.

---

> **TL;DR**
> Use Next.js + Supabase + shadcn/ui to build a concise, minimal CRM with finance & marketing. Keep code typed, modular, and DRY. Generate only what belongs inside this monorepo.
