import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tslhfuekuwwmylxcgmlk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbGhmdWVrdXd3bXlseGNnbWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MjQ5OTMsImV4cCI6MjA2NTMwMDk5M30.MIF--sdA7iqy7CeKalZje7Q-Y38mf_Cx-MnNvKBIit4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
