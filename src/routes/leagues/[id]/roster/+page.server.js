// @ts-nocheck

import { fail } from "@sveltejs/kit";

export const actions = {
    updateRosterPosition: async ({ request, params, locals: { supabase, getSession } }) => {
        const formData = await request.formData();
        const playerJSON = formData.get('player');
        const swapOutPlayerJSON = formData.get('swapOutPlayer');
        const position = formData.get('position');
        const depth = formData.get('depth');
        const player = JSON.parse(playerJSON);
        const swapOutPlayer = JSON.parse(swapOutPlayerJSON);
        let players = []
        let errors = []


        if (!player || !position || !depth) {
            return fail(401, { error_message: 'Missing player, position, or depth' })
        }

        const { data: weekData, error: weekError } = await supabase
            .from('seasons')
            .select('week')
            .eq('year', 2024)
            .single()
        const week = weekData?.week
        let rosterLock = null;
        if (params.roster_id) {
            const { data: rosterLockData, error: rosterLockError } = await supabase
                .from('roster_lock')
                .select('*')
                .eq('player_id', playerLeaguesData.id)
                .eq('week', week)
                .eq('team_id', params.roster_id)


            if (rosterLockError) {
                console.log(rosterLockError)
                return fail(401, { error_message: 'error getting roster lock', errors: rosterLockError })
            }

            rosterLock = rosterLockData;
        } else {

            const session = await getSession();
            const user = session.user;
            const { data: league, error: leagueError } = await supabase
                .from('leagues')
                .select('id, teams(id, manager)')
                .eq('id', params.id)
                .single()


            const team_id = league.teams.filter(team => team.manager == user.id)[0].id;




            const { data: rosterLockData, error: rosterLockError } = await supabase
                .from('roster_lock')
                .select('*')
                .or(`player_id.eq.${player.id}`, `player_id.eq.${swapOutPlayer.id}`)
                .eq('week', week)
                .eq('team_id', team_id)


            if (rosterLockError) {
                console.log(rosterLockError)
                return fail(401, { error_message: 'error getting roster lock', errors: rosterLockError })
            }

            rosterLock = rosterLockData;
        }

        if (rosterLock && rosterLock.length > 0) {
            console.log(rosterLock, typeof rosterLock)
            return fail(401, { error_message: 'player is locked in this slot' })
        }
        
        if (typeof swapOutPlayer === 'object') {

            const { data: updatedSwapOutPlayer, error: updatedSwapOutPlayerError } = await supabase
                .from('player_leagues')
                .update({ team_position: player.team_position, depth: player.depth })
                .eq('id', swapOutPlayer.id)
                .select()
                .single();

            players.push(updatedSwapOutPlayer)
            updatedSwapOutPlayerError !== null && errors.push(updatedSwapOutPlayerError)
        }


        const { data: updatedPlayer, error: updatedPlayerError } = await supabase
            .from('player_leagues')
            .update({ team_position: position, depth: depth })
            .eq('id', player.id)
            .select()
            .single();
        players.push(updatedPlayer)
        updatedPlayerError !== null && errors.push(updatedPlayerError)

        if (errors.length > 0) {
            return fail(401, { error_message: 'error updating player', errors: errors })
        }


        //Return the updated players
        return {
            message: 'success',
            players: players
        }

    },
    drop: async ({ request, params, locals: { supabase, getSession } }) => {
        const formData = await request.formData();
        const player_id = formData.get('player_id');

        const { data: weekData, error: weekError } = await supabase
            .from('seasons')
            .select('week')
            .eq('year', 2024)
            .single()
        const week = weekData?.week

        let rosterLock = null;

        const { data: playerLeaguesData, error: playerLeaguesError } = await supabase
            .from('player_leagues')
            .select('id')
            .eq('player_id', player_id)
            .eq('league_id', params.id)
            .select()
            .single();

        if (playerLeaguesError) {
            console.log(playerLeaguesError)
            return fail(401, { error_message: 'error getting player leagues', errors: playerLeaguesError })
        }
        if (params.roster_id) {
            const { data: rosterLockData, error: rosterLockError } = await supabase
                .from('roster_lock')
                .select('*')
                .eq('player_id', playerLeaguesData.id)
                .eq('week', week)
                .eq('team_id', params.roster_id)


            if (rosterLockError) {
                console.log(rosterLockError)
                return fail(401, { error_message: 'error getting roster lock', errors: rosterLockError })
            }

            rosterLock = rosterLockData;
        } else {

            const session = await getSession();
            const user = session.user;
            const { data: league, error: leagueError } = await supabase
                .from('leagues')
                .select('id, teams(id, manager)')
                .eq('id', params.id)
                .single()


            const team_id = league.teams.filter(team => team.manager == user.id)[0].id;




            const { data: rosterLockData, error: rosterLockError } = await supabase
                .from('roster_lock')
                .select('*')
                .eq('player_id', playerLeaguesData.id)
                .eq('week', week)
                .eq('team_id', team_id)


            if (rosterLockError) {
                console.log(rosterLockError)
                return fail(401, { error_message: 'error getting roster lock', errors: rosterLockError })
            }

            rosterLock = rosterLockData;
        }
        if (rosterLock && rosterLock.length > 0) {
            console.log(rosterLock, typeof rosterLock)
            return fail(401, { error_message: 'player is locked in this slot' })
        }

        const { data: deletedPlayer, error: deletedPlayerError } = await supabase
            .from('player_leagues')
            .update({ rostered: false, team: null, waiver: true, team_position: null, depth: null })
            //.update({ rostered: true})
            .eq('player_id', player_id)
            .eq('league_id', params.id)
            .select();

        if (deletedPlayerError) {
            return fail(401, { error_message: 'error deleting player', errors: deletedPlayerError })
        }

        return {
            message: 'success',
            player: deletedPlayer
        }

    }
}
