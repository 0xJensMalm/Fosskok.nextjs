import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET /api/blog/[id] - Get a specific blog post
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const supabase = await createClient();
    
    const { id } = await params;
    
    const { data: blogPost, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !blogPost) {
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
    if (!data.title || !data.content || !data.author) {
      return NextResponse.json(
        { error: 'Title, content, and author are required' },
        { status: 400 }
      );
    }
    
    // Use the admin client to bypass RLS policies
    const supabase = await createAdminClient();
    
    console.log(`Attempting to update blog post with ID: ${id} using admin client`);
    
    // Update blog post
    const { data: updatedBlogPost, error } = await supabase
      .from('blog_posts')
      .update({
        title: data.title,
        content: data.content,
        author: data.author,
        image: data.image,
        published: data.published,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating blog post:', error);
      return NextResponse.json(
        { error: 'Failed to update blog post' },
        { status: 500 }
      );
    }
    
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
    
    console.log(`Attempting to delete blog post with ID: ${id} using admin client`);
    
    // Delete blog post
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting blog post:', error);
      return NextResponse.json(
        { error: 'Failed to delete blog post' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
