import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json({ success: true });
    
    // Clear the auth cookie
    response.cookies.delete('fosskok-auth');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'En feil oppstod' },
      { status: 500 }
    );
  }
}
