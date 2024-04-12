// @ts-nocheck

import { fail, redirect } from "@sveltejs/kit";
export async function load({ locals: {supabase, getSession}, params, parent }) {
    const { league } = await parent();
    const session = await getSession();
    const user = session.user;
    
    const roster_id = params.roster_id ? params.roster_id : league.teams.filter(team => team.manager == user.id)[0].id;

    //get teams from league_id and user_id
    const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('*, player_leagues ( *, players (*, ufl_teams(*))), profiles(*)')
        .eq('id', roster_id)
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

