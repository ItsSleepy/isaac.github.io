// ================================================
// SUPABASE CONFIGURATION
// ================================================
// Replace these values with your own from Supabase Dashboard

const SUPABASE_CONFIG = {
    // Get this from: Project Settings > API > Project URL
    url: 'YOUR_SUPABASE_URL_HERE',  // Example: 'https://xxxxx.supabase.co'
    
    // Get this from: Project Settings > API > Project API keys > anon public
    anonKey: 'YOUR_SUPABASE_ANON_KEY_HERE'  // Long string starting with 'eyJ...'
};

// Don't change this - it imports the Supabase client library
const SUPABASE_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';

// ================================================
// INSTRUCTIONS:
// ================================================
// 1. Go to your Supabase project dashboard
// 2. Click on Settings (gear icon) > API
// 3. Copy "Project URL" and paste it above as SUPABASE_CONFIG.url
// 4. Copy "anon public" key and paste it above as SUPABASE_CONFIG.anonKey
// 5. Save this file
// 6. Your portfolio will now use Supabase database!
//
// Security Note:
// - The anon key is SAFE to expose publicly
// - It only allows read access thanks to Row Level Security (RLS)
// - Admin writes will use a different method (password protected)
// ================================================
