import { supabase } from '$lib/supabaseClient';
import { fail } from "@sveltejs/kit";

export const actions = {
    updateRosterPosition: async ({ request, params, locals }) => {
        const formData = await request.formData();
        const positionJSON = formData.get('position');
        const position = JSON.parse(positionJSON)
        const playerJSON = formData.get('player')
        const player = JSON.parse(playerJSON)
        const team_id = formData.get('team_id')

        //check if the player already has a position
        const {data: prevPosition, error: positionsError} = await supabase 
            .from('positions')
            .select('*')
            .eq('team_id', team_id)
            .eq('player_teams_id', player.id) 
            .single()
        
        //check if the position already has a player
        const {data: currentPlayer, error: currentPlayerError} = await supabase 
            .from('positions')
            .select('player_teams_id')
            .eq('id', position.id)
            .single()
            
        console.log(prevPosition)
        console.log(currentPlayer)
        
        /*const { data, error } = await supabase
            .from('positions')
            .update({ player_teams_id: player.id })
            .eq('id', position.id)
            .select();

        if (error) {
            console.log(error)
            return fail(401, error)
        } 
        */
       
        //Return the updated players
        return {
            message: 'success'
        }

    }
}
