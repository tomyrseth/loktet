import { supabase } from '$lib/supabaseClient';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

let uid;

export const load: PageServerLoad = async ({ url }) => {
  const day_id = url.searchParams.get('day_id');
  uid = url.searchParams.get('user_id');

  const { data, error } = await supabase

    .from('lifts')
    .select()
    .eq('day_id', day_id)
    .order('id', { ascending: true });
  return {
    data: data ?? [],
  };
};

export const actions: Actions = {
  lift: async ({ request }) => {
    const formData = await request.formData();
    let weight = formData.get('weight');
    const sets = formData.get('sets');
    const reps = formData.get('reps');
    const notes = formData.get('notes');
    let rir = formData.get('rir');
    const ex_id = formData.get('ex_id');
    const day_id = formData.get('day_id');

    if (!weight) {
      weight = 0;
    }
    if (!rir) {
      rir = null;
    }
    console.log('BACKEND: ', ex_id);

    const { data, error } = await supabase.from('lifts').insert([
      {
        day_id: day_id,
        exercise_id: ex_id,
        sets: sets,
        reps: reps,
        weight: weight,
        notes: notes,
        rir: rir,
      },
    ]);

    if (!error) {
      return { success: true, data: data };
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
      return { success: true, data: data };
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

    const { data, error } = await supabase.from('calories').insert([
      {
        uid: uid,
        calories: calories,
        created_at: today,
        protein: protein,
        carbs: carbs,
        fats: fats,
      },
    ]);

    if (!error) {
      return { success: true, data: data };
    }
    throw new Error(error.message);
  },

  editLift: async ({ request }) => {
    const formData = await request.formData();
    let weight = formData.get('weight');
    const liftID = formData.get('id');
    const sets = formData.get('sets');
    const reps = formData.get('reps');
    let rir = formData.get('rir');
    const notes = formData.get('notes');
    const ex_id = formData.get('ex_id');
    console.log('backend edit', formData);

    if (!weight) {
      weight = 0;
    }
    if (!rir) {
      rir = null;
    }

    const { data, error } = await supabase
      .from('lifts')
      .update({
        exercise_id: ex_id,
        sets: sets,
        reps: reps,
        weight: weight,
        rir: rir,
        notes: notes,
      })
      .eq('id', liftID);

    if (!error) {
      return { success: true, data: data };
    }
    throw new Error(error.message);
  },

  deleteLift: async ({ request }) => {
    const formData = await request.formData();
    const liftID = formData.get('id');
    console.log('backend delete', formData);

    const { data, error } = await supabase
      .from('lifts')
      .delete()
      .eq('id', liftID);

    if (!error) {
      return { success: true, data: data };
    }
    throw new Error(error.message);
  },
};
