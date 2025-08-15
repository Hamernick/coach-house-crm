import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(request: NextRequest) {
  const res = new NextResponse();
  const supabase = createMiddlewareClient({ req: request, res });

  // Protected routes
  const protectedRoutes = ['/dashboard', '/contacts', '/segments', '/marketing', '/sequences', '/reports', '/apps', '/settings'];

  for (const route of protectedRoutes) {
    if (request.nextUrl.pathname.startsWith(route)) {
      const { data, error } = await supabase.auth.getUserByCookie(request.cookies.get('supabase-auth-token'));

      if (error || !data.user) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
