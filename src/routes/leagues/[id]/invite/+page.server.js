// @ts-nocheck
import { fail } from '@sveltejs/kit';

import { redirect } from '@sveltejs/kit';
export async function load({ fetch, params, setHeaders, locals: { getSession, supabase }, cookies }) {
    const session = await getSession()
   
    const user = session?.user;
    if (user) {
        const { data: membersData, error: membersError } = await supabase
            .from('members')
            .select('user_id')
            .eq('user_id', user.id)
            .eq('league_id', params.id)

        
        if (membersData.length > 0) {
            throw redirect(303, '/leagues/' + params.id)
        }
    }


   

}

export const actions = {
    default: async ({  request, params, locals: { supabase, getSession } }) => {
        const formData = await request.formData();
        const name = formData.get('name');
        const session = await getSession()
        const user = session.user
        //check that there are unowned teams, update one of them
        const { data, error } = await supabase
            .from('leagues')
            .select('size, teams (id, manager)')
            .eq('id', params.id)
            .single()

        
      
        if (error || data.length === 0) {
            
            return fail(401, 'Error fetching teams')
        }
        console.log(data)
        const filledTeams = data.teams.filter(t => t.manager !== null)
        if(filledTeams >= data.size){
            return fail(401, 'League is full')
        }
        //confirm that user is not in league already 
        const { data: membersData, error: membersError } = await supabase
            .from('members')
            .select('user_id')
            .eq('user_id', user.id)
            .eq('league_id', params.id)

        if (membersError){
            console.log('2')
            return fail(401, 'error fetching league members')
        }
        if (membersData && membersData.length > 0) {
            console.log('3')
            return fail(401, 'User already in league')
        }

        const { teams } = data
        const unownedTeam = teams.find((team) => { return team.manager === null })
        if (unownedTeam) {
            // update team 
            const { data, error } = await supabase
                .from('teams')
                .update({ name: name, manager: user.id })
                .eq('id', unownedTeam.id)

                if (error){
                    console.log(error)
                    return fail(401, 'error updating team')
                }

            // Add current user as a member of the league  
            const { error: membersError } = await supabase
                .from('members')
                .insert([{ user_id: user.id, league_id: params.id }])

                if (error){
                    console.log(error)
                    return fail(401, 'error updating members ')
                }

        }

        return {
            status: 401,
        }
    }
}