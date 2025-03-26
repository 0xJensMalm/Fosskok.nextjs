import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/client';

export async function POST(request: NextRequest) {
  try {
    // Check authentication (similar to other admin API routes)
    const authCookie = request.cookies.get('fosskok-auth');
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the feature flag data from the request
    const data = await request.json();
    const { key, value } = data;

    if (!key) {
      return NextResponse.json({ error: 'Feature flag key is required' }, { status: 400 });
    }

    // Initialize Supabase client
    const supabase = createClient();

    // Update the feature flag in the database
    const { error } = await supabase
      .from('feature_flags')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to update feature flag' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Feature flag ${key} updated successfully`,
      key,
      value
    });
  } catch (error) {
    console.error('Error updating feature flag:', error);
    return NextResponse.json({ error: 'Failed to update feature flag' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authCookie = request.cookies.get('fosskok-auth');
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize Supabase client
    const supabase = createClient();

    // Get all feature flags from the database
    const { data, error } = await supabase
      .from('feature_flags')
      .select('key, value, description')
      .order('id');

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to get feature flags' }, { status: 500 });
    }

    // Convert to the expected format
    const flags = data.reduce<Record<string, boolean>>((acc, flag) => {
      acc[flag.key] = flag.value;
      return acc;
    }, {});

    return NextResponse.json({ flags, rawData: data });
  } catch (error) {
    console.error('Error getting feature flags:', error);
    return NextResponse.json({ error: 'Failed to get feature flags' }, { status: 500 });
  }
}
