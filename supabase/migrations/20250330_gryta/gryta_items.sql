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

-- Set up storage policies for gryta images
-- Make sure 'images' bucket exists and has appropriate permissions
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Create folders for gryta images
-- Note: This is a placeholder as Supabase doesn't directly support folder creation in SQL
-- Folders will be created automatically when the first file is uploaded to that path
