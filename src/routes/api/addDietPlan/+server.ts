import { supabase } from '$lib/supabaseClient';


export async function POST({ request }) {

  const userData = await request.json();

  const { data, error } = await supabase
    .from('diet plan')
    .insert([
      {uid: userData.uid, type:userData.cbm, amount: userData.calorieGoal, created_at: userData.dateSelected}
    ]);

  if (error) throw new Error(error.message);
  return new Response(String(data));
}