import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createGrytaTable() {
  console.log('Creating gryta_items table and storage policies...');

  try {
    // Check if the table already exists
    const { data: existingTables, error: tableCheckError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'gryta_items')
      .eq('table_schema', 'public');

    if (tableCheckError) {
      console.error('Error checking for existing table:', tableCheckError);
      process.exit(1);
    }

    // Create the table if it doesn't exist
    if (!existingTables || existingTables.length === 0) {
      console.log('Table does not exist. Creating gryta_items table...');

      // Create the table using raw SQL
      const { error: createTableError } = await supabase.rpc('exec_sql', {
        query: `
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
        `
      });

      if (createTableError) {
        console.error('Error creating table:', createTableError);
        process.exit(1);
      }

      console.log('Table created successfully!');
    } else {
      console.log('Table already exists.');
    }

    // Set up storage policies
    console.log('Setting up storage policies...');

    // Check if the images bucket exists
    const { data: buckets, error: bucketError } = await supabase
      .storage
      .listBuckets();

    if (bucketError) {
      console.error('Error checking buckets:', bucketError);
      process.exit(1);
    }

    const imagesBucket = buckets.find(bucket => bucket.name === 'images');

    if (!imagesBucket) {
      console.log('Creating images bucket...');
      const { error: createBucketError } = await supabase
        .storage
        .createBucket('images', { public: true });

      if (createBucketError) {
        console.error('Error creating bucket:', createBucketError);
        process.exit(1);
      }
      console.log('Bucket created successfully!');
    } else {
      console.log('Images bucket already exists.');
    }

    // Create the gryta folder inside the images bucket
    console.log('Creating gryta folder...');
    
    // We can't directly create folders, but we can upload a placeholder file
    // to effectively create the folder
    const placeholderContent = new Uint8Array([]);
    
    const { error: uploadError } = await supabase
      .storage
      .from('images')
      .upload('gryta/.placeholder', placeholderContent, { upsert: true });
    
    if (uploadError && uploadError.message !== 'The resource already exists') {
      console.error('Error creating gryta folder:', uploadError);
      // Continue anyway as this is not critical
    }
    
    const { error: uploadThumbnailError } = await supabase
      .storage
      .from('images')
      .upload('gryta/thumbnails/.placeholder', placeholderContent, { upsert: true });
    
    if (uploadThumbnailError && uploadThumbnailError.message !== 'The resource already exists') {
      console.error('Error creating thumbnails folder:', uploadThumbnailError);
      // Continue anyway as this is not critical
    }

    console.log('Setup completed successfully!');
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

createGrytaTable()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
