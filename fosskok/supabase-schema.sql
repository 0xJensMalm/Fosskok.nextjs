-- Create the Member table
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the Event table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the BlogPost table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  image TEXT,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read members" 
ON members
FOR SELECT 
TO anon
USING (true);

CREATE POLICY "Public can read events" 
ON events
FOR SELECT 
TO anon
USING (true);

CREATE POLICY "Public can read published blog posts" 
ON blog_posts
FOR SELECT 
TO anon
USING (published = true);

-- Create policies for authenticated users (admin)
CREATE POLICY "Authenticated users can perform all operations on members" 
ON members
FOR ALL 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can perform all operations on events" 
ON events
FOR ALL 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can perform all operations on blog posts" 
ON blog_posts
FOR ALL 
TO authenticated
USING (true);
