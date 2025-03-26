import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from './utils/supabase/client';

export async function middleware(request: NextRequest) {
  // Check if the path is for disabled feature pages
  if (request.nextUrl.pathname === '/gryta' || request.nextUrl.pathname === '/merch') {
    // Initialize Supabase client
    const supabase = createClient();
    
    // Get feature flags from the database
    const { data, error } = await supabase
      .from('feature_flags')
      .select('key, value')
      .in('key', ['enableGrytaPage', 'enableMerchPage']);
      
    if (error) {
      console.error('Error fetching feature flags:', error);
      // If there's an error, default to allowing access
      return NextResponse.next();
    }
    
    // Convert to a map for easier access
    const flagsMap = data.reduce<Record<string, boolean>>((acc, flag) => {
      acc[flag.key] = flag.value;
      return acc;
    }, {});
    
    // Check if the specific page is disabled
    if (
      (request.nextUrl.pathname === '/gryta' && !flagsMap.enableGrytaPage) ||
      (request.nextUrl.pathname === '/merch' && !flagsMap.enableMerchPage)
    ) {
      // Redirect to home page if trying to access disabled features
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
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
