import { supabase } from "$lib/supabaseClient";
import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from './$types';

let uid;

export const load: PageServerLoad = async ({ url }) => {
  const day_id = url.searchParams.get('day_id');
  uid = url.searchParams.get('user_id');

  const { data, error } = await supabase

  .from('lifts')
  .select()
  .eq('day_id', day_id);
  return{
    data: data ?? [],
  };
};

export const actions: Actions = {
  lift: async ({ request }) => {
    const formData = await request.formData()
    let weight = formData.get('weight');
    const sets = formData.get('sets');
    const reps = formData.get('reps');
    const notes = formData.get('notes');
    const ex_id = formData.get('ex_id');
    const day_id = formData.get('day_id');

    if (!weight) {
      weight = 0;
    }

    const { data, error } = await supabase
    .from('lifts')
    .insert([
      { day_id: day_id, exercise_id: ex_id, sets: sets, reps: reps, weight: weight, notes: notes }
    ]);

    if (!error) {
      location.reload();
      return { success: true , data: data}
    }
    throw new Error(error.message);
  },

  bw: async ({ request }) => {
    const formData = await request.formData();

    const bw = formData.get('bw');
    
    const today = formData.get('today');

    const { data, error } = await supabase
    .from('bodyweight')
    .insert({ uid: uid, created_at: today, bodyweight: bw });

    if (!error) {
      location.reload();
      return { success: true , data: data}
    }
    throw new Error(error.message);
  },

  calories: async ({ request }) => {
    const formData = await request.formData();

    const calories = formData.get('calories');
    const protein = formData.get('protein');
    const carbs = formData.get('carbs');
    const fats = formData.get('fats');
    const today = formData.get('today');

    const { data, error } = await supabase
    .from('calories')
    .insert([
      { uid: uid, calories: calories, created_at: today, protein: protein, carbs: carbs, fats: fats}
    ]);

    if (!error) {
      location.reload();
      return { success: true , data: data}
    }
    throw new Error(error.message);
  },

  editLift: async ({ request }) => {
    const formData = await request.formData()
    let weight = formData.get('weight');
    const sets = formData.get('sets');
    const reps = formData.get('reps');
    const notes = formData.get('notes');
    const ex_id = formData.get('ex_id');
    const day_id = formData.get('day_id');

    if (!weight) {
      weight = 0;
    }

    const { data, error } = await supabase
    .from('lifts')
    .insert([
      { day_id: day_id, exercise_id: ex_id, sets: sets, reps: reps, weight: weight, notes: notes }
    ]);

    if (!error) {
      location.reload();
      return { success: true , data: data}
    }
    throw new Error(error.message);
  }






}