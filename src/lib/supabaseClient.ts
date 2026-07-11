import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// ponytail: lazy singleton — createClient is cheap, but one client is plenty.
export const supabase =
  url && publishableKey ? createClient(url, publishableKey) : null;
