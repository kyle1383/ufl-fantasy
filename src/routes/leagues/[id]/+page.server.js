import { init_draft } from '$lib/draft.server.js';

import { fail } from 'assert';
export const actions = {
    init: async ({ request, params, locals: { supabase, getSession } }) => {
        const session = await getSession();
   
        const formData = await request.formData();
        const leagueID = formData.get('league');
        const {data: league, error} = await supabase.from('leagues').select('*, teams(*)').eq('id', leagueID).single();
        if (league.draft_id) {
            return {
                status: 200,
                body: { error_message: 'Draft already exists for this league' }
            
            }
        }
       
        
        if (!league) {
            throw error('League not found');
        }
        const result = await init_draft(session.user, league, false, supabase)
        const errors = []
        //update league to include draft id
        const { data: draftData, error: draftError } = await supabase
            .from('leagues')
            .update({ draft_id: result.draft.id })
            .eq('id', league.id)

        draftError && errors.push(draftError)

        //create player instances for every player in the league 
        //TODO: perhaps do this live while draft is happening? otherwise assign positions here
       const { data: playersData, error: playersError } = await supabase
            .from('players')
            .select('name_id, xfl_teams (id)')

        playersError && errors.push(playersError)

        const playerLeagues = []
        playersData?.forEach(player => {
            playerLeagues.push({ player_id: player.name_id, league_id: league.id, rostered: false, waiver: false })
        })

        const { data: playerLeaguesData, error: playerLeaguesError } = await supabase
            .from('player_leagues')
            // @ts-ignore
            .insert(playerLeagues)

        playerLeaguesError && errors.push(playerLeaguesError)
        //return error 
        if (errors.length !== 0) {
            console.log('errors', errors)

            return fail(401, { error_message: errors })
        }
        return result

    }
}

//TODO move to after completion of draft
/*
//generate matchups 
const matchups = await generate_matchups(leagueData.id, currentWeek, supabase)

const { data: matchupsData, error: matchupsError } = await supabase
    .from('matchups')
    .insert(matchups)

matchupsError && errors.push(matchupsError)
 
//create a draft for the league
const league = {
    id: leagueData.id,
    order: order,
    roster_limits: roster_limits,
    teams: teamsData,
}
*/