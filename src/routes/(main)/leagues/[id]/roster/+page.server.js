import { supabase } from '$lib/supabaseClient';
import { fail } from "@sveltejs/kit";

export const actions = {
    updateRosterPosition: async ({ request, params, locals }) => {
        const formData = await request.formData();
        const positionJSON = formData.get('position');
        const position = JSON.parse(positionJSON)
        const playerJSON = formData.get('player')
        const player = JSON.parse(playerJSON)
        console.log(position.i)
        console.log(player.id)
        const { data, error } = await supabase
            .from('positions')
            .update({ player_teams_id: player.id })
            .eq('id', position.id)
            .select();

        if (error) {
            console.log(error)
            return fail(401, error)
        } else {
            console.log(data)
        }
        return {
            message: "success"
        }

    }
}
