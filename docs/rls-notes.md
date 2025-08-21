# Row Level Security Notes

The application relies on Supabase's RLS policies to restrict data access.
Proposed policies:

- `Membership` table: users can `SELECT` rows where `userId = auth.uid()`.
- `Org` and other resources should reference the membership checks to ensure
  only members of an organization can access related data.

In addition to database-level policies, `src/lib/auth.ts` exposes role helpers
(`isOwner`, `isAdmin`, `isMember`) to implement app-level guards.
