import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// The browser publishable key is intentionally public. Never place a service-role
// or secret key in this module or in any VITE_* variable.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ytndswhqxayqpftszwfh.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_kOUbKBYg88nXgz8FQRSnvA_k0hvKY65';

// One browser client keeps auth/session state and realtime coordination canonical.
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
