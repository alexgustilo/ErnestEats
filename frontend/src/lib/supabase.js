import { createClient } from "@supabase/supabase-js"

// Accept either the Supabase project URL or a REST URL copied from the API
// settings; createClient needs the project root for Auth and Realtime.
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/rest\/v1\/?$/i, '')
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl,supabaseAnonKey)
