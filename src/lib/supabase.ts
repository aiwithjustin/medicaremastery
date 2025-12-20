import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Enrollment {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  payment_status: 'pending' | 'completed' | 'failed';
  payment_amount: number;
  stripe_payment_intent_id?: string;
  created_at: string;
  updated_at: string;
}
