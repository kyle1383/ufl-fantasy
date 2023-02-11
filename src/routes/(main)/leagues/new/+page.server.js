// @ts-nocheck
import { fail } from '@sveltejs/kit'
import { supabase } from '$lib/supabaseClient'
import { redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ locals, request, event }) => {
        const formData = await request.formData();
        const name = formData.get('name');
        const size = formData.get('size');
        const roster_limits = formData.get('roster_limits');
        const user = locals.user
        //get username
        const { data: profile, error: userError } = await supabase
            .from('profiles')
            .select(`username`)
            .eq('id', user.id)
            .single()

        //create league
        const { data, error: leagueError } = await supabase
            .from('leagues')
            .insert([
                { name: name, size: size, roster_limits: roster_limits },
            ]).select()

      
        // Add current user as a member of the league  
        const { error: membersError } = await supabase
            .from('members')
            .insert([{ user_id: locals.user.id, league_id: data[0].id }])

        const { error: commisionersError } = await supabase
            .from('commisioners')
            .insert([{ user_id: locals.user.id, league_id: data[0].id }])

        //create teams including a team for the user
        const teams = []
        teams.push({ league_id: data[0].id, name: "Team " + (profile.username), manager: locals.user.id })
        for (let i = 1; i < size; i++) {
            teams.push({ league_id: data[0].id, name: "Team " + (i + 1) })
        }

        const { data: teamsData, error: teamsError } = await supabase
            .from('teams')
            .insert(teams).select()

        //return error 
        if (leagueError || teamsError) {
            leagueError ? console.log(leagueError) : console.log(teamsError)
            return fail(401, { error_message: "Unauthorized" })
        }
        //throw redirect(307, '/leagues');
        return {
            message: "Created rows",
        }
    }
}
export async function load({ locals, params }) {
    if (!locals.user) {
        return fail(401, { error_message: "Unauthorized" })
    }
    return {
        user: locals.user
    }
}