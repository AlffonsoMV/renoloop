import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zverfgaqkgtlgxjwlbmt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2ZXJmZ2Fxa2d0bGd4andsYm10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNTAyMzUsImV4cCI6MjA1NjgyNjIzNX0.2hGzuauBnya9kFrZ9_eXl895ebu7-XtTERRb0JEmsqU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
