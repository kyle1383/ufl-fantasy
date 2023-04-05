// @ts-nocheck
//only use on the server
import { fail } from "@sveltejs/kit"
import { supabase } from '../../../lib/supabaseClient'
/**
 * Initialize a draft.
 * Mock: Defaults to true 
 * Active: Defaults to false - set to true when the draft is started
 * Order: Pull from the league object
 */
export async function init_draft(user, leagueJSON, isMock = true) {

    const league = JSON.parse(leagueJSON)

    const draft = {
        mock: isMock,
        order: league.order,
        season: 2023,
        roster_limits: league.roster_limits
    }


    const rounds = Object.values(JSON.parse(league.roster_limits)).reduce((partialSum, a) => partialSum + a, 0);


    //create the draft
    const { data: draftData, error: draftError } = await supabase
        .from('drafts')
        .insert(draft)
        .select()
        .single()

    if (draftError) {
        console.log(draftError )
        return fail(401, "Something went wrong")
    }

    let picks = []
    for (let i = 1; i < rounds + 1; i++) {
        Object.values(league.teams).forEach((team, index) => {
            picks.push({
                draft_id: draftData.id,
                round: i,
                pick: index + 1,
                team_id: team.id
            })
        });

    }

    //add the picks 
    const { data: picksData, error: picksError } = await supabase
        .from('picks')
        .insert(picks)
        .select()

    if (picksError) {
        console.log(picksError)
        return fail(401, "Something went wrong")
    }


    return {
        draft: draftData
    }

}


