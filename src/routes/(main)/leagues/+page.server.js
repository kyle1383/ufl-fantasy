import { supabase } from '$lib/supabaseClient'
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';
import { generate_matchups } from './matchup';
import { fail } from '@sveltejs/kit'
//TODO figure out how to use event as well as fetch
export async function load({ locals }) {
    if (!locals.user) {
        throw redirect(303, '/profile?url=/leagues/')
    }

    const { data, error } = await supabase
        .from('members')
        .select('leagues ( * )')
        .eq('user_id', locals.user.id)

    return {
        user_leagues: data
    };
}

export const actions = {
    default: async ({ locals, request, event }) => {
        const formData = await request.formData();
        const name = formData.get('name');
        const size = formData.get('size');
        const user = locals.user
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
                { name: name, size: size, order: [] },
            ]).select()
            .single()
        leagueError && errors.push(leagueError)

        // Add current user as a member and commissioner of the league  
        const { error: membersError } = await supabase
            .from('members')
            .insert([{ user_id: locals.user.id, league_id: leagueData.id }])

        membersError && errors.push(membersError)

        const { error: commisionersError } = await supabase
            .from('commisioners')
            .insert([{ user_id: locals.user.id, league_id: leagueData.id }])

        commisionersError && errors.push(commisionersError)
       
        //create teams including a team for the user
        const teams = []
        teams.push({ league_id: leagueData.id, name: "Team " + (profile?.username), manager: locals.user.id })
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
        const matchups = await generate_matchups(leagueData.id, currentWeek)
        
        const { data: matchupsData, error: matchupsError } = await supabase
            .from('matchups')
            .insert(matchups)

        matchupsError && errors.push(matchupsError)

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