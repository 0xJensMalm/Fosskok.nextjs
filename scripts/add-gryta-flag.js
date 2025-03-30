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

async function addGrytaFlag() {
  console.log('Adding Gryta feature flag to the database...');

  // Check if the flag already exists
  const { data: existingFlag, error: checkError } = await supabase
    .from('feature_flags')
    .select('*')
    .eq('key', 'enableGrytaPage');

  if (checkError) {
    console.error('Error checking for existing flag:', checkError);
    process.exit(1);
  }

  // If the flag already exists, update it
  if (existingFlag && existingFlag.length > 0) {
    console.log('Flag already exists. Updating...');
    
    const { error: updateError } = await supabase
      .from('feature_flags')
      .update({
        value: true,
        description: 'Enable the Gryta feature - a creative mosaic grid where users can contribute images',
        updated_at: new Date().toISOString()
      })
      .eq('key', 'enableGrytaPage');

    if (updateError) {
      console.error('Error updating flag:', updateError);
      process.exit(1);
    }
    
    console.log('Flag updated successfully!');
  } else {
    // If the flag doesn't exist, create it
    console.log('Flag does not exist. Creating...');
    
    const { error: insertError } = await supabase
      .from('feature_flags')
      .insert({
        key: 'enableGrytaPage',
        value: true,
        description: 'Enable the Gryta feature - a creative mosaic grid where users can contribute images',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error inserting flag:', insertError);
      process.exit(1);
    }
    
    console.log('Flag created successfully!');
  }
}

addGrytaFlag()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
