import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = () => {
  const cookieStore = cookies();

  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          // Return all cookies as an array of { name, value }
          return Array.from(cookieStore.entries()).map(([name, value]) => ({ name, value }));
        },
        setAll() {
          // No-op: cannot set cookies in server components
        },
      },
    },
  );
};