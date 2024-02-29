import { supabase } from "$lib/supabaseClient";

export async function load() {

  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      program_templates (
        *,
        day_templates (
          *,
          workout_templates (
              *,
              exercises (
                *
              ),
              workout_logs ( * )
            )
          )
        )
      )
    `);
    return{
      data: data ?? [],
    };
};
