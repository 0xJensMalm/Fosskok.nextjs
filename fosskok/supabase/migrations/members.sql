-- Create members table
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  email TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow anonymous read access" 
  ON public.members
  FOR SELECT 
  USING (true);

-- Allow authenticated users to create/update/delete
CREATE POLICY "Allow authenticated users full access" 
  ON public.members
  USING (auth.role() = 'authenticated');

-- Sample data
INSERT INTO public.members (name, role, bio, image_url, order_index)
VALUES 
  ('Jens Malm', 'Leder', 'Grunnlegger av Fosskok og entusiast for bærekraftig matlaging.', 'https://example.com/jens.jpg', 1),
  ('Anna Hansen', 'Kokk', 'Profesjonell kokk med fokus på lokale råvarer og tradisjonelle oppskrifter.', 'https://example.com/anna.jpg', 2),
  ('Ole Nordmann', 'Forager', 'Ekspert på ville vekster og sanking av mat i naturen.', 'https://example.com/ole.jpg', 3);
