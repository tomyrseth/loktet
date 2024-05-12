// src/routes/api/submit.js
import { supabase } from '$lib/supabaseClient';


export async function POST({ request }) {

  const userData = await request.json();

  const { data, error } = await supabase
    .from('days')
    .insert([ {name: userData.day_name, uid: userData.uid, created_at: userData.currentClickedDay.date} ])
    .select()

  if (error) throw new Error(error.message);
  return new Response(String(data));
}

