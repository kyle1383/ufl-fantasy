import { redirect } from '@sveltejs/kit'

export async function load({cookies, params, url, locals: { supabase, getSession } }) {
    
    const session = await getSession()
    
    if (!session || !session?.user) {
        
        if (url.pathname.includes('invite')) {
            console.log('setting cookie')
            cookies.set('invite', '/leagues/' + params.id + '/invite', { path: '/' })

            throw redirect(303, '/sign-in?url=/leagues/' + params.id + '/invite')
        }
   
        throw redirect(303, '/sign-in')
        //return { user_leagues: [] }
    }
    const { data: leagues, error: leaguesError } = await supabase
        .from('members')
        .select('league_id')
        .eq('user_id', session.user.id)

   

    if (leaguesError) {
        console.log('le', leaguesError)
        return { user_leagues: [] }
    }

    const leagueIds = leagues.map((member) => member.league_id);
    const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .in('id', leagueIds)
    console.log(data.length, error, 'this is here', leagues.length)

    if (error) {
        console.log('error')
        return { user_leagues: [] }
    }
    return {
        user_leagues: data
    };
}
