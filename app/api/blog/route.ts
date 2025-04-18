import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

// GET /api/blog - Get all blog posts
export async function GET(request: NextRequest) {
  try {
    // Check if we should include unpublished posts (admin only)
    const authCookie = request.cookies.get('fosskok-auth');
    const includeUnpublished = authCookie?.value === 'authenticated';
    
    const supabase = await createClient();
    
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Filter out unpublished posts for non-admin users
    if (!includeUnpublished) {
      query = query.eq('is_published', true);
    }
    
    const { data: blogPosts, error } = await query;
    
    if (error) {
      console.error('Error fetching blog posts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch blog posts' },
        { status: 500 }
      );
    }
    
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
    if (!data.title || !data.content || !data.author || !data.slug) {
      return NextResponse.json(
        { error: 'Title, content, author, and slug are required' },
        { status: 400 }
      );
    }
    
    // Use the admin client to bypass RLS policies
    const supabase = await createAdminClient();
    
    console.log(`Attempting to create a new blog post using admin client`);
    
    const { data: blogPost, error } = await supabase
      .from('blog_posts')
      .insert({
        title: data.title,
        content: data.content,
        author: data.author,
        slug: data.slug,
        image: data.image || null,
        is_published: data.is_published !== undefined ? data.is_published : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating blog post:', error);
      return NextResponse.json(
        { error: 'Failed to create blog post' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(blogPost, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
