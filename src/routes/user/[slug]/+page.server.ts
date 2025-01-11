import { supabase } from "$lib/db/index";

export async function load({ params, depends }) {

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
  
  
  const daysResponse = await supabase
    .from('days')
    .select('*, lifts(*)')
    .eq('uid', uid)
    .gte('created_at', '2024-12-01');


  const userError = userResponse.error;
  if (userError) return {status: 500,body: {error: `Error userResponse: ${userError.message}`}};

  const daysError = daysResponse.error;
  if (daysError) return {status: 500,body: {error: `Error daysResponse: ${daysError.message}`}};

  const exerciseResponse = await supabase
  .from('exercises')
  .select('*')
  .order('name', { ascending: true} )

  const exerciseError = exerciseResponse.error;
  if (exerciseError) return {status: 500,body: {error: `Error exerciseResponse: ${exerciseError.message}`}};

  
  return {
    userResponse, exerciseResponse, daysResponse, uid
  };
}