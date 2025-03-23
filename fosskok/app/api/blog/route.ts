import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/blog - Get all blog posts
export async function GET(request: NextRequest) {
  try {
    // Check if we should include unpublished posts (admin only)
    const authCookie = request.cookies.get('fosskok-auth');
    const includeUnpublished = authCookie?.value === 'authenticated';
    
    const blogPosts = await prisma.blogPost.findMany({
      where: includeUnpublished ? {} : { published: true },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(blogPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST /api/blog - Create a new blog post
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
    if (!data.title || !data.content || !data.author) {
      return NextResponse.json(
        { error: 'Title, content, and author are required' },
        { status: 400 }
      );
    }
    
    const blogPost = await prisma.blogPost.create({
      data: {
        title: data.title,
        content: data.content,
        author: data.author,
        image: data.image || null,
        published: data.published !== undefined ? data.published : true,
      },
    });
    
    return NextResponse.json(blogPost, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
