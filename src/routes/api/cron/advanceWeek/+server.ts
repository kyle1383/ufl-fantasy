import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { getStatsForMatchup, calculateFantasyScore } from '$lib/helpers.js';
import type { PlayerLeague } from '$lib/types.js';

export async function GET(req) {
    //go through each matchup and add final score 
    const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const { data: weekData, error: weekError } = await supabase.from('seasons').select('week').eq('year', 2024).single()
    if (weekError) {
        return new Response('Error getting week data');
    }
    const week = weekData?.week; // Handle null case

    //check that ufl games are closed for the week 
    const { data: uflGames, error: gamesError } = await supabase.from('ufl_games').select('id, week, status').eq('week', week)
    if (gamesError) {
        console.log(gamesError)
        return new Response('Error fetching games');
    }
    const gamesClosed = uflGames.some(game => game.status === 'closed');
    if (!gamesClosed) {
        return new Response('Games are not closed');
    }

    return new Response("pROOOOBELEM")

    const { data: leagueMatchups, error: matchupsError } = await supabase
        .from('matchups')
        .select('*, team_id_1(*,  leagues(id),  player_leagues!public_player_leagues_team_fkey( depth, team_position, players(id, name, position, img_url, ufl_teams(*)))), team_id_2(*,  leagues(id), player_leagues!public_player_leagues_team_fkey(depth, team_position, players(id, name, position, img_url, ufl_teams(*))))')
        .eq('week', week)
        .is('team_1_final_score', null)
        .is('team_2_final_score', null)


    if (matchupsError) {
        console.log(matchupsError)
        return new Response('Error fetching matchups');
    }



    //rename team_id_1 to team_1
    const formattedMatchups = leagueMatchups?.map(matchup => {
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

  
    const matchupsWithScores = formattedMatchups.map(matchup => {
        const home = matchup.team_1;
        const away = matchup.team_2;

        home.player_leagues.forEach((player: PlayerLeague) => {
            player.score = calculateFantasyScore(player);
        });
        away.player_leagues.forEach((player) => {
            player.score = calculateFantasyScore(player);
        });
        const homeActivePlayers = home.player_leagues.filter(
            (player) => player.team_position !== 'BENCH' && player.team_position !== null
        );
        const awayActivePlayers = away.player_leagues.filter(
            (player) => player.team_position !== 'BENCH' && player.team_position !== null
        );
        const homeTotal =
            Math.round(homeActivePlayers.reduce((acc, player) => acc + player.score, 0) * 100) / 100;
        const awayTotal =
            Math.round(awayActivePlayers.reduce((acc, player) => acc + player.score, 0) * 100) / 100;

        return{
            id: matchup.id,
            team_1:{
                id: home.id,
                league_id: home.leagues.id,
                wins: home.wins,
                losses: home.losses,
                draws: home.draws
            },
            team_2:{
                id: away.id,
                league_id: away.leagues.id,
                wins: away.wins,
                losses: away.losses,
                draws: away.draws

            },
            team_1_final_score: homeTotal,
            team_2_final_score: awayTotal
        }
    })
    //add wins/losses to teams 
    console.log(matchupsWithScores)
    const teamsWithOutcomes = matchupsWithScores.flatMap(matchup => {
        const team1 = matchup.team_1;
        const team2 = matchup.team_2;
        if(matchup.team_1_final_score > matchup.team_2_final_score){
            team1.wins += 1;
            team2.losses += 1;
        }else if(matchup.team_1_final_score < matchup.team_2_final_score){
            team2.wins += 1;
            team1.losses += 1;
        }else{
            team1.draws += 1;
            team2.draws += 1;
        }
        return [team1, team2]
    })
    const simpleMatchups = matchupsWithScores.map(matchup => {
        return {
            id: matchup.id,
            team_1_final_score: matchup.team_1_final_score,
            team_2_final_score: matchup.team_2_final_score
        }
    })
    
    const { data: updatedMatchups, error: updateMatchupsError } = await supabase.from('matchups').upsert(simpleMatchups)
    if (updateMatchupsError) {
        console.log(updateMatchupsError)
        return new Response('Error updating matchups');
    }
    const { data: updatedTeams, error: updateTeamsError } = await supabase.from('teams').upsert(teamsWithOutcomes)
    if (updateTeamsError) {
        console.log(updateTeamsError)
        return new Response('Error updating teams');
    }
    const {data: updatedSeason , error: updateSeasonError} = await supabase.from('seasons').update({week: week + 1}).eq('year', 2024)
    if(updateSeasonError){
        console.log(updateSeasonError)
        return new Response('Error updating season');
    }

    return new Response('Updated Scores');
}