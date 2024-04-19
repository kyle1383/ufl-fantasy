// @ts-nocheck


import { fail } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import { generate_matchups } from '../../leagues/matchup.js';


//TODO figure out how to use event as well as fetch
//TODO don't prefetch this page
export async function load({ request, params, locals: { supabase, getSession } }) {
    const session = await getSession();
    if (!session || !session?.user) {
        throw redirect(303, '/sign-in/')
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
        .select('*, ufl_teams (*), g_passing(attempts, completions, interceptions, touchdowns, yards), g_receiving(yards, touchdowns, targets, receptions), g_rushing(attempts, yards, touchdowns), g_kicking(attempts, made, made_19, made_29, made_39, made_49, made_50)')


    const filteredPlayers = players?.filter(player => !picks.includes(player.id))

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
    draft: async ({ request, params, locals: { getSession, supabase } }) => {
        const session = await getSession();
        //we need player_id, user_id, round, pick, possibly team id if we allow multiple teams per user
        //get player id
        const formData = await request.formData();
        const player_id = formData.get('player_id');
        const draft = JSON.parse(formData.get('draft'));

        //confirm draft status is active 
        if (draft.status !== "ACTIVE") {
            return fail(401, { error_message: "Draft is not active" })
        }
        //check if player has been drafted 
        //TODO how can we get draft id internally? 
        const { data: playerPicks, error: playerError } = await supabase
            .from('picks')
            .select('player_id')
            .eq('player_id', player_id)
            .eq('draft_id', draft.id)

        if (playerPicks.length > 0 || playerError) {
            return fail(401, { error_message: "Player has already been drafted" })
        }



        //TODO is there a better way? Should draft have a current pick property? 
        const currentPick = draft.picks.find((/** @type {{ round: any; pick: any; }} */ pick) => pick.round === draft.round && pick.pick === draft.pick);
        const nextPick = draft.pick === draft.order.length ? { round: draft.round + 1, pick: 1 } : { round: draft.round, pick: draft.pick + 1 }



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
    autodraft: async ({ request, params, locals: { supabase, getSession } }) => {
        const session = await getSession();

        const formData = await request.formData();
        const draft = JSON.parse(formData.get('draft'));
        const pick = JSON.parse(formData.get('pick'));


        //confirm user is commish 
        const userIsCommish = draft.leagues[0].commissioners.find(c => c.user_id === session.user.id)
        if (!userIsCommish) {
            return fail(401, "Must be commisionner ")
        }

        //pick is current pick? 
        const isCurrentPick = draft.round === pick.round && draft.pick === pick.pick
        if (!isCurrentPick) {
            return fail(401, "Not current pick")
        }

        const { error } = await autodraft(draft, params, supabase)
        if (error){
            return fail(401, { error_message: error?.message || "Something went wrong" })
        }


    },
    start: async ({ params, locals: { getSession, supabase } }) => {

        const session = await getSession();
        if (!session.user) {
            return fail(401, "Unauthorized")
        }


        const { data: draft, error: draftError } = await supabase
            .from('drafts')
            .select('id, leagues(commissioners(user_id)), roundLength')
            .eq('id', params.id)
            .single();


        const isCommish = draft.leagues[0].commissioners.some(c => c.user_id === session.user.id)


        if (!isCommish) {
            return fail(401, "Must be commisionner ")
        }

        let timestamp = Date.now();
        timestamp = timestamp + (draft.roundLength * 1000 * 10);
        let pickEnd = new Date(timestamp).toISOString();


        const { data: updatedDraft, error: updateDraftError } = await supabase
            .from('drafts')
            .update({ status: "ACTIVE", pickEnd: pickEnd })
            .eq('id', params.id)
            .select()


        if (updateDraftError) {
            console.log('draftError', draftError)
            return fail(401, { error_message: draftError?.message || "Something went wrong" })
        }
        return {
            message: 'Draft has started'
        }


    },
    pause: async ({ request, params, locals: { supabase } }) => {
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
    endDraft: async ({ params, request, locals: { supabase } }) => {

        //we need player_id, user_id, round, pick, possibly team id if we allow multiple teams per user
        //get player id
        const { data: draft, error: draftError } = await supabase
            .from('drafts')
            .select('*, leagues(id, teams ( id ))')
            .eq('id', params.id)
            .single()
       
       await endDraft(draft, supabase)
    }
}



/**
 * @param {{ teams: { id: any; }; id: any; }} currentPick
 * @param {any} player_id
 * @param {{ round: any; pick: any; }} nextPick
 * @param {{ id: any; }} draft
 */
async function draft_player(currentPick, player_id, nextPick, draft, supabase) {
    //get new pick end 
    //confirm that pick is empty 
    const {data: currentPickDB, error: currentPickError} = await supabase
        .from('picks')
        .select('player_id')
        .eq('id', currentPick.id)
        .single()

    if (currentPickDB.player_id || currentPick.player_id || currentPickError) {
        return { error: "Pick is not empty" }
    }

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
        .select('*, picks!public_picks_draft_id_fkey (*, teams (*)), leagues(*, commissioners(*))')
        .single();

    //is draft over?
    const rounds = Object.values(JSON.parse(draft.roster_limits)).reduce((acc, val) => acc + val, 0);

    //autodraft if next pick is set to autodraft or has no team 
    let autodraftError = null;
    if (nextPick.round > rounds) {
        endDraft(draft, supabase)
    } else {
        // autodraftError =await autodraft(updatedDraft, supabase)
    }

    return {
        error: error || draftError || autodraftError,
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

    if (endDraftError) {
        console.log(endDraftError)
        return fail(401, { error_message: endDraftError?.message || "Something went wrong" })
    }
    //set priorities for the teams 
    let teams = [];
    for (let i = 0; i < draft.leagues[0].size; i++) {

        teams.push({ id: draft.picks[i].team_id, priority: draft.leagues[0].size - i, league_id: draft.leagues[0].id });
    }


    const { data: updatedTeams, error: teamError } = await supabase
        .from('teams')
        .upsert(teams)

    if (teamError) {
        console.log(teamError)
        return fail(401, { error_message: teamError?.message || "Something went wrong" })
    }

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

    //generate mathcups 
    const { data: league, error } = await supabase
        .from('leagues')
        .select('id, teams ( id )')
        .eq('id', draft.leagues[0].id)
        .single()

    const { data: weekData, error: weekError } = await supabase
        .from('seasons')
        .select('week')
        .eq('year', 2024)
        .single()
    const {week} = weekData

    const matchups = await generate_matchups(league, week || 3, supabase)

    const { data: matchupsData, error: matchupsError } = await supabase
        .from('matchups')
        .insert(matchups)
    
    if (matchupsError) {
        console.log(matchupsError)
        return fail(401, { error_message: matchupsError?.message || "Something went wrong" })
    }


}

async function autodraft(draft, params, supabase) {
    //check that user is commissioner
    //TODO get draft from server 

    //get random player_id
    const { data: pickedPlayers, error: pickedPlayersError } = await supabase
        .from('picks')
        .select('player_id')
        .eq('draft_id', params.id)
        .neq('player_id', null)

    if (pickedPlayersError) {

        return { error: pickedPlayersError }
    }


    const { data: players, error: playersError } = await supabase
        .from('player_leagues')
        .select('player_id')
        .eq('league_id', draft.leagues[0].id)
        .limit(pickedPlayers.length + 1)


    if (playersError) {
        return { error: playersError }
    }
    const pickedPlayersArray = pickedPlayers.map(player => player.player_id)
    const nextAvailablePlayer = players.find(player => !pickedPlayersArray.includes(player.player_id))

    const { error } = await make_selection(draft, nextAvailablePlayer.player_id, supabase)

    return { error: error }



}

async function make_selection(draft, player_id, supabase) {


    //confirm draft status is active 
    if (draft.status !== "ACTIVE") {

        return { error: "Draft is not active" }
    }



    //check if player has been drafted 
    //TODO how can we get draft id internally? 
    const { data: playerPicks, error: playerError } = await supabase
        .from('picks')
        .select('player_id')
        .eq('player_id', player_id)
        .eq('draft_id', draft.id)



    if (playerPicks.length > 0 || playerError) {
        return { error: "Player has already been drafted" }
    }



    //TODO is there a better way? Should draft have a current pick property? 
    const currentPick = draft.picks.find((/** @type {{ round: any; pick: any; }} */ pick) => pick.round === draft.round && pick.pick === draft.pick);
    const nextPick = draft.pick === draft.order.length ? { round: draft.round + 1, pick: 1 } : { round: draft.round, pick: draft.pick + 1 }

    const { error } = await draft_player(currentPick, player_id, nextPick, draft, supabase)

    return { error }
}



