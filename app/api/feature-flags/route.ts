import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

    // Path to the feature flags file
    const filePath = path.join(process.cwd(), 'utils', 'featureFlags.js');

    // Read the current feature flags file
    let fileContent = fs.readFileSync(filePath, 'utf-8');

    // Create a regex pattern to match the specific flag
    const pattern = new RegExp(`(${key}:\\s*)([a-z]+)`, 'g');

    // Replace the value in the file content
    const updatedContent = fileContent.replace(pattern, `$1${value}`);

    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent, 'utf-8');

    return NextResponse.json({ success: true, message: `Feature flag ${key} updated successfully` });
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

    // Path to the feature flags file
    const filePath = path.join(process.cwd(), 'utils', 'featureFlags.js');

    // Read the current feature flags file
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Extract feature flags using regex
    const flagsRegex = /(\w+):\s*([a-z]+)/g;
    const flags: Record<string, boolean> = {};
    
    let match;
    while ((match = flagsRegex.exec(fileContent)) !== null) {
      const key = match[1];
      const value = match[2] === 'true';
      flags[key] = value;
    }

    return NextResponse.json({ flags });
  } catch (error) {
    console.error('Error getting feature flags:', error);
    return NextResponse.json({ error: 'Failed to get feature flags' }, { status: 500 });
  }
}
