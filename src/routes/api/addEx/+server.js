import { supabase } from '$lib/supabaseClient';


export async function POST({ request }) {

  /*
  const userData = await request.json();

  const { data, error } = await supabase
    .from('exercises')
    .insert({ name: userData.exerciseSelect })
    .select()

  if (error) throw new Error(error.message);
  return new Response(String(data));
  */

  const userData = await request.json();
  try {
    const { data, error } = await supabase
    .from('exercises')
    .insert({ name: userData.exerciseSelect })
    .select()

    if (error) {
        throw new Error(error.message);
    }

    // Creating a Response object for successful data retrieval
    return new Response(JSON.stringify({ data }), {
        status: 200, // OK
        headers: {
            'Content-Type': 'application/json',
        },
    });
  } catch (err) {
    console.error('Error fetching days:', err.message);
    // Creating a Response object for error scenarios
    return new Response(JSON.stringify({ error: `Error: ${err.message}` }), {
        status: 500, // Internal Server Error
        headers: {
            'Content-Type': 'application/json',
        },
    });
}






}




