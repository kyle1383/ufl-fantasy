// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import { generate_matchups } from './matchup';
import { fail } from '@sveltejs/kit'
import { init_draft } from '$lib/draft.server.js';
//TODO figure out how to use event as well as fetch
export async function load({ locals: {supabase, getSession} }) {
    const session = await getSession()
    if (!session) {
        return {user_leagues: []}
    }
    const { data, error } = await supabase
        .from('members')
        .select('leagues ( * )')
        .eq('user_id', session.user.id)
    if (error){
        console.log('error')
        return {user_leagues: []}
    }
    return {
        user_leagues: data
    };
}



export const actions = {
    default: async ({ locals: {supabase, getSession}, request, event }) => {
        const session = await getSession()
        const formData = await request.formData();
        const name = formData.get('name');
        const size = formData.get('size');
        const roster_limits = formData.get('roster_limits');
        const {user} =session
        const currentWeek = 3;

        let errors = []
        //get username
        const { data: profile, error: userError } = await supabase
            .from('profiles')
            .select(`username`)
            .eq('id', user.id)
            .single()
        userError && errors.push(userError);

        //create league
        const { data: leagueData, error: leagueError } = await supabase
            .from('leagues')
            .insert([
                { name: name, size: size, order: [], roster_limits: roster_limits },
            ]).select()
            .single()
        leagueError && errors.push(leagueError)

        // Add current user as a member and commissioner of the league  
        const { error: membersError } = await supabase
            .from('members')
            .insert([{ user_id: user.id, league_id: leagueData.id }])

        membersError && errors.push(membersError)

        const { error: commissionersError } = await supabase
            .from('commissioners')
            .insert([{ user_id: user.id, league_id: leagueData.id }])
        console.log(commissionersError)
        commissionersError && errors.push(commissionersError)

        //create teams including a team for the user
        const teams = []
        teams.push({ league_id: leagueData.id, name: "Team " + (profile?.username), manager: user.id })
        for (let i = 1; i < size; i++) {
            teams.push({ league_id: leagueData.id, name: "Team " + (i + 1) })
        }

        const { data: teamsData, error: teamsError } = await supabase
            .from('teams')
            .insert(teams).select()

        teamsError && errors.push(teamsError)

        //update league to include order 
        const order = teamsData?.map(team => team.id)

        const { data: orderData, error: orderError } = await supabase
            .from('leagues')
            .update({ order: order })
            .eq('id', leagueData.id)
        orderError && errors.push(orderError)

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
        const draft = await init_draft(user, JSON.stringify(league), false, supabase)
        //update league to include draft id
        const { data: draftData, error: draftError } = await supabase
            .from('leagues')
            .update({ draft_id: draft.draft.id })
            .eq('id', leagueData.id)

        draftError && errors.push(draftError)

        //create player instances for every player in the league 
        //TODO: perhaps do this live while draft is happening? otherwise assign positions here
        const { data: playersData, error: playersError } = await supabase
            .from('players')
            .select('name_id, xfl_teams (id)')

        playersError && errors.push(playersError)

        const playerLeagues = []
        playersData?.forEach(player => {
            playerLeagues.push({ player_id: player.name_id, league_id: leagueData.id, rostered: false, waiver: false })
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
        //throw redirect(307, '/leagues');
        return {
            message: "Created rows",
        }

    }
}