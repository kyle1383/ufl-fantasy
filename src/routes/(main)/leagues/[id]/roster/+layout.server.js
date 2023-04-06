import { supabase } from '$lib/supabaseClient';
export async function load({ locals, params, parent}) {
    const { league } = await parent();
    
   
  
    if (!locals.user) {
        throw redirect(303, '/profile?url=/leagues/')
    }

  
    const roster_id = params.roster_id ? params.roster_id : league[0].teams.filter(team => team.manager == locals.user.id)[0].id;
    //get teams from league_id and user_id


    const { data: team, error } = await supabase
        .from('teams')
        .select('*, player_instances ( *, players (*, xfl_teams(*))), positions(*)')
        .eq('id', roster_id)
        .single()
    
    return {
        team: team
    };
}

