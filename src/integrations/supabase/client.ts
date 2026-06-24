import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// ⚠️ FIX (blog navigation bug):
// Pehle code browser mein env vars missing hone par `throw new Error(...)` kar deta tha.
// Isse jab bhi koi route's loader client-side navigation par supabase ko call karta
// (e.g. /blog/$slug), woh error TanStack Router ki navigation ko beech mein tod deta tha:
// URL change ho jata tha (history push already ho chuka hota) lekin route component
// kabhi render nahi hota — exactly jo bug report hua tha.
//
// Yahan humne throw hata diya hai aur ek graceful fallback + clear console error
// diya hai, taake navigation kabhi na toote. Lekin ASAL FIX ye hai ke aapko
// VITE_SUPABASE_PUBLISHABLE_KEY ko BUILD-TIME env var ke taur par set karna hoga
// (neeche diye gaye instructions dekhein) — warna data fetch fail hoga (empty/error
// state dikhega), bas crash nahi hoga.

let warnedMissingEnv = false;

function createSupabaseClient() {
  // ✅ Browser aur Server dono ke liye
  const SUPABASE_URL =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
    (typeof process !== 'undefined' && (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)) ||
    '';

  const SUPABASE_PUBLISHABLE_KEY =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
    (typeof process !== 'undefined' && (process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY)) ||
    '';

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    if (!warnedMissingEnv) {
      warnedMissingEnv = true;
      // eslint-disable-next-line no-console
      console.error(
        '[Supabase] Missing env vars: ' +
          [!SUPABASE_URL && 'VITE_SUPABASE_URL', !SUPABASE_PUBLISHABLE_KEY && 'VITE_SUPABASE_PUBLISHABLE_KEY']
            .filter(Boolean)
            .join(', ') +
          '. Supabase calls will fail (empty data) until these are set as BUILD-TIME ' +
          'environment variables — not just runtime/Worker vars or secrets.'
      );
    }
    // ✅ Crash nahi karte — chahe browser ho ya server, dummy client return karo.
    // Iske bina koi bhi client-side loader (jaise blog/$slug) navigation ko tod deta tha.
    return createClient<Database>(
      'https://placeholder.supabase.co',
      'placeholder-key'
    );
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    }
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
