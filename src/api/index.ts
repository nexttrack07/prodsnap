import { createClient } from "@supabase/supabase-js"


const client = createClient(
  import.meta.env.VITE_SUPABASE_PROJECT_URL,
  import.meta.env.VITE_SUPABASE_ANON_API_KEY
)
export async function getShapes() {

  let { data, error } = await client
  .from('shapes')
  .select('*')

  return { data, error }
}