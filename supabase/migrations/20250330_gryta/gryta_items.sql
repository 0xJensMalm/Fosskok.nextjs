-- Create the gryta_items table
CREATE TABLE IF NOT EXISTS gryta_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  description TEXT,
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  sound_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS gryta_items_created_at_idx ON gryta_items(created_at);

-- Create an index on member_id for faster lookups
CREATE INDEX IF NOT EXISTS gryta_items_member_id_idx ON gryta_items(member_id);

-- Ensure the images bucket exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the images bucket
-- Allow public read access to all files in the bucket
INSERT INTO storage.policies (name, bucket_id, definition)
VALUES 
  ('Public Read Access', 'images', 
   '(bucket_id = ''images''::text)')
ON CONFLICT (name, bucket_id) DO NOTHING;

-- Allow authenticated users to upload files
INSERT INTO storage.policies (name, bucket_id, definition)
VALUES 
  ('Auth Upload Access', 'images', 
   '(bucket_id = ''images''::text AND auth.role() = ''authenticated'')')
ON CONFLICT (name, bucket_id) DO NOTHING;

-- Allow authenticated users to update files
INSERT INTO storage.policies (name, bucket_id, definition)
VALUES 
  ('Auth Update Access', 'images', 
   '(bucket_id = ''images''::text AND auth.role() = ''authenticated'')')
ON CONFLICT (name, bucket_id) DO NOTHING;

-- Allow authenticated users to delete files
INSERT INTO storage.policies (name, bucket_id, definition)
VALUES 
  ('Auth Delete Access', 'images', 
   '(bucket_id = ''images''::text AND auth.role() = ''authenticated'')')
ON CONFLICT (name, bucket_id) DO NOTHING;
