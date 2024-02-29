import { supabase } from "$lib/supabaseClient";

export async function load() {

  const { data, error } = await supabase
    .from('users')
    .select(`
      name,
      programs (
        program_name,
        days (
          day_name,
          programExercises (
            exercise_id,
            sets,
            reps,
            weight,
            notes
          )
        )
      )
    `);
    return{
      data: data ?? [],
    };
};
