import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export async function GET(req) {
    //this should run about 50 x per game 
    //check if the time is between 1230 and 3 or 7 and 10 ET
    const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const { data: weekData, error: weekError } = await supabase.from('seasons').select('week').eq('year', 2024).single()
    if (weekError) {
        return new Response('Error getting week data');
    }
    const week = weekData?.week; // Handle null case

    const { data: uflGames, error: gamesError } = await supabase.from('ufl_games').select('id, scheduled, home(players(id, player_leagues(id, team_position,team))), away(players(id, player_leagues(id, team_position,team)))')
        .eq('week', week)
        //.filter('rosters_locked', 'neq', 'TRUE')
        .not('home.players.player_leagues.team', 'is', 'null')
        .not('away.players.player_leagues.team', 'is', 'null')
    if (gamesError) {
        console.log(gamesError)
        return new Response('Error getting games data');
    }
    const activeOrCompleteGames = uflGames?.filter(game => gameHasStarted(game.scheduled));
   
    const playersToUpdate = activeOrCompleteGames.flatMap(game => [
        ...((game.home.players || []).flatMap(player => player.player_leagues)),
        ...((game.away.players || []).flatMap(player => player.player_leagues))
    ]);
    console.log(playersToUpdate.length)
    const formattedPlayers = playersToUpdate.map(player => {
        return {
            player_id: player.id,
            position: player.team_position || 'BENCH',
            team_id: player.team,
            week: week
        }
    })

   
   
    //update players
    /*const { data: lockedPlayers, error: lockedPlayersError } = await supabase.from('roster_lock').upsert(formattedPlayers)
    //update game statuses
    if (lockedPlayersError) {
        console.log(lockedPlayersError)
        return new Response('Error updating players');
    }
    const updatedGameInfo = activeOrCompleteGames.map(game => {
        return {
            id: game.id,
            rosters_locked: 'TRUE',
            status: 'closed'
        }
    })
    const {data: updatedGames, error: updateGamesError} = await supabase.from('ufl_games').upsert(updatedGameInfo)
    if(updateGamesError){
        console.log(updateGamesError)
        return new Response('Error updating games');
    }*/
    return new Response('Updated Statistics');

}

function gameHasStarted(timeString) {
    // Create a Date object from the time string
    const inputTime = new Date(timeString);

    // Get the current time
    const currentTime = new Date();

    // Compare the input time with the current time
    return inputTime < currentTime;
}

