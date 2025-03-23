-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow anonymous read access" 
  ON public.events
  FOR SELECT 
  USING (true);

-- Allow authenticated users to create/update/delete
CREATE POLICY "Allow authenticated users full access" 
  ON public.events
  USING (auth.role() = 'authenticated');

-- Sample data
INSERT INTO public.events (title, description, date, location, is_featured)
VALUES 
  ('Vårens sanketur', 'Bli med på en guidet tur for å sanke vårens første spiselige vekster. Vi møtes ved Fosskok-huset og går sammen til nærliggende områder.', '2025-04-15 10:00:00+01', 'Fosskok-huset, Oslo', true),
  ('Fermentering workshop', 'Lær hvordan du kan fermentere grønnsaker og lage din egen kombucha. Alle ingredienser er inkludert i prisen.', '2025-05-01 18:00:00+01', 'Fosskok-huset, Oslo', false),
  ('Bærekraftig fiskemiddag', 'En kveld dedikert til bærekraftig fisk og sjømat. Vi tilbereder og nyter en treretters middag sammen.', '2025-05-20 19:00:00+01', 'Fosskok-huset, Oslo', false);
