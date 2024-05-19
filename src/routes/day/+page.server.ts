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
  addItem: async ({ request }) => {
    const formData = await request.formData()
    const item = String(formData.get('item'))

    if (!item) {
      return fail(400, { item, missing: true})
    }

    addItem(item) //supabase docs
    return { success: true }
  },
  removeItem: async ({ request }) => {
    const formData = await request.formData()
    const itemId = Number(formData.get('id'))

    removeItem(itemId)//supabase docs
    return { success: true }
  }

}