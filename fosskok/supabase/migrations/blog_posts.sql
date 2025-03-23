-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  image_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow anonymous read access" 
  ON public.blog_posts
  FOR SELECT 
  USING (is_published = true);

-- Allow authenticated users to create/update/delete
CREATE POLICY "Allow authenticated users full access" 
  ON public.blog_posts
  USING (auth.role() = 'authenticated');

-- Sample data
INSERT INTO public.blog_posts (title, content, author, slug, is_published)
VALUES 
  ('Velkommen til Fosskok', '<p>Vi er glade for å lansere vår nye nettside! Her vil vi dele oppskrifter, tips og arrangementer relatert til bærekraftig matlaging og sanking av mat i naturen.</p><p>Følg med for mer innhold snart!</p>', 'Jens Malm', 'velkommen-til-fosskok', true),
  ('Vårens beste sankevekster', '<p>Nå som våren er her, er det mange spiselige vekster som dukker opp i naturen. Her er våre topp 5 favoritter:</p><ul><li>Ramsløk</li><li>Brennesle</li><li>Skvallerkål</li><li>Løvetann</li><li>Syre</li></ul><p>Disse kan brukes i salater, supper, pesto og mye mer!</p>', 'Anna Hansen', 'varens-beste-sankevekster', true),
  ('Hvordan fermentere grønnsaker', '<p>Fermentering er en eldgammel konserveringsmetode som ikke bare forlenger holdbarheten til maten, men også tilfører spennende smaker og øker næringsinnholdet.</p><p>I denne artikkelen vil vi gå gjennom grunnleggende fermenteringsteknikker for nybegynnere.</p>', 'Ole Nordmann', 'hvordan-fermentere-gronnsaker', false);
