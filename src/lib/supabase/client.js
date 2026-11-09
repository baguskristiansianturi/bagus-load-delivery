import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Browser publishable key only. Never place service-role credentials here.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ytndswhqxayqpftszwfh.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_kOUbKBYg88nXgz8FQRSnvA_k0hvKY65';

// A single client keeps auth/session state consistent across frontend modules.
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
