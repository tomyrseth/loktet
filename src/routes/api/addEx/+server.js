import { supabase } from '$lib/supabaseClient';


export async function POST({ request }) {

  const userData = await request.json();

  const { data, error } = await supabase
    .from('exercises')
    .insert([
      { name: userData.exerciseSelect }
    ]);

  if (error) throw new Error(error.message);
  return new Response(String(data));
}