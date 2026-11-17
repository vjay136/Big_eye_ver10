import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
export const backendConfigured = Boolean(url && key);

// The local triage route can run before a backend is configured.
export const supabase = createClient(
  url || 'https://unconfigured.invalid',
  key || 'unconfigured',
);
