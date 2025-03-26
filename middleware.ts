import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import featureFlags from './utils/featureFlags';

export function middleware(request: NextRequest) {
  // Check if the path is for disabled feature pages
  if (
    (!featureFlags.enableGrytaPage && request.nextUrl.pathname === '/gryta') ||
    (!featureFlags.enableMerchPage && request.nextUrl.pathname === '/merch')
  ) {
    // Redirect to home page if trying to access disabled features
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  // Check if the path is for the admin area (but not the login page)
  if ((request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/admin/login') && 
      !request.nextUrl.pathname.includes('api')) || 
      request.nextUrl.pathname === '/api/feature-flags') {
    
    // Check if the user is authenticated
    const authCookie = request.cookies.get('fosskok-auth');
    
    // Log cookie for debugging (will appear in Vercel logs)
    console.log('Auth cookie:', authCookie);
    
    // If not authenticated, redirect to login or return unauthorized for API
    if (!authCookie || authCookie.value !== 'authenticated') {
      console.log('Not authenticated, redirecting to login');
      
      // For API requests, return 401 Unauthorized
      if (request.nextUrl.pathname === '/api/feature-flags') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      // For page requests, redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    console.log('User authenticated, proceeding to admin');
  }
  
  return NextResponse.next();
}

// Configure the paths that should be checked by the middleware
export const config = {
  matcher: ['/admin/:path*', '/gryta', '/merch', '/api/feature-flags'],
};
