import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { invalidateCache } from '@/utils/cache-helpers';

// Set export const dynamic to force dynamic rendering and prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/members - Get all members
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: members, error } = await supabase
      .from('members')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching members:', error);
      return NextResponse.json(
        { error: 'Failed to fetch members' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

// POST /api/members - Create a new member
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const authCookie = request.cookies.get('fosskok-auth');
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.role || !data.bio) {
      return NextResponse.json(
        { error: 'Name, role, and bio are required' },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    
    const { data: member, error } = await supabase
      .from('members')
      .insert({
        name: data.name,
        role: data.role,
        bio: data.bio,
        image: data.image || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating member:', error);
      return NextResponse.json(
        { error: 'Failed to create member' },
        { status: 500 }
      );
    }
    
    // Invalidate the members cache to ensure fresh data is fetched
    invalidateCache('members');
    
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    );
  }
}

// PUT /api/members/:id - Update a member
export async function PUT(request: NextRequest) {
  try {
    // Check if user is authenticated
    const authCookie = request.cookies.get('fosskok-auth');
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.id || !data.name || !data.role || !data.bio) {
      return NextResponse.json(
        { error: 'ID, name, role, and bio are required' },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    
    const { data: member, error } = await supabase
      .from('members')
      .update({
        name: data.name,
        role: data.role,
        bio: data.bio,
        image: data.image || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', data.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating member:', error);
      return NextResponse.json(
        { error: 'Failed to update member' },
        { status: 500 }
      );
    }
    
    // Invalidate the members cache to ensure fresh data is fetched
    invalidateCache('members');
    
    return NextResponse.json(member);
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 500 }
    );
  }
}

// DELETE /api/members/:id - Delete a member
export async function DELETE(request: NextRequest) {
  try {
    // Check if user is authenticated
    const authCookie = request.cookies.get('fosskok-auth');
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the ID from the URL
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting member:', error);
      return NextResponse.json(
        { error: 'Failed to delete member' },
        { status: 500 }
      );
    }
    
    // Invalidate the members cache to ensure fresh data is fetched
    invalidateCache('members');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 500 }
    );
  }
}
