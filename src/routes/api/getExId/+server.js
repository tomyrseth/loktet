import { supabase } from '$lib/supabaseClient';

export async function GET() {
    try {
        const { data, error, status } = await supabase
            .from('exercises')
            .select();

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
        console.error('Error fetching exercises:', err.message);
        // Creating a Response object for error scenarios
        return new Response(JSON.stringify({ error: `Error: ${err.message}` }), {
            status: 500, // Internal Server Error
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
