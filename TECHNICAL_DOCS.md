# Fosskok Technical Documentation

## Project Overview

Fosskok is a Next.js website with a Supabase backend that showcases information about the Fosskok organization, including team members, events, and blog posts. The site includes a public-facing frontend and an admin panel for content management.

## Technology Stack

- **Frontend**: Next.js 15 with App Router
- **Backend**: Supabase (PostgreSQL database)
- **Deployment**: Vercel
- **Image Storage**: Vercel Blob Storage
- **Authentication**: Custom cookie-based auth for the admin panel

## Project Structure

```
fosskok/
├── app/                      # Next.js App Router pages
│   ├── admin/                # Admin panel pages
│   ├── api/                  # API routes
│   │   ├── auth/             # Authentication endpoints
│   │   ├── blog/             # Blog post CRUD endpoints
│   │   ├── events/           # Events CRUD endpoints
│   │   ├── members/          # Members CRUD endpoints
│   │   └── upload/           # File upload endpoint
│   ├── arrangementer/        # Events page
│   ├── folka/                # Team members page
│   ├── gryta/                # Blog page
│   └── ...                   # Other public pages
├── public/                   # Static assets
├── src/
│   └── components/           # React components
│       ├── admin/            # Admin panel components
│       └── ...               # Other components
├── supabase/
│   └── migrations/           # Database schema migrations
├── utils/
│   └── supabase/             # Supabase client utilities
│       ├── server.ts         # Server-side Supabase client
│       ├── client.ts         # Client-side Supabase client
│       └── admin.ts          # Admin Supabase client for bypassing RLS
└── ...                       # Configuration files
```

## Database Schema

The application uses three main tables in Supabase:

### Members Table
```sql
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  email TEXT,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Events Table
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  image_url TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Blog Posts Table
```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  image_url TEXT,
  slug TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Routes

The application uses Next.js API routes to handle CRUD operations for members, events, and blog posts. All routes follow RESTful conventions:

### Members API
- `GET /api/members` - List all members
- `POST /api/members` - Create a new member
- `GET /api/members/[id]` - Get a specific member
- `PUT /api/members/[id]` - Update a member
- `DELETE /api/members/[id]` - Delete a member

### Events API
- `GET /api/events` - List all events
- `POST /api/events` - Create a new event
- `GET /api/events/[id]` - Get a specific event
- `PUT /api/events/[id]` - Update an event
- `DELETE /api/events/[id]` - Delete an event

### Blog Posts API
- `GET /api/blog` - List all blog posts (filters unpublished posts for non-admin users)
- `POST /api/blog` - Create a new blog post
- `GET /api/blog/[id]` - Get a specific blog post
- `PUT /api/blog/[id]` - Update a blog post
- `DELETE /api/blog/[id]` - Delete a blog post

### Upload API
- `POST /api/upload` - Handle file uploads for images

## Authentication

The admin panel uses a simple cookie-based authentication system:

- Login endpoint: `POST /api/auth/login`
- Logout endpoint: `GET /api/auth/logout`
- Default credentials (if not set in environment variables):
  - Username: admin
  - Password: fosskok2025

Authentication is enforced via middleware that protects all `/admin/*` routes except `/admin/login`. The cookie is set with:
- `httpOnly: true` - Prevents JavaScript access
- `secure: process.env.NODE_ENV === 'production'` - HTTPS only in production
- `sameSite: 'lax'` - Improves security while allowing normal navigation
- `maxAge: 86400` - 24-hour expiration

## Supabase Integration

The application uses Supabase for data storage. The connection is established using environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Three utility files handle Supabase connections:
- `utils/supabase/client.ts` - Client-side Supabase instance
- `utils/supabase/server.ts` - Server-side Supabase instance
- `utils/supabase/admin.ts` - Admin Supabase instance with service role key for bypassing RLS

## Row Level Security (RLS)

Supabase tables use Row Level Security policies to protect data:

1. Public users can read published content
2. Admin users can read all content and perform write operations
3. The admin client bypasses RLS using the service role key for database operations

## Deployment

The application is deployed on Vercel. Important configuration:

1. Environment variables must be set in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_USERNAME` (optional, defaults to 'admin')
   - `ADMIN_PASSWORD` (optional, defaults to 'fosskok2025')

2. The `vercel.json` file contains configuration for the deployment:
```json
{
  "buildCommand": "next build",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

## Important Implementation Details

### Admin Client for Database Operations

To bypass Row Level Security (RLS) policies in Supabase, the application uses a service role key with an admin client:

```typescript
// utils/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';

export async function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(supabaseUrl, supabaseServiceRoleKey);
}
```

This admin client is used in API routes for write operations to ensure they work regardless of RLS policies.

### Image Handling

Images for members and blog posts are stored as URLs. The application supports:
1. Direct URLs to external images
2. Base64 encoded images (for small images)
3. Vercel Blob Storage (for larger uploads)

## Recent Updates

### Project Structure Cleanup

The project structure has been cleaned up to remove duplicate files and folders:
- Removed the duplicate `fosskok` directory
- Consolidated all code into the root directory
- Fixed the blog API endpoint to use the correct column name (`is_published` instead of `published`)

### Homepage Content Update

The homepage content has been updated to include:
- Fosskok's history starting from the 2017 festival
- Information about the collective's growth to 24 members
- Details about their location at Hammer Prestegård in Lørenskog
- Plans for the next four years including events and activities

## Maintenance and Extension

### Adding New Features

1. **New Database Tables**:
   - Add new migration files in `supabase/migrations/`
   - Run the SQL commands in the Supabase SQL editor

2. **New API Routes**:
   - Create new route files in `app/api/`
   - Follow the pattern of existing routes
   - Use the admin client for write operations to bypass RLS

3. **New Admin Panel Sections**:
   - Add new components in `src/components/admin/`
   - Update the admin page to include the new section

### Common Issues

1. **Deployment Errors**:
   - Check that all environment variables are correctly set in Vercel
   - Ensure the Supabase service role key has the necessary permissions

2. **Authentication Issues**:
   - Verify cookie settings in login/logout routes
   - Check that the middleware is correctly configured
   - Use `credentials: 'include'` in fetch requests from the admin panel

3. **Database Write Operations**:
   - Always use the admin client for write operations to bypass RLS
   - Check for column name mismatches between code and database schema
