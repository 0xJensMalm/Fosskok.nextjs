import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// GET /api/members/[id] - Get a specific member
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    const { data: member, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', context.params.id)
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
  context: { params: { id: string } }
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

    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.role || !data.bio) {
      return NextResponse.json(
        { error: 'Name, role, and bio are required' },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    
    const { data: updatedMember, error } = await supabase
      .from('members')
      .update({
        name: data.name,
        role: data.role,
        bio: data.bio,
        image: data.image,
        updated_at: new Date().toISOString()
      })
      .eq('id', context.params.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating member:', error);
      return NextResponse.json(
        { error: 'Failed to update member' },
        { status: 500 }
      );
    }
    
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
  context: { params: { id: string } }
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

    const supabase = await createClient();
    
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', context.params.id);
    
    if (error) {
      console.error('Error deleting member:', error);
      return NextResponse.json(
        { error: 'Failed to delete member' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 500 }
    );
  }
}
