// V2 — SUPABASE CONNECTION
// Temporary safe fallback: the menu must remain visible even if the remote
// Supabase SDK fails to load. Database reconnection will be restored after.

export const supabase = {
  from() {
    return {
      select: async () => ({ data: null, error: new Error('Supabase temporarily unavailable') })
    };
  },
  rpc: async () => ({ data: null, error: new Error('Supabase temporarily unavailable') })
};
