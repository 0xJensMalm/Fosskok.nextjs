import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export interface RouteParams {
  id: string;
}

// GET /api/blog/[id] - Get a specific blog post
export async function GET(
  request: NextRequest,
  context: { params: RouteParams }
) {
  try {
    const blogPost = await prisma.blogPost.findUnique({
      where: {
        id: context.params.id,
      },
    });
    
    if (!blogPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Check if unpublished post is being accessed by non-admin
    const authCookie = request.cookies.get('fosskok-auth');
    if (!blogPost.published && (!authCookie || authCookie.value !== 'authenticated')) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(blogPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

// PUT /api/blog/[id] - Update a blog post
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
    if (!data.title || !data.content || !data.author) {
      return NextResponse.json(
        { error: 'Title, content, and author are required' },
        { status: 400 }
      );
    }
    
    const updatedBlogPost = await prisma.blogPost.update({
      where: {
        id: context.params.id,
      },
      data: {
        title: data.title,
        content: data.content,
        author: data.author,
        image: data.image,
        published: data.published !== undefined ? data.published : true,
      },
    });
    
    return NextResponse.json(updatedBlogPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/[id] - Delete a blog post
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

    await prisma.blogPost.delete({
      where: {
        id: context.params.id,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
