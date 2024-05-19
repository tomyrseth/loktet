import { supabase } from "$lib/supabaseClient";
import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const day_id = url.searchParams.get('day_id');
  const user_id = url.searchParams.get('user_id');

  const { data, error } = await supabase

  .from('lifts')
  .select()
  .eq('day_id', day_id);
  return{
    data: data ?? [],
  };

  return {name};
};

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData()
    //const item = String(formData.get('item'))
    const exercise = formData.get('exercise');
    const weight = formData.get('weight');
    const sets = formData.get('sets');
    const reps = formData.get('reps');
    const notes = formData.get('notes');

    const ex_id = formData.get('ex_id');
    console.log("🚀 ~ default: ~ ex_id:", ex_id)
    const day_id = formData.get('day_id');

    const { data, error } = await supabase
    .from('lifts')
    .insert([
      { day_id: day_id, exercise_id: ex_id, sets: sets, reps: reps, weight: weight, notes: notes }
    ]);

    if (!error) {
      return { success: true , data: data}
    }
    throw new Error(error.message);
  }

  /*
  removeItem: async ({ request }) => {
    const formData = await request.formData()
    const itemId = Number(formData.get('id'))

    removeItem(itemId)//supabase docs
    return { success: true }
  }
  */

}