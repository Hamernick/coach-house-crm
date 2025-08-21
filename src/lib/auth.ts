import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { Role } from '@prisma/client';

/**
 * Returns the organization ID for the current authenticated session.
 * When no session or membership is found, `null` is returned.
 */
export async function getSessionOrg() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;

  const { data } = await supabase
    .from('Membership')
    .select('orgId')
    .eq('userId', session.user.id)
    .single();

  return data?.orgId ?? null;
}

export const isOwner = (role?: Role | null) => role === 'OWNER';
export const isAdmin = (role?: Role | null) => role === 'ADMIN' || isOwner(role);
export const isMember = (role?: Role | null) => role === 'MEMBER' || isAdmin(role);
