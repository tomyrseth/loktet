// src/routes/api/submit.js
import { supabase } from '$lib/supabaseClient';


export async function POST({ request }) {

  const userData = await request.json();

  const { data, error } = await supabase
    .from('days')
    .insert([
      {name: userData.day, uid: userData.uid}
    ]);

  if (error) throw new Error(error.message);
  return new Response(String(data));
}

