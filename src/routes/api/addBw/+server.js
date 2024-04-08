// src/routes/api/submit.js
import { supabase } from '$lib/supabaseClient';


export async function POST({ request }) {

  const userData = await request.json();

  const { data, error } = await supabase
    .from('bodyweight')
    .insert([
      { uid: userData.user_id, created_at: userData.today, bodyweight: userData.bodyweight }
    ]);

  if (error) throw new Error(error.message);
  return new Response(String(data));
}