// @ts-nocheck


import { fail } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'


//TODO figure out how to use event as well as fetch
//TODO don't prefetch this page
export async function load({  request, params, locals: {supabase, getSession} }) {
    const session = await getSession();
    if (!session.user) {
        throw redirect(303, '/profile/')
    }

    //picks!public_picks_draft_id_fkey', 'picks!drafts_currentPick_id_fkey
    const { data: draft, error: draftError } = await supabase
        .from('drafts')
        .select('*, picks!public_picks_draft_id_fkey (*, teams (*)), leagues(*, commissioners(*))')
        .eq('id', params.id)
        .single()
    //get players from supabase
    if (draftError) {
        console.log(draftError)
        return fail(401, { error_message: "Unauthorized" })
    }

    

    const picks = draft.picks.map(pick => pick.player_id)



    
    const { data: players, error } = await supabase
        .from('players')
        .select('*, xfl_teams (*)')


    const filteredPlayers = players?.filter(player => !picks.includes(player.name_id))

    if (error) {
        console.log(error)
        return fail(401, { error_message: "Unauthorized" })
    }
    return {
        players: players,
        availablePlayers: filteredPlayers,
        draft: draft,
    }
}

export const actions = {
    /**
     * This should modify the draft table to add the player to the draft
     */
    draft: async ({ request, params, locals:{getSession, supabase} }) => {
        const session = await getSession();
        //we need player_id, user_id, round, pick, possibly team id if we allow multiple teams per user
        //get player id
        const formData = await request.formData();
        const player_id = formData.get('player_id');
        const draft = JSON.parse(formData.get('draft'));



        //TODO is there a better way? Should draft have a current pick property? 
        const currentPick = draft.picks.find((/** @type {{ round: any; pick: any; }} */ pick) => pick.round === draft.round && pick.pick === draft.pick);
        const nextPick = draft.pick === draft.order.length ? { round: draft.round + 1, pick: 1 } : { round: draft.round, pick: draft.pick + 1 }

        //TODO create player_instance here and assing position

        if (currentPick.teams.manager !== session.user.id) {
            return fail(401, { error_message: "You are not authorized to make this pick" })
        }

        const { error } = await draft_player(currentPick, player_id, nextPick, draft, supabase)

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
        const formData = await request.formData();
        const playerJSON = formData.get('player');
        const draftJSON = formData.get('draft');
        const draft = JSON.parse(draftJSON)
        const player_id = JSON.parse(playerJSON).name_id


        //picks TODO just have this as a field on draft probably 
        const currentPick = draft.picks.find((/** @type {{ round: any; pick: any; }} */ pick) => pick.round === draft.round && pick.pick === draft.pick);
        const nextPick = draft.pick === draft.order.length ? { round: draft.round + 1, pick: 1 } : { round: draft.round, pick: draft.pick + 1 }



        const { error, pick } = await draft_player(currentPick, player_id, nextPick, draft)

        if (error) {
            console.log(error)
            return fail(401, { error_message: error?.message || "Something went wrong" })
        }

        return {
            message: 'success',
            pick: pick
        }


    },
    start: async ({ request, params, locals: {getSession, supabase} }) => {
        const session = await getSession();
        if (!session.user) {
            return fail(401, "Unauthorized")
        }
        const formData = await request.formData();
        const draft = JSON.parse(formData.get('draft'))
        //is user the commish?
        if (draft.leagues[0].commissioners[0].user_id !== session.user.id) {
            return fail(401, "Must be commisionner ")
        }
        
        let timestamp = Date.now();
        timestamp = timestamp + (draft.roundLength * 1000 * 10);
        let pickEnd = new Date(timestamp).toISOString();

        const { data: updatedDraft, error: draftError } = await supabase
            .from('drafts')
            .update({ status: "ACTIVE", pickEnd: pickEnd })
            .eq('id', draft.id)
            .select()


        if (draftError) {
            console.log('draftError', draftError)
            return fail(401, { error_message: draftError?.message || "Something went wrong" })
        }
        return {
            message: 'Draft has started'
        }


    },
    pause: async ({ request, params, locals: {supabase} }) => {
        const formData = await request.formData();
        const draft = JSON.parse(formData.get('draft'))



        const { data: updatedDraft, error: draftError } = await supabase
            .from('drafts')
            .update({ status: "PAUSED" })
            .eq('id', draft.id)
            .select()


        if (draftError) {
            console.log('draftError', draftError)
            return fail(401, { error_message: draftError?.message || "Something went wrong" })
        }

        return {
            message: 'success'
        }


    },
}



/**
 * @param {{ teams: { id: any; }; id: any; }} currentPick
 * @param {any} player_id
 * @param {{ round: any; pick: any; }} nextPick
 * @param {{ id: any; }} draft
 */
async function draft_player(currentPick, player_id, nextPick, draft, supabase) {
    //get new pick end 

    let timestamp = Date.now();
    timestamp = timestamp + (draft.roundLength * 1000 * 10);
    let pickEnd = new Date(timestamp).toISOString();
    const { data: pick, error } = await supabase
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

    //is draft over?
    const rounds = Object.values(JSON.parse(draft.roster_limits)).reduce((acc, val) => acc + val, 0);
  

    if (nextPick.round > rounds) {
        endDraft(draft, supabase)
    }

    return {
        error: error || draftError,
        pick: pick
    }
}

async function endDraft(draft, supabase) {
    //TODO handle errors here 
    console.log("draft has ended")
    //update the status
    const { data: endedDraft, error: endDraftError } = await supabase
        .from('drafts')
        .update({ status: "COMPLETE" })
        .eq('id', draft.id)

    //create a player instance for each pick
    //loop through picks
    draft.picks.forEach(async (pick) => {
        const { data: playerInstance, error: playerInstanceError } = await supabase
            .from('player_leagues')
            .update({ rostered: true, team: pick.team_id, waiver: false })
            .eq('player_id', pick.player_id)
            .eq('league_id', draft.leagues[0].id)

        if (playerInstanceError) {
            console.log(playerInstanceError)
        }

    })
}



