-- Check if the feature flag already exists
INSERT INTO feature_flags (key, value, description)
VALUES 
  ('enableThemeLab', true, 'Enable the Theme Lab feature for customizing the site appearance')
ON CONFLICT (key) 
DO UPDATE SET value = true;
