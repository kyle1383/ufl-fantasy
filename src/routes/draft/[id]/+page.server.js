

import { fail } from '@sveltejs/kit'

import { supabase } from '$lib/supabaseClient'
//TODO figure out how to use event as well as fetch
export async function load({ locals, request, params }) {
    //get players from supabase
    const { data: players, error } = await supabase
        .from('players')
        .select('*, xfl_teams (*)')

    const {data: draft, error: draftError} = await supabase
        .from('drafts')
        .select('*')
        .eq('id', params.id)
        .single()
    
    return {
        players: players,
        draft: draft,
       
    }
}

export const actions = {
    test: async ({ request, params, locals }) => {
        //we need player_id, user_id, round, pick, possibly team id if we allow multiple teams per user
        //get player id
        const formData = await request.formData();
        const player_id = formData.get('player_id');
        return {
            status: 200,
            message: 'test'
        }
    },
    start: async ({ request, params, locals }) => {
       
    }
}

