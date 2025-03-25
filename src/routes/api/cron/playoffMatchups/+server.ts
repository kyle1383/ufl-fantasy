import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { getStatsForMatchup, calculateFantasyScore } from '$lib/helpers.js';
import type { PlayerLeague } from '$lib/types.js';

export async function GET(req) {
    //go through each matchup and add final score 
    const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
   
    const {data: leagues, error: leaguesError} = await supabase.from('leagues').select('id, name, matchups(*), teams(*)')

    console.log(leagues[0])
    return new Response('Updated Scores');
}