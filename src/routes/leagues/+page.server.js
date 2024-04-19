// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { generate_matchups } from './matchup';
import { fail } from '@sveltejs/kit'
import { init_draft } from '$lib/draft.server.js';
//TODO figure out how to use event as well as fetch


export const actions = {
    default: async ({ locals: { supabase, getSession }, request, event }) => {
        const session = await getSession()
        const formData = await request.formData();
        const name = formData.get('name');
        const size = formData.get('size');
        const roster_limits = formData.get('roster_limits');
        const { user } = session;
        const currentWeek = 0;

        let errors = []

        const userIdentifier = await getUsernameOrEmail(user, errors, supabase);
        const league = await createLeague(name, size, roster_limits, errors, supabase)
        await addUserAsMemberAndCommissioner(user, league, errors, supabase)
        const teams = await createTeams(league, userIdentifier, user, size, errors, supabase)
        const order = await setDraftOrder(teams, league, errors, supabase)

        await createPlayerLeagues(league, errors, supabase)

        await createDraft(league, teams, order, false, errors, supabase)

        console.log(errors)

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

    const roster_size = Object.values(JSON.parse(roster_limits)).reduce((a, b) => a + b, 0)
    const { data, error } = await supabase
        .from('leagues')
        .insert([
            { name: name, size: size, order: [], roster_limits: roster_limits, roster_size: roster_size },
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
    return order;
}

async function createPlayerLeagues(league, errors, supabase) {
    //create player instances for every player in the league 
    //TODO: perhaps do this live while draft is happening? otherwise assign positions here
    const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('id, ufl_teams (id)')

    playersError && errors.push(playersError)

    const playerLeagues = []
    playersData?.forEach(player => {
        playerLeagues.push({ player_id: player.id, league_id: league.id, rostered: false, waiver: false })
    })

    const { data: playerLeaguesData, error: playerLeaguesError } = await supabase
        .from('player_leagues')
        .insert(playerLeagues)

    playerLeaguesError && errors.push(playerLeaguesError)
}

async function createDraft(league, teams, order, isMock = false, errors, supabase) {

    // const league = JSON.parse(leagueJSON)

    const draft = {
        mock: isMock,
        order: order,
        season: 2024,
        roster_limits: league.roster_limits
    }


    const rounds = Object.values(JSON.parse(league.roster_limits)).reduce((partialSum, a) => partialSum + a, 0);


    //create the draft
    const { data: draftData, error: draftError } = await supabase
        .from('drafts')
        .insert(draft)
        .select()
        .single()

    draftError && errors.push(draftError)
   

    let picks = []

    for (let i = 1; i < rounds + 1; i++) {
        Object.values(teams).forEach((team, index) => {
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

   

    picksError && errors.push(picksError)

    //update league 
    const { error: leagueError } = await supabase
        .from('leagues')
        .update({ draft_id: draftData.id })
        .eq('id', league.id)

    leagueError && errors.push(leagueError)


}
