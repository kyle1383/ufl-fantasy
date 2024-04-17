import { describe, it, expect } from 'vitest';
import { generate_matchups } from '../../leagues/matchup';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

describe('Matchup Generation', async () => {
    const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const { data: league, error: leagueError } = await supabase.from('leagues').select('id, teams ( id )').limit(1).single();
    expect(leagueError).toBe(null);
    const matchups = await generate_matchups(league, 3, supabase);
    it('generates matchups for a random league', async () => {
        expect(matchups).toBeDefined();
    });

   /* it('uploads matchups to supabase', async () => {
        const { data: matchupsData, error: matchupsError } = await supabase
            .from('matchups')
            .insert(matchups)
        expect(matchupsError).toBe(null);
    });*/
});