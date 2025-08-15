import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protected routes
  if (path.startsWith('/dashboard') || path.startsWith('/contacts')) {
    // Check if the user is authenticated
    const token = request.cookies.get('auth_token');

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/*', '/contacts/*'],
};
