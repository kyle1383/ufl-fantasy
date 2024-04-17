import { init_draft } from '$lib/draft.server.js';

import { fail } from '@sveltejs/kit';
export const actions = {
    init: async ({ request, params, locals: { supabase, getSession } }) => {
        return
        const session = await getSession();

        const formData = await request.formData();
        const leagueID = formData.get('league');
        const { data: league, error } = await supabase.from('leagues').select('*, teams(*)').eq('id', leagueID).single();
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


        //return error 
        if (errors.length !== 0) {
            console.log('errors', errors)

            return fail(401, { error_message: errors })
        }
        return result

    },
    randomizeOrder: async ({ request, params, locals: { supabase, getSession } }) => {
        const session = await getSession();
        const formData = await request.formData();
        const leagueID = formData.get('league');

        //confirm user is a comissioner 
        const { data: commissionerData, error: commissionerError } = await supabase
            .from('commissioners')
            .select('id')
            .eq('league_id', params.id)
            .eq('user_id', session.user.id)


        if (commissionerError || commissionerData.length === 0) {
            return fail(401, { message: 'You are not a comissioner of this league' })
        }



        const { data: league, error } = await supabase.from('leagues').select('*, teams(*)').eq('id', params.id).single();
        if (error) {
            return fail(401, { message: error.error_message })
        }

        //confirm it is predraft 
        const { data: draftStatus, error: draftStatusError } = await supabase
            .from('drafts')
            .select('status, id')
            .eq('id', league.draft_id)
            .single()

        console.log(draftStatus)

        if (draftStatusError || draftStatus.status !== 'PREDRAFT') {
            return fail(401, { message: 'Draft has already started' })
        }
        const order = randomOrder(league.order)

        const { data: picks, error: picksError } = await supabase
            .from('picks')
            .select('id, round, pick, team_id, draft_id')
            .eq('draft_id', league.draft_id)

        picks.sort((a, b) => {
            if (a.round > b.round) {
                return 1;
            } else if (a.round < b.round) {
                return -1;
            } else {
                if (a.pick > b.pick) {
                    return 1;
                } else if (a.pick < b.pick) {
                    return -1;
                } else {
                    return 0;
                }
            }
        });

        //update picks with new order 
        picks.forEach((pick, index) => {
            pick.team_id = order[index % order.length]
        })




        const { data: updateLeague, error: updateLeaugeError } = await supabase
            .from('leagues')
            .update({ order: order })
            .eq('id', params.id)
            .select()






        if (updateLeaugeError) {
            return fail(401, { message: updateLeaugeError.message })
        }

        const { data: updatePicks, error: updatePicksError } = await supabase
            .from('picks')
            .upsert(picks)
            .select('id, round, pick, team_id')



        if (updatePicksError) {
            console.log('updatePicksError', updatePicksError)
            return fail(401, { message: updatePicksError.message })
        }
        return { order: order }
    }
}

const randomOrder = (order) => {
    for (let i = order.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements array[i] and array[j]
        [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
};


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