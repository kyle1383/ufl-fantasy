// @ts-nocheck
import { fail } from '@sveltejs/kit'
import { supabase } from '$lib/supabaseClient'
import { redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ locals, request, event, params }) => {
     
       
      
        //throw redirect(307, '/leagues');
        return {
            message: "Created rows",
        }
    }
}

export async function load({ fetch, params, setHeaders, locals }) {
    if (!locals.user) {
        throw redirect(303, '/leagues')
    }
    const { data, error }  = await supabase.from('commisioners')
    .select('profiles ( * )')
    .eq('league_id', params.id)
    if (data[0].profiles.id !== locals.user.id) {
        throw redirect(303, '/leagues')
    }
    const { data: league, error: leagueError } = await supabase
    .from('leagues')
    .select('*')
    .eq('id', params.id)

    return {
        league: league
    };
}