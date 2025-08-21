# Coach House CRM

Next.js + shadcn/ui + Supabase

## Quickstart

### Install dependencies

```bash
npm install
```

### Configure environment

Create a `.env.local` file in the project root and add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
DATABASE_URL=postgresql-connection-string
```

### Set up the database

Push the Prisma schema and seed a few example contacts:

```bash
npm run db:push
npm run seed
```

### Start the development server

```bash
npm run dev
```
