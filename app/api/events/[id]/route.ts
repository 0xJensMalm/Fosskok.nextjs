import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET /api/events/[id] - Get a specific event
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const supabase = await createClient();
    
    const { id } = await params;
    
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PUT /api/events/[id] - Update an event
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
    if (!data.title || !data.description || !data.date || !data.location) {
      return NextResponse.json(
        { error: 'Title, description, date, and location are required' },
        { status: 400 }
      );
    }
    
    // Use the admin client to bypass RLS policies
    const supabase = await createAdminClient();
    
    console.log(`Attempting to update event with ID: ${id} using admin client`);
    
    const { data: updatedEvent, error } = await supabase
      .from('events')
      .update({
        title: data.title,
        description: data.description,
        date: new Date(data.date).toISOString(),
        location: data.location,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating event:', error);
      return NextResponse.json(
        { error: 'Failed to update event' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Delete an event
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
    
    console.log(`Attempting to delete event with ID: ${id} using admin client`);
    
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting event:', error);
      return NextResponse.json(
        { error: 'Failed to delete event' },
        { status: 500 }
      );
    }
    
    // Log successful deletion
    console.log(`Successfully deleted event with ID: ${id}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
