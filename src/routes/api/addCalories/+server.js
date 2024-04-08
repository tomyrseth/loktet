// src/routes/api/submit.js
import { supabase } from '$lib/supabaseClient';


export async function POST({ request }) {

  const userData = await request.json();

  const { data, error } = await supabase
    .from('calories')
    .insert([
      { uid: userData.user_id, calories: userData.calories, created_at: userData.today, protein:userData.protein, carbs: userData.carbs, fats: userData.fats }
    ]);

  if (error) throw new Error(error.message);
  return new Response(String(data));
}