// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { generate_matchups } from './matchup';
import { fail } from '@sveltejs/kit'
import { init_draft } from '$lib/draft.server.js';
//TODO figure out how to use event as well as fetch
export async function load({ locals: { supabase, getSession } }) {
    const session = await getSession()
    if (!session) {
        return { user_leagues: [] }
    }
    const { data: leagues, error: leaguesError } = await supabase
        .from('members')
        .select('league_id')
        .eq('user_id', session.user.id)
    
    const leagueIds = leagues.map((member) => member.league_id);
    const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .in('id', leagueIds)
    
   
    if (error) {
        console.log('error')
        return { user_leagues: [] }
    }
    return {
        user_leagues: data
    };
}


export const actions = {
    default: async ({ locals: { supabase, getSession }, request, event }) => {
        const session = await getSession()
        const formData = await request.formData();
        const name = formData.get('name');
        const size = formData.get('size');
        const roster_limits = formData.get('roster_limits');
        const { user } = session
        const currentWeek = 0;

        let errors = []

        const userIdentifier = await getUsernameOrEmail(user, errors, supabase);
        const league = await createLeague(name, size, roster_limits, errors, supabase)
        await addUserAsMemberAndCommissioner(user, league, errors, supabase)
        const teams = await createTeams(league, userIdentifier, user, size, errors, supabase)
        await setDraftOrder(teams, league, errors, supabase)

        return {
            message: "Created Leauge",
        }

    }
}

async function getUsernameOrEmail(user, errors, supabase) {
    //get username
    const { data: profile, error } = await supabase
        .from('profiles')
        .select(`username`)
        .eq('id', user.id)
        .single()

    error && errors.push(error);

    if (profile && profile.username) {
        return profile.username
    } else {
        //remove content after @
        const trimmedEmail = user.email.split('@')[0]
        return trimmedEmail
    }
}

async function createLeague(name, size, roster_limits, errors, supabase) {
    const roster_size = Object.values(roster_limits).reduce((a, b) => a + b, 0)
    const { data, error } = await supabase
        .from('leagues')
        .insert([
            { name: name, size: size, order: [], roster_limits: roster_limits, roster_size: roster_size},
        ]).select()
        .single()

    error && errors.push(error)
    return data

}

async function addUserAsMemberAndCommissioner(user, league, errors, supabase) {
    // Add current user as a member and commissioner of the league  
    const { error: membersError } = await supabase
        .from('members')
        .insert([{ user_id: user.id, league_id: league.id }])

    membersError && errors.push(membersError)

    const { error: commissionersError } = await supabase
        .from('commissioners')
        .insert([{ user_id: user.id, league_id: league.id }])
    console.log(commissionersError)
    commissionersError && errors.push(commissionersError)

}

async function createTeams(league, userIdentifier, user, size, errors, supabase) {
    const teams = []
    teams.push({ league_id: league.id, name: "Team " + userIdentifier, manager: user.id })

    for (let i = 1; i < size; i++) {
        teams.push({ league_id: league.id, name: "Team " + (i + 1) })
    }

    const { data, error } = await supabase
        .from('teams')
        .insert(teams).select()

    error && errors.push(error)

    return data
}

async function setDraftOrder(teams, league, errors, supabase) {
    const order = teams?.map(team => team.id)

    const { error } = await supabase
        .from('leagues')
        .update({ order: order })
        .eq('id', league.id)

    error && errors.push(error)
}