import { supabase } from "$lib/db/index";

export async function load() {

  const daysResponse = await supabase
    .from('days')
    .select()
    .eq('uid', '2')
  
  const bwResponse = await supabase
  .from('bodyweight')
  .select()
  .eq('uid', '2')

  const caloriesResponse = await supabase
  .from('calories')
  .select()
  .eq('uid', '2')

  const dietPlanResponse = await supabase
  .from('diet_plan')
  .select()
  .eq('uid', '2')
  
  const daysError = daysResponse.error;
  const bwError = bwResponse.error;
  const caloriesError = caloriesResponse.error;
  const dietPlanError = dietPlanResponse.error;

  if (daysError) return {status: 500,body: {error: `Error: ${daysError.message}`}};
  if (bwError) return {status: 500,body: {error: `Error: ${bwError.message}`}};
  if (caloriesError) return {status: 500,body: {error: `Error: ${caloriesError.message}`}};
  if (dietPlanError) return {status: 500,body: {error: `Error: ${dietPlanError.message}`}};
  
  return {
    daysResponse, bwResponse, caloriesResponse, dietPlanResponse,
  };
}