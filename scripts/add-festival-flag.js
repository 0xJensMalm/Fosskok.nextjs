// Script to add the enableFestivalPage feature flag to the database
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addFeatureFlag() {
  try {
    // Check if the flag already exists
    const { data: existingFlag, error: checkError } = await supabase
      .from('feature_flags')
      .select('*')
      .eq('key', 'enableFestivalPage')
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for existing flag:', checkError);
      return;
    }

    if (existingFlag) {
      console.log('Feature flag already exists. Updating to enabled...');
      
      // Update the existing flag
      const { error: updateError } = await supabase
        .from('feature_flags')
        .update({ value: true })
        .eq('key', 'enableFestivalPage');

      if (updateError) {
        console.error('Error updating feature flag:', updateError);
        return;
      }

      console.log('Feature flag updated successfully!');
    } else {
      console.log('Adding new feature flag...');
      
      // Insert the new flag
      const { error: insertError } = await supabase
        .from('feature_flags')
        .insert({
          key: 'enableFestivalPage',
          value: true,
          description: 'Enable the Festival i hagen 2025 page and navigation item'
        });

      if (insertError) {
        console.error('Error inserting feature flag:', insertError);
        return;
      }

      console.log('Feature flag added successfully!');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

addFeatureFlag();
