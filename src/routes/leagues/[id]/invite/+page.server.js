// @ts-nocheck


import { redirect } from '@sveltejs/kit';
export async function load({ fetch, params, setHeaders, locals: { getSession, supabase}}) {
    const session = await getSession()
    if (!session) {
        throw redirect(303, '/profile?url=/leagues/' + params.id + '/invite')
    }
    const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .eq('id', params.id)

    return {
        league: data
    };
}

export const actions = {
    default: async ({ request, params, locals: {supabase, getSession} }) => {
        const formData = await request.formData();
        const name = formData.get('name');
        const session = await getSession()
        const user = session.user

        //check that there are unowned teams, update one of them
        const { data, error } = await supabase
            .from('leagues')
            .select('teams (id, manager)')
            .eq('id', params.id)

        const { teams } = data[0]
        const unownedTeam = teams.find((team) => { return team.manager === null })
        if (unownedTeam) {
            // update team 
            const { data, error } = await supabase
                .from('teams')
                .update({ name: name, manager: user.id })
                .eq('id', unownedTeam.id)

            // Add current user as a member of the league  
            const { error: membersError } = await supabase
                .from('members')
                .insert([{ user_id: user.id, league_id: params.id}])

        }

        return {
            status: 401,
        }
    }
}