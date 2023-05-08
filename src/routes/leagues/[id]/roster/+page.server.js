// @ts-nocheck
import { supabase } from '$lib/supabaseClient';
import { fail } from "@sveltejs/kit";

export const actions = {
    updateRosterPosition: async ({ request, params, locals }) => {
        const formData = await request.formData();
        const playerJSON = formData.get('player');
        const swapOutPlayerJSON = formData.get('swapOutPlayer');
        const position = formData.get('position');
        const depth = formData.get('depth');
        const player = JSON.parse(playerJSON);
        const swapOutPlayer = JSON.parse(swapOutPlayerJSON);
        let players = []
        let errors = []


        if (!player || !position || !depth) {
            return fail(401, { error_message: 'Missing player, position, or depth' })
        }

        if (typeof swapOutPlayer === 'object') {
           
            const { data: updatedSwapOutPlayer, error: updatedSwapOutPlayerError } = await supabase
                .from('player_leagues')
                .update({ team_position: player.team_position, depth: player.depth })
                .eq('id', swapOutPlayer.id)
                .select()
                .single();

            players.push(updatedSwapOutPlayer)
            updatedSwapOutPlayerError !== null && errors.push(updatedSwapOutPlayerError)
        }


        const { data: updatedPlayer, error: updatedPlayerError } = await supabase
            .from('player_leagues')
            .update({ team_position: position, depth: depth })
            .eq('id', player.id)
            .select()
            .single();
        players.push(updatedPlayer)
        updatedPlayerError !== null && errors.push(updatedPlayerError)

        if (errors.length > 0) {
            return fail(401, { error_message: 'error updating player', errors: errors })
        }


        //Return the updated players
        return {
            message: 'success',
            players: players
        }

    }
}
