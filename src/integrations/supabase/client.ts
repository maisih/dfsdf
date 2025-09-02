import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const FALLBACK_URL = 'https://vtilhnvplxngstuetsak.supabase.co';
const FALLBACK_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0aWxobnZwbHhuZ3N0dWV0c2FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjM4MjMsImV4cCI6MjA3MTg5OTgyM30.iLObpLXeYY1WZd24q1KowRLtGtZb_fxn7DF5C2WoiZc';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || FALLBACK_URL;
const SUPABASE_PUBLISHABLE_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || FALLBACK_ANON;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
