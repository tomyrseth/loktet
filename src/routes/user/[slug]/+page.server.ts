import { supabase } from "$lib/db/index";

export async function load() {

  const userResponse = await supabase
    .from('users')
    .select('name, days(*), calories(*), bodyweight(*), diet_plan(*)')
    .eq('id', '1')
  
  const userError = userResponse.error;

  if (userError) return {status: 500,body: {error: `Error: ${userError.message}`}};
  
  return {
    userResponse,
  };
}