import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    // Get credentials from environment variables
    const validUsername = process.env.ADMIN_USERNAME || 'admin';
    const validPassword = process.env.ADMIN_PASSWORD || 'fosskok2025';
    
    // Debug log credentials (without showing actual password)
    console.log(`Attempting login with username: ${username}, valid username: ${validUsername}`);
    console.log(`Password match: ${password === validPassword}`);
    
    // Simple authentication check
    if (username === validUsername && password === validPassword) {
      // Create response
      const response = NextResponse.json({ success: true });
      
      // Set a simple auth cookie
      response.cookies.set({
        name: 'fosskok-auth',
        value: 'authenticated',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
        sameSite: 'lax',
      });
      
      console.log('Authentication successful, cookie set');
      return response;
    }
    
    // Authentication failed
    console.log('Authentication failed: invalid credentials');
    return NextResponse.json(
      { success: false, message: 'Feil brukernavn eller passord' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'En feil oppstod' },
      { status: 500 }
    );
  }
}
