import { supabase } from "$lib/supabaseClient";

export async function load() {

  const { data, error } = await supabase

    .from('users')
    .select()
    .eq('name', 'Tom');
    return{
      data: data ?? [],
    };
}