// @ts-nocheck

import { fail, redirect } from "@sveltejs/kit";
export async function load({ locals: {supabase, getSession}, params, parent }) {
    const { league } = await parent();
    const session = await getSession();
    const user = session.user;
    
    const roster_id = params.team_id ? params.team_id : league.teams.filter(team => team.manager == user.id)[0].id;
    
    //get teams from league_id and user_id
    const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('*, roster_lock(*), player_leagues!public_player_leagues_team_fkey ( *, players (*, ufl_teams(*), g_passing(attempts, completions, interceptions, touchdowns, yards, ufl_games(week)), g_receiving(yards, touchdowns, targets, receptions, ufl_games(week)), g_rushing(attempts, yards, touchdowns, ufl_games(week)), g_kicking(attempts, made, made_19, made_29, made_39, made_49, made_50, ufl_games(week)))), profiles(*)')
        .eq('id', roster_id)
        .eq('roster_lock.week', league.seasons.week)
        .single()

  
    
    //make sure every player has a position
    let mustUpdate = false;
    let players = team.player_leagues.map(player => {
        if (!player.team_position) {
            mustUpdate = true;
            player.team_position = 'BENCH';
        }
        return player;
    });


    let player_leagues_new;
    let playerLeaguesError;
    if (mustUpdate) {
        let playerData = players.map(player => ({ 'id': player.id, 'team_position': player.team_position, 'player_id': player.player_id, 'league_id': player.league_id }));
        const { data: player_leagues_res, error: playerLeaguesErrorRes } = await supabase
            .from('player_leagues')
            .upsert(playerData, { onConflict: 'id' })
            .select('*, players (*, ufl_teams(*)))');

        player_leagues_new = player_leagues_res;
        playerLeaguesError = playerLeaguesErrorRes;
    }

    team.player_leagues = player_leagues_new ? player_leagues_new : players;
    if (teamError || playerLeaguesError) {
        console.log(teamError || playerLeaguesError);
        return fail(401, teamError || playerLeaguesError);
    }
    return {
        team: team,
    };
}

