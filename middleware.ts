import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Protect all routes under /admin
    if (pathname.startsWith('/admin')) {
        if (!token) {
            // Redirect to login if no token is found
            const loginUrl = new URL('/auth/login', request.url);
            // Optionally add a redirect parameter to return here after login
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Removed: Redirect logged-in users away from auth pages
    // This allows the landing page "Login" button to always show the login form,
    // which aligns with the user's explicit navigation request.


    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
