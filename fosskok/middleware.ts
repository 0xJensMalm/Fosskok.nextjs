import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the path is for the admin area (but not the login page)
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/admin/login') && 
      !request.nextUrl.pathname.includes('api')) {
    
    // Check if the user is authenticated
    const authCookie = request.cookies.get('fosskok-auth');
    
    // Log cookie for debugging (will appear in Vercel logs)
    console.log('Auth cookie:', authCookie);
    
    // If not authenticated, redirect to login
    if (!authCookie || authCookie.value !== 'authenticated') {
      console.log('Not authenticated, redirecting to login');
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    console.log('User authenticated, proceeding to admin');
  }
  
  return NextResponse.next();
}

// Configure the paths that should be checked by the middleware
export const config = {
  matcher: ['/admin/:path*'],
};
