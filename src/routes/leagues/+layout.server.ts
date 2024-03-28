import { redirect } from '@sveltejs/kit'

export async function load({ locals: { supabase, getSession } }) {
    const session = await getSession()
    if (!session || !session.user) {
        throw redirect(303, '/sign-in')
        return { user_leagues: [] }
    }
    const { data: leagues, error: leaguesError } = await supabase
        .from('members')
        .select('league_id')
        .eq('user_id', session.user.id)
    
    const leagueIds = leagues.map((member) => member.league_id);
    const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .in('id', leagueIds)
    
   
    if (error) {
        console.log('error')
        return { user_leagues: [] }
    }
    return {
        user_leagues: data
    };
}
