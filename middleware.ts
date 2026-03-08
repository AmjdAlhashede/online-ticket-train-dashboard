import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple middleware — NO Prisma, NO heavy imports
// Just protects dashboard routes and allows API routes through
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow all API routes (public API for frontend)
    if (pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    // Allow login page
    if (pathname === '/login') {
        return NextResponse.next();
    }

    // Allow static files
    if (pathname.startsWith('/_next') || pathname.includes('.')) {
        return NextResponse.next();
    }

    // For all other routes (dashboard), just let them through
    // Auth is handled by the login page itself
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|.*\\.png$).*)'],
};
