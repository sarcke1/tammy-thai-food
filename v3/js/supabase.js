// V2 — SUPABASE CONNECTION
// Only the public publishable key belongs in this file.
// Never place the service_role/secret key here.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://ugarjrbtvwbwppfeusgd.supabase.co';

const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_86yXv-GlRPvRcYH-HMQuJw_fUbqbn5m';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
