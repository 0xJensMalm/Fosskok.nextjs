import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export interface RouteParams {
  id: string;
}

// GET /api/events/[id] - Get a specific event
export async function GET(
  request: NextRequest,
  context: { params: RouteParams }
) {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: context.params.id,
      },
    });
    
    if (!event) {
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
  context: { params: RouteParams }
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
    if (!data.title || !data.description || !data.date || !data.location) {
      return NextResponse.json(
        { error: 'Title, description, date, and location are required' },
        { status: 400 }
      );
    }
    
    const updatedEvent = await prisma.event.update({
      where: {
        id: context.params.id,
      },
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        location: data.location,
      },
    });
    
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
  context: { params: RouteParams }
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

    await prisma.event.delete({
      where: {
        id: context.params.id,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
