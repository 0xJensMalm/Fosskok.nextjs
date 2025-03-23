import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export interface RouteParams {
  id: string;
}

// GET /api/members/[id] - Get a specific member
export async function GET(
  request: NextRequest,
  context: { params: RouteParams }
) {
  try {
    const member = await prisma.member.findUnique({
      where: {
        id: context.params.id,
      },
    });
    
    if (!member) {
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
    if (!data.name || !data.role || !data.bio) {
      return NextResponse.json(
        { error: 'Name, role, and bio are required' },
        { status: 400 }
      );
    }
    
    const updatedMember = await prisma.member.update({
      where: {
        id: context.params.id,
      },
      data: {
        name: data.name,
        role: data.role,
        bio: data.bio,
        image: data.image,
      },
    });
    
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

    await prisma.member.delete({
      where: {
        id: context.params.id,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { error: 'Failed to delete member' },
      { status: 500 }
    );
  }
}
