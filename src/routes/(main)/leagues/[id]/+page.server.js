import { supabase } from '$lib/supabaseClient'
import { init_draft } from '$lib/draft.server';
export async function load({ fetch, params, setHeaders, locals }) {

    const { data, error } = await supabase
        .from('leagues')
        .select('*, teams ( * )')
        .eq('id', params.id)

    if (data) {
        let { teams } = data[0]
        teams = await Promise.all(teams.map(async (team) => {
            if (team.manager) {
                const { data, error, status } = await supabase
                    .from('profiles')
                    .select(`username`)
                    .eq('id', team.manager)
                    .single();
                team.manager_name = data.username

            } else {
                team.manager_name = "none"
            }
            return team
        }));
        return {
            league: data
        };
    } else {
        return {
            league: null
        }
    }
}

export const actions = {
    init: async ({ request, params, locals }) => {
        const formData = await request.formData();
        const league = formData.get('league');
        const result = await init_draft(locals.user, league)
        return result
    }
}