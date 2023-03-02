
import { supabase } from '$lib/supabaseClient'
//Function should generate a schedule based on number of teams, week to start 
/**
 * @param {any} league_id
 * @param {number} start_week
 */
export async function generate_matchups(league_id, start_week) {
  
    //get current year as int 
    const currentYear = new Date().getFullYear();
    const season = parseInt(currentYear);

    const { data: league, error } = await supabase
        .from('leagues')
        .select('id, teams ( id )')
        .eq('id', league_id)
        .single()

    const teams = league.teams.map(team => team.id)
    const weeks = generatePairings(shuffleArray(teams), 10 - (start_week-1));

    weeks.forEach((week, i) => {
        console.log( i + start_week)
    })
} 


// Shuffle an array using the Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  // Generate pairings of teams for each week
  function generatePairings(teams, numWeeks) {
    const numTeams = teams.length;
    const homeTeams = teams.slice(0, numTeams / 2);
    const awayTeams = teams.slice(numTeams / 2);
  
    let pairings = [];
  
    for (let i = 1; i <= numWeeks; i++) {
      let pairing = [];
  
      for (let j = 0; j < numTeams / 2; j++) {
        pairing.push({team_id_1: homeTeams[j], team_id_2: awayTeams[j], });
      }
  
      // If the number of teams is odd, add a "bye" team that doesn't play this week
      if (numTeams % 2 !== 0) {
        pairing.push(["bye", awayTeams[numTeams / 2]]);
      }
  
      pairings.push(pairing);
  
      // Rotate the home and away teams to create new pairings
      homeTeams.push(awayTeams.shift());
      awayTeams.push(homeTeams.pop());
    }
  
    return pairings;
  }