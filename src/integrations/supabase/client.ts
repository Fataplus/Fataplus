import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use environment variables for Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://rxsnczjqcrcojspdahug.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4c25jempxY3Jjb2pzcGRhaHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMDkzNzAsImV4cCI6MjA1NzY4NTM3MH0.e9EPASS7lDwF0HEi1vjDnC13PVnIOiFRhZsaKUgDwBs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);