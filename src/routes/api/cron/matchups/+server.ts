import { updateWeeklyGameStatistics } from '$lib/stats.server.js';
import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
export async function GET(req) {
    //this should run about 50 x per game 
    //check if the time is between 1230 and 3 or 7 and 10 ET
    const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)



    /* if (activeGame) {*/
    const { data: season, error: seasonError } = await supabase.from('seasons').select('*').eq('year', 2024).single()
    const week = season.week

    const { data: uflGames, error: gamesError } = await supabase.from('ufl_games').select('id, scheduled, home(players(id, player_leagues(id, team_position,team))), away(players(id, player_leagues(id, team_position,team)))')
        .eq('week', week)


    if (gamesError) {
        console.log(gamesError)
        return new Response('Error getting games data');
    }

    const activeGame = isGameActive(uflGames);
    if (activeGame) {
        await updateWeeklyGameStatistics(week || 5)
    }
    return new Response('Updated Statistics');

}

const isGameActive = (games) => {
    const activeGame = games.some(game => {
        const inputTime = new Date(game.scheduled);
        const currentTime = new Date();

        //check if current time is within 3 hours after scheduled start time 
        const threeHoursAfter = new Date(inputTime.getTime() + 3 * 60 * 60 * 1000);
        return inputTime < currentTime && currentTime < threeHoursAfter;
    })

    return activeGame;
}
function gameHasStarted(timeString) {
    // Create a Date object from the time string
    const inputTime = new Date(timeString);

    // Get the current time
    const currentTime = new Date();
    console.log(inputTime, currentTime)
    // Compare the input time with the current time
    return inputTime < currentTime;
}
