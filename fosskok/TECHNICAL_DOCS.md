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
│   │   └── members/          # Members CRUD endpoints
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
  image TEXT,
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
  image TEXT,
  published BOOLEAN DEFAULT FALSE,
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
- `GET /api/blog` - List all blog posts
- `POST /api/blog` - Create a new blog post
- `GET /api/blog/[id]` - Get a specific blog post
- `PUT /api/blog/[id]` - Update a blog post
- `DELETE /api/blog/[id]` - Delete a blog post

## Authentication

The admin panel uses a simple cookie-based authentication system:

- Login endpoint: `POST /api/auth/login`
- Logout endpoint: `GET /api/auth/logout`
- Default credentials (if not set in environment variables):
  - Username: admin
  - Password: fosskok2025

Authentication is enforced via middleware that protects all `/admin/*` routes except `/admin/login`.

## Supabase Integration

The application uses Supabase for data storage. The connection is established using environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Three utility files handle Supabase connections:
- `utils/supabase/client.ts` - Client-side Supabase instance
- `utils/supabase/server.ts` - Server-side Supabase instance
- `utils/supabase/middleware.ts` - Middleware for Supabase authentication

## Deployment

The application is deployed on Vercel. Important configuration:

1. Environment variables must be set in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
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

### Route Handlers in Next.js 15

Next.js 15 uses Promise-based params in route handlers. The correct type definition is:

```typescript
type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  // Use id to fetch data
}
```

### Image Handling

Images for members and blog posts are stored as URLs. The application supports:
1. Direct URLs to external images
2. Base64 encoded images (for small images)
3. Vercel Blob Storage (for larger uploads)

## Maintenance and Extension

### Adding New Features

1. **New Database Tables**:
   - Add new migration files in `supabase/migrations/`
   - Run the SQL commands in the Supabase SQL editor

2. **New API Routes**:
   - Create new route files in `app/api/`
   - Follow the pattern of existing routes

3. **New Admin Panel Sections**:
   - Add new components in `src/components/admin/`
   - Update the admin page to include the new section

### Common Issues

1. **Deployment Errors**:
   - Check that all environment variables are correctly set in Vercel
   - Ensure the Supabase project is active and accessible

2. **API Route Errors**:
   - Verify that route handler types match the Next.js 15 requirements
   - Check Supabase connection and permissions

3. **Authentication Issues**:
   - Ensure cookies are being properly set and read
   - Check that the middleware is correctly configured

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file with the required environment variables
4. Run the development server: `npm run dev`
5. Access the site at `http://localhost:3000`
