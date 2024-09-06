// src/routes/api/submit.js
import { supabase } from "$lib/db/index";


export async function POST({ request }) {

  const userData = await request.json();
  console.log(userData, 'BACKEND')

  const { data, error } = await supabase
    .from('days')
    .insert([ {name: userData.dayName, uid: userData.uid, created_at: userData.currentClickedDay.date} ])
    .select()

  if (error) throw new Error(error.message);
  return new Response(String(data));
}

