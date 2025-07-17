import { supabase } from '$lib/supabaseClient';

export async function load({ fetch, params }) {
  const exerciseRes = await supabase
    .from('exercises')
    .select('*')
    .order('name', { ascending: true });

  const exercisesErr = exerciseRes.error;

  if (exercisesErr) {
    return {
      status: 500,
      body: {
        error: `Error: ${exercisesErr.message}`,
      },
    };
  }

  const typesRes = await supabase.from('types').select('*');
  const typesErr = typesRes.error;

  if (typesErr) {
    return {
      status: 500,
      body: {
        error: `Error: ${typesErr.message}`,
      },
    };
  }

  const daysRes = await supabase.from('days').select();
  const daysErr = daysRes.error;

  if (daysErr) {
    return {
      status: 500,
      body: {
        error: `Error: ${daysErr.message}`,
      },
    };
  }

  const usersRes = await supabase.from('users').select('');
  const usersErr = usersRes.error;

  if (usersErr) {
    return {
      status: 500,
      body: {
        error: `Error: ${usersErr.message}`,
      },
    };
  }

  const bwRes = await supabase.from('bodyweight').select('');
  const bwResErr = bwRes.error;

  if (bwResErr) {
    return {
      status: 500,
      body: {
        error: `Error: ${bwResErr.message}`,
      },
    };
  }

  const caloriesRes = await supabase.from('calories').select('');
  const caloriesResErr = caloriesRes.error;

  if (caloriesResErr) {
    return {
      status: 500,
      body: {
        error: `Error: ${caloriesResErr.message}`,
      },
    };
  }

  const dietPlanRes = await supabase.from('diet_plan').select();
  const dietPlanErr = dietPlanRes.error;

  if (dietPlanErr) {
    return {
      status: 500,
      body: {
        error: `Error: ${dietPlanErr.message}`,
      },
    };
  }

  return {
    exerciseRes,
    typesRes,
    daysRes,
    usersRes,
    bwRes,
    caloriesRes,
    dietPlanRes,
  };
}
