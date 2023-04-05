import { supabase } from '$lib/supabaseClient'
import { init_draft } from '../../../draft/[id]/draft.server';

export const actions = {
    init: async ({ request, params, locals }) => {
        const formData = await request.formData();
        const league = formData.get('league');
        const result = await init_draft(locals.user, league)
        return result
    }
}
