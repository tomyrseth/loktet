import { supabase } from "$lib/db/index";

export async function load({ params }) {

  let uid = null;

  switch (params.slug) {
    case 'tom':
      uid = 1;
      break;
  
    case 'saab':
      uid = 2;
      break;

    default:
      console.log('No uid found, is the url parameter correct?')
      break;
  }

  const userResponse = await supabase
    .from('users')
    .select('name, days(*), calories(*), bodyweight(*), diet_plan(*)')
    .eq('id', uid);
  
  const userError = userResponse.error;

  if (userError) return {status: 500,body: {error: `Error: ${userError.message}`}};
  
  return {
    userResponse, uid
  };
}