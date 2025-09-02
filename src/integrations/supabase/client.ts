import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function createFailingClient(message: string) {
  const fn = () => {
    throw new Error(message);
  };
  return new Proxy({}, {
    get: () => fn,
    apply: fn as unknown as any,
  }) as any;
}

export const supabase = (SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY)
  ? createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createFailingClient('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in environment settings.');
