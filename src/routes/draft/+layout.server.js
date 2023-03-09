

import { fail } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import { supabase } from '$lib/supabaseClient'

export async function load({ locals, request, params }) {
    if (!locals.user) {
        throw redirect(303, '/profile/')
    }

    const { data: draft, error: draftError } = await supabase
        .from('drafts')
        .select('*, picks!picks_draft_id_fkey (*, teams (*))')
        .eq('id', params.id)
        .single()
    //get players from supabase
    const picks = draft.picks.map(pick => pick.player_id)
  

    const { data: players, error } = await supabase
        .from('players')
        .select('*, xfl_teams (*)')
    

    const filteredPlayers = players?.filter(player => !picks.includes(player.name_id))

    if( draftError || error) {
        draftError ? console.log(draftError) : console.log(error)
        return fail(401, { error_message: "Unauthorized" })
    }
    
    return {
        players: filteredPlayers,
        draft: draft,    
    }
}