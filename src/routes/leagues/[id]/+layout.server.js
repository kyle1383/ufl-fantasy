import { redirect } from '@sveltejs/kit';

export async function load({ fetch, params, setHeaders, locals: { supabase, getSession } }) {
    const session = await getSession();
    const user = session.user;
    if (!user) {
        return {
            league: null,
            team: null,
        };
        return redirect(303, '/sign-in')
    }
    const { data, error } = await supabase
        .from('leagues')
        .select('*, teams ( * ), player_leagues ( *, players (*, xfl_teams(*)) )')
        .eq('id', params.id)
        .single();

    if (error) {
       return error(500, error.message)
    }

    if (data) {
        let { teams } = data
        teams = await Promise.all(teams.map(async (team) => {
            if (team.manager) {
                const { data, error, status } = await supabase
                    .from('profiles')
                    .select(`username, full_name`)
                    .eq('id', team.manager)
                    .single();
                team.manager_name = data.username || data.full_name

            } else {
                team.manager_name = "none"
            }
            return team
        }));

        const roster_id = params.roster_id ? params.roster_id : data.teams.filter(team => team.manager == user.id)[0]?.id;

        //get teams from league_id and user_id
        const { data: team, error: teamError } = await supabase
            .from('teams')
            .select('*, player_leagues ( *, players (*, xfl_teams(*))), profiles(*)')
            .eq('id', roster_id)
            .single()

        return {
            league: data,
            team: team,
        };
    } else {
        return {
            league: null
        }
    }
}