import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import schedule from '$lib/schedule.json'

import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { fail } from '@sveltejs/kit';

export async function uploadSchedule() {
    const weeks = schedule.weeks;
    let games: any = []
    console.log(weeks[0].games[2])
    weeks.forEach(week => {
        const weeklyGames = week.games
        const formattedGames = weeklyGames.map(game => {
            return {
                week: week.title,
                id: game.id,
                status: game.status,
                scheduled: game.scheduled,
                home: game.home.id,
                away: game.away.id,
                home_points: game.scoring ? game.scoring.home_points : null,
                away_points: game.scoring ? game.scoring.away_points : null,

            }
        })

        games.push(...formattedGames)
    })
    const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const { data, error } = await supabase
        .from('ufl_games')
        .insert(games)
    console.log(error)
}

export async function updateWeeklyGameStatistics(week: number) {
    const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const { data, error } = await supabase
        .from('ufl_games')
        .select('id, scheduled')
        .eq('week', week)

   
    if (error) {
        return fail(401, { message: 'Failed to fetch games' })
    }
    const activeGames = filterRecentGames(data || [])
    
    const options = { method: 'GET', headers: { accept: 'application/json' } };
    if (!activeGames) return;
    const {data: players, error: playerError} = await supabase.from('players').select('id')
    if (playerError) return fail(401, { message: 'Failed to fetch players' })
       
    activeGames.forEach(async (game: {id: number, scheduled: any}) => {
        const response = await fetch(`https://api.sportradar.com/ufl/trial/v7/en/games/${game.id}/statistics.json?api_key=gS6VBTtL7i4Nhu3Djxf5V6wKWkjB8MfY7fGL33VC`, options)
        const responseJSON = await response.json()
        console.log(game)
        addGameStatisticsSupabase(responseJSON, players, supabase)
    })

}
function filterRecentGames(games: {id: any, scheduled: any}[]) {
    // Get the current time in UTC
    const now = new Date();

    // Filter games based on the scheduled time
    return games.filter(game => {
        // Ensure the scheduled property exists and is in the correct format
        if (!game.scheduled || typeof game.scheduled !== 'string') return false;

        // Parse the scheduled time assuming it is in UTC
        const scheduledTime = new Date(game.scheduled);

        // Calculate the difference in milliseconds between the current time and the scheduled time
        const diff = now - scheduledTime;

        // Convert the difference to hours
        const hoursDiff = diff / (1000 * 60 * 60);

        // Include games scheduled within the last 3 hours
        return hoursDiff >= 0 && hoursDiff <= 3;
    });
}

async function addGameStatisticsSupabase(gameStatistics: any, players, supabase: SupabaseClient) {
    
    const offPosition = ['QB', 'RB', 'WR', 'TE', 'K']
    const playerRushingStats = [...gameStatistics.statistics.away.rushing.players, ...gameStatistics.statistics.home.rushing.players].filter(s => offPosition.includes(s.position))
    const playerPassingStats = [...gameStatistics.statistics.away.passing.players, ...gameStatistics.statistics.home.passing.players].filter(s => offPosition.includes(s.position))
    const playerReceivingStats = [...gameStatistics.statistics.away.receiving.players, ...gameStatistics.statistics.home.receiving.players].filter(s => offPosition.includes(s.position))
    const playerKickingStats = [...gameStatistics.statistics.away.field_goals.players, ...gameStatistics.statistics.home.field_goals.players].filter(s => offPosition.includes(s.position))
    const playerFumbleStats = [...gameStatistics.statistics.away.fumbles.players, ...gameStatistics.statistics.home.fumbles.players].filter(s => offPosition.includes(s.position))
    //rename id to player_id 
    
    const formattedPassingStats = playerPassingStats.map(player => {
        
        return {
            player_id: player.id,
            game_id: gameStatistics.id,
            air_yards: player.air_yards,
            attempts: player.attempts,
            avg_yards: player.avg_yards,
            cmp_pct: player.cmp_pct,
            completions: player.completions,
            first_downs: player.first_downs,
            interceptions: player.interceptions,
            int_touchdowns: player.int_touchdowns,
            longest: player.longest,
            longest_touchdown: player.longest_touchdown,
            rating: player.rating,
            redzone_attempts: player.redzone_attempts,
            sack_yards: player.sack_yards,
            sacks: player.sacks,
            touchdowns: player.touchdowns,
            yards: player.yards



        }
    })

    const formattedRushingStats = playerRushingStats.map(player => {
       
        return {
            game_id: gameStatistics.id,
            player_id: player.id,
            attempts: player.attempts,
            avg_yards: player.avg_yards,
            first_downs: player.first_downs,
            touchdowns: player.touchdowns,
            yards: player.yards,
            longest: player.longest,
            longest_touchdown: player.longest_touchdown,
            redzone_attempts: player.redzone_attempts

        }
    })

    const formattedReceivingStats = playerReceivingStats.map(player => {
      
        return {
            game_id: gameStatistics.id,
            player_id: player.id,
            first_downs: player.first_downs,
            receptions: player.receptions,
            targets: player.targets,
            yards: player.yards,
            avg_yards: player.avg_yards,
            longest: player.longest,
            touchdowns: player.touchdowns,
            longest_touchdown: player.longest_touchdown,
            yards_after_catch: player.yards_after_catch,
            redzone_targets: player.redzone_targets,
            air_yards: player.air_yards
        }
    })

    const formattedKickingStats = playerKickingStats.map(player => {
        
        return {
            game_id: gameStatistics.id,
            player_id: player.id,
            attempts: player.attempts,
            made: player.made,
            blocked: player.blocked,
            yards: player.yards,
            avg_yards: player.avg_yards,
            longest: player.longest,
            missed: player.missed,
            pct: player.pct,
            attempts_19: player.attempts_19,
            attempts_29: player.attempts_29,
            attempts_39: player.attempts_39,
            attempts_49: player.attempts_49,
            attempts_50: player.attempts_50,
            made_19: player.made_19,
            made_29: player.made_29,
            made_39: player.made_39,
            made_49: player.made_49,
            made_50: player.made_50,
        }
    })
    

    const formattedFumbleStats = playerFumbleStats.map(player => {
       
        return {
            game_id: gameStatistics.id,
            player_id: player.id,
            fumbles: player.fumbles,
            lost_fumbles: player.lost_fumbles,

        }
    })
    const filteredPassingStats = formattedPassingStats.filter(stat => players.some(p => p.id === stat.player_id));
    const filteredRushingStats = formattedRushingStats.filter(stat => players.some(p => p.id === stat.player_id));
    const filteredReceivingStats = formattedReceivingStats.filter(stat => players.some(p => p.id === stat.player_id));
    const filteredKickingStats = formattedKickingStats.filter(stat => players.some(p => p.id === stat.player_id));
    const filteredFumbleStats = formattedFumbleStats.filter(stat => players.some(p => p.id === stat.player_id));

    const { error: passingError } = await supabase
        .from('g_passing')
        .upsert(filteredPassingStats)

    const { error: rushingError } = await supabase
        .from('g_rushing')
        .upsert(filteredRushingStats)

    const { error: receivingError } = await supabase
        .from('g_receiving')
        .upsert(filteredReceivingStats)

    const { error: kickingError } = await supabase
        .from('g_kicking')
        .upsert(filteredKickingStats)

    const { error: fumbleError } = await supabase
        .from('g_fumbles')
        .upsert(filteredFumbleStats)

    if (passingError || rushingError || receivingError || kickingError || fumbleError) {
        console.log('Error inserting game statistics', passingError, rushingError, receivingError, kickingError, fumbleError)
    }

    
}