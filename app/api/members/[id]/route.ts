import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { invalidateCache } from '@/utils/cache-helpers';
import { createAdminClient } from '@/utils/supabase/admin';

type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET /api/members/[id] - Get a specific member
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const supabase = await createClient();
    
    const { id } = await params;
    
    const { data: member, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json(
      { error: 'Failed to fetch member' },
      { status: 500 }
    );
  }
}

// PUT /api/members/[id] - Update a member
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check if user is authenticated
    const authCookie = request.cookies.get('fosskok-auth');
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.role || !data.bio) {
      return NextResponse.json(
        { error: 'Name, role, and bio are required' },
        { status: 400 }
      );
    }
    
    // Use the admin client to bypass RLS policies
    const supabase = await createAdminClient();
    
    console.log(`Attempting to update member with ID: ${id} using admin client`);
    
    const { data: updatedMember, error } = await supabase
      .from('members')
      .update({
        name: data.name,
        role: data.role,
        bio: data.bio,
        image_url: data.image_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating member:', error);
      return NextResponse.json(
        { error: 'Failed to update member' },
        { status: 500 }
      );
    }
    
    // Invalidate the members cache
    invalidateCache('members');
    console.log(`Cache invalidated for members after updating member ${id}`);
    
    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 500 }
    );
  }
}

// DELETE /api/members/[id] - Delete a member
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check if user is authenticated
    const authCookie = request.cookies.get('fosskok-auth');
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    // Use the admin client to bypass RLS policies
    const supabase = await createAdminClient();
    
    console.log(`Attempting to delete member with ID: ${id} using admin client`);
    
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
    
    // Invalidate the members cache
    invalidateCache('members');
    console.log(`Cache invalidated for members after deleting member ${id}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 500 }
    );
  }
}
