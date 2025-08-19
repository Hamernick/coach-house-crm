import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED = ["/dashboard","/contacts","/segments","/marketing","/sequences","/reports","/apps","/settings"];

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: { headers: req.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          const cookie = req.cookies.get(name)
          return cookie ? { name, value: cookie.value } : undefined
        },
        set: (name: string, value: string, options: any) =>
          res.cookies.set({ name, value, ...options }),
        remove: (name: string, options: any) =>
          res.cookies.set({ name, value: "", ...options, maxAge: 0 }),
      } as any,
    }
  );

  if (PROTECTED.some(p => req.nextUrl.pathname.startsWith(p))) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
