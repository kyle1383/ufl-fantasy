import { supabase } from '$lib/supabaseClient'
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';
//TODO figure out how to use event as well as fetch
export async function load({locals}) {
    if (!locals.user) {
        throw redirect(303, '/profile?url=/leagues/')
    }
   
    const { data, error } = await supabase
        .from('members')
        .select('leagues ( * )')
        .eq('user_id', locals.user.id)
 
    return {
        user_leagues: data
    };
}