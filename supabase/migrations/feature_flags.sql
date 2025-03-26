-- Create feature_flags table
CREATE TABLE IF NOT EXISTS feature_flags (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) NOT NULL UNIQUE,
  value BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial feature flags
INSERT INTO feature_flags (key, value, description)
VALUES 
  ('enableGrytaPage', false, 'Show the Gryta page in navigation'),
  ('enableMerchPage', false, 'Show the Merch page in navigation')
ON CONFLICT (key) 
DO UPDATE SET 
  description = EXCLUDED.description;
