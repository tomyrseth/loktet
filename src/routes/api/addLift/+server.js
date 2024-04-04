// src/routes/api/submit.js
import { supabase } from '$lib/supabaseClient';


export async function POST({ request }) {

  const userData = await request.json();

  const { data, error } = await supabase
    .from('lifts')
    .insert([
      { day_id: userData.day_id, exercise_id: userData.ex_id, sets: userData.sets, reps: userData.reps, weight: userData.weight, notes: userData.notes, }
    ]);

  if (error) throw new Error(error.message);
  return new Response(String(data));
}