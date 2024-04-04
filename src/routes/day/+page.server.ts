import { error } from '@sveltejs/kit';
import { supabase } from "$lib/supabaseClient";

export const load = (async ({ url }) => {
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
});