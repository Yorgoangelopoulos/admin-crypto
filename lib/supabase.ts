import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if Supabase environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables not found. Some features may not work.")
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Test connection function
export async function testSupabaseConnection() {
  if (!supabase) {
    return false
  }

  try {
    const { error } = await supabase.from("users").select("count").limit(1)
    return !error
  } catch (error) {
    console.warn("Supabase connection test failed:", error)
    return false
  }
}
