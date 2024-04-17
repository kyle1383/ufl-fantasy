import type { Matchup } from '$lib/types.js'
import type { SupabaseClient } from '@supabase/supabase-js'
import { fail } from '@sveltejs/kit'
import { error } from '@sveltejs/kit'
export async function load({ params, locals: { supabase, getSession } }) {
    const {user} = await getSession()
    /* const { data: weekData, error: weekError } = await supabase.from('seasons').select('week').eq('id', 1).single()
     if (weekError || !weekData) {
         error(401, { message: 'error fetching week' })
 
     }
     const { week } = weekData*/

    const week = params.week
    console.log(week)
    const { data: leagueMatchups, error: matchupsError } = await supabase
        .from('matchups')
        .select('*, team_id_1(*,  profiles(username, full_name),  player_leagues( depth, team_position, players(id, name, position, img_url, ufl_teams(*)))), team_id_2(*,  profiles(username, full_name), player_leagues(depth, team_position, players(id, name, position, img_url, ufl_teams(*))))')
        .eq('league_id', params.id)
        .eq('week', week)

    if (matchupsError) {
        console.log(matchupsError)
        error(401, { message: 'error fetching matchups' })
    }



    
    //rename team_id_1 to team_1
    const formattedMatchups = leagueMatchups.map(matchup => {
        const { team_id_1, team_id_2, ...rest } = matchup
        return {
            team_1: team_id_1,
            team_2: team_id_2,
            ...rest
        }
    })




    
    for (let i = 0; i < formattedMatchups.length; i++) {
        const matchup = await getStatsForMatchup(formattedMatchups[i], week, supabase)
        formattedMatchups[i] = matchup
    }



    return {
        matchups: formattedMatchups
    }
}

async function getStatsForMatchup(matchup: Matchup, week, supabase: SupabaseClient) {
    const playerIds = [...matchup.team_1.player_leagues.map(player => player.players.id), ...matchup.team_2.player_leagues.map(player => player.players.id)]

    const { data: stats, error: statsError } = await supabase
        .from('ufl_games')
        .select('week, g_passing(player_id, yards, touchdowns, interceptions), g_rushing(player_id, yards, touchdowns), g_receiving(player_id, yards, touchdowns), g_kicking(player_id, missed, made_19, made_29, made_39, made_49, made_50), g_fumbles(player_id, fumbles)')
        .eq('week', week)
        .in('g_passing.player_id', playerIds)
        .in('g_rushing.player_id', playerIds)
        .in('g_receiving.player_id', playerIds)
        .in('g_kicking.player_id', playerIds)
        .in('g_fumbles.player_id', playerIds)


    const aggregateStats = stats.reduce((acc, game) => {
        // Process passing stats
        game.g_passing.forEach(passing => {
            const player = acc.find(p => p.player_id === passing.player_id) || { player_id: passing.player_id, passing: {}, rushing: {} };
            player.passing = { ...passing };
            if (!acc.find(p => p.player_id === passing.player_id)) {
                acc.push(player);
            }
        });

        // Process rushing stats
        game.g_rushing.forEach(rushing => {
            const player = acc.find(p => p.player_id === rushing.player_id) || { player_id: rushing.player_id, passing: {}, rushing: {} };
            player.rushing = { ...rushing };
            if (!acc.find(p => p.player_id === rushing.player_id)) {
                acc.push(player);
            }
        });

        // Process receiving stats
        game.g_receiving.forEach(receiving => {
            const player = acc.find(p => p.player_id === receiving.player_id) || { player_id: receiving.player_id, passing: {}, rushing: {} };
            player.receiving = { ...receiving };
            if (!acc.find(p => p.player_id === receiving.player_id)) {
                acc.push(player);
            }
        });

        // Process kicking stats
        game.g_kicking.forEach(kicking => {
            const player = acc.find(p => p.player_id === kicking.player_id) || { player_id: kicking.player_id, passing: {}, rushing: {} };
            player.kicking = { ...kicking };
            if (!acc.find(p => p.player_id === kicking.player_id)) {
                acc.push(player);
            }
        });

        // Process fumbles stats
        game.g_fumbles.forEach(fumbles => {
            const player = acc.find(p => p.player_id === fumbles.player_id) || { player_id: fumbles.player_id, passing: {}, rushing: {} };
            player.fumbles = { ...fumbles };
            if (!acc.find(p => p.player_id === fumbles.player_id)) {
                acc.push(player);
            }
        });

        return acc;
    }, []);


    const team1Stats: any = matchup.team_1.player_leagues.map(player => {

        const playerStats = aggregateStats.find(stat => stat.player_id === player.players.id)
        return {
            ...player,
            stats: playerStats
        }
    })



    const team2Stats: any = matchup.team_2.player_leagues.map(player => {
        const playerStats = aggregateStats.find(stat => stat.player_id === player.players.id)
        return {
            ...player,
            stats: playerStats
        }
    })


    matchup.team_1.player_leagues = team1Stats
    matchup.team_2.player_leagues = team2Stats
    return matchup;
}