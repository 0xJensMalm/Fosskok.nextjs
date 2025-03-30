/**
 * Script to add the enableThemeLab feature flag to the Supabase database
 * 
 * Run this script with: node scripts/add-theme-lab-flag.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function addThemeLabFlag() {
  try {
    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Error: Supabase URL or key not found in environment variables');
      process.exit(1);
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check if the flag already exists
    const { data: existingFlag, error: checkError } = await supabase
      .from('feature_flags')
      .select('*')
      .eq('key', 'enableThemeLab')
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for existing flag:', checkError);
      process.exit(1);
    }
    
    if (existingFlag) {
      console.log('Feature flag enableThemeLab already exists. Updating value to false.');
      
      // Update the existing flag
      const { error: updateError } = await supabase
        .from('feature_flags')
        .update({ 
          value: false,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'enableThemeLab');
      
      if (updateError) {
        console.error('Error updating feature flag:', updateError);
        process.exit(1);
      }
      
      console.log('Feature flag updated successfully');
    } else {
      console.log('Adding new feature flag: enableThemeLab');
      
      // Insert the new flag
      const { error: insertError } = await supabase
        .from('feature_flags')
        .insert({
          key: 'enableThemeLab',
          value: false,
          description: 'Enable theme customization feature in the header',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.error('Error inserting feature flag:', insertError);
        process.exit(1);
      }
      
      console.log('Feature flag added successfully');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

// Run the function
addThemeLabFlag();
