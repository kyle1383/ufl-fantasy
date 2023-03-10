// @ts-nocheck


import { fail } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import { supabase } from '$lib/supabaseClient'
//TODO figure out how to use event as well as fetch

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

export const actions = {
    /**
     * This should modify the draft table to add the player to the draft
     */
    draft: async ({ request, params, locals }) => {
        //we need player_id, user_id, round, pick, possibly team id if we allow multiple teams per user
        //get player id
        const formData = await request.formData();
        const player_id = formData.get('player_id');
        const draft = JSON.parse(formData.get('draft'));



        //TODO is there a better way? Should draft have a current pick property? 
        const currentPick = draft.picks.find((/** @type {{ round: any; pick: any; }} */ pick) => pick.round === draft.round && pick.pick === draft.pick);
        const nextPick = draft.pick === draft.order.length ? { round: draft.round + 1, pick: 1 } : { round: draft.round, pick: draft.pick + 1 }

        if (currentPick.teams.manager !== locals.user.id) {
            return fail(401, { error_message: "You are not authorized to make this pick" })
        }

        const {error} = await draft_player(currentPick, player_id, nextPick, draft)

        if (error) {
            console.log(error)
            return fail(401, { error_message: error?.message || "Something went wrong" })
        }

        return {
            message: 'success'
        }


    },
    autodraft: async ({ request, params, locals }) => {
        //runs only on refresh 
        //needs to pick a player
        const body = await request.json()
        const players = body.players 
        const draft = JSON.parse(body.draft)
        //picks TODO just have this as a field on draft probably 
        const currentPick = draft.picks.find((/** @type {{ round: any; pick: any; }} */ pick) => pick.round === draft.round && pick.pick === draft.pick);
        const nextPick = draft.pick === draft.order.length ? { round: draft.round + 1, pick: 1 } : { round: draft.round, pick: draft.pick + 1 }
        
        //select random player  from players and get id 
        //const player_id = players[Math.floor(Math.random() * players.length)].name_id
        const player_id = players[1].name_id

        const {error, pick} = await draft_player(currentPick, player_id, nextPick, draft)
        
        if (error) {
            console.log(error)
            return fail(401, { error_message: error?.message || "Something went wrong" })
        }

        return {
            message: 'success',
            pick: pick
        }


    },
    start: async ({ request, params, locals }) => {
        const formData = await request.formData();
        const draft = JSON.parse(formData.get('draft'))

        let timestamp = Date.now();
        timestamp = timestamp + (draft.roundLength * 1000 * 10);
        let pickEnd = new Date(timestamp).toISOString();

        const { data: updatedDraft, error: draftError } = await supabase
            .from('drafts')
            .update({ status: "ACTIVE", pickEnd: pickEnd })
            .eq('id', draft.id)
            .select()


        if (draftError) {
            console.log(draftError)
            return fail(401, { error_message: draftError?.message || "Something went wrong" })
        }

        return {
            message: 'success'
        }


    }
}



/**
 * @param {{ teams: { id: any; }; id: any; }} currentPick
 * @param {any} player_id
 * @param {{ round: any; pick: any; }} nextPick
 * @param {{ id: any; }} draft
 */
async function draft_player(currentPick, player_id, nextPick, draft) {
    //get new pick end 
    console.log(currentPick, player_id, nextPick)
    /*let timestamp = Date.now();
    timestamp = timestamp + (draft.roundLength * 1000 * 10);
    let pickEnd = new Date(timestamp).toISOString();
    const { data: pick , error } = await supabase
        .from('picks')
        .update([
            { team_id: currentPick.teams.id, player_id: player_id },
        ])
        .eq('id', currentPick.id)
        .select()
        .single()

    const { data: updatedDraft, error: draftError } = await supabase
        .from('drafts')
        .update({ round: nextPick.round, pick: nextPick.pick, pickEnd: pickEnd })
        .eq('id', draft.id)

    return {
        error: error || draftError,
        pick: pick 
    }*/
}



