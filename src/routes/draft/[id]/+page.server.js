

import { fail } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import { supabase } from '$lib/supabaseClient'
//TODO figure out how to use event as well as fetch


export const actions = {
    /**
     * This should modify the draft table to add the player to the draft
     */
    draft: async ({ request, params, locals }) => {
        //we need player_id, user_id, round, pick, possibly team id if we allow multiple teams per user
        //get player id
        const formData = await request.formData();
        const player_id = formData.get('player_id');
        const draft = formData.get('draft');
        const autodraft = formData.get('autodraft') || false;

        console.log(draft)
        console.log(autodraft)
        
        //TODO is there a better way? Should draft have a current pick property? 
        const currentPick = draft.picks.find(pick => pick.round === draft.round && pick.pick === draft.pick);
        const nextPick = draft.pick === draft.order.length ? { round: draft.round + 1, pick: 1 } : { round: draft.round, pick: draft.pick + 1 }

        if (autodraft) {
            autodraft(currentPick, nextPick, draft, player_id, locals)
        }
        manualDraft(currentPick, nextPick, draft, player_id, locals)
       
    },
    start: async ({ request, params, locals }) => {
        const formData = await request.formData();
        const draft = JSON.parse(formData.get('draft'))
       
        let timestamp = Date.now();
        timestamp = timestamp + (draft.roundLength * 1000 * 10);
        let pickEnd = new Date(timestamp).toISOString();

        const { data: updatedDraft, error: draftError } = await supabase
            .from('drafts')
            .update({ status: "ACTIVE", pickEnd: pickEnd })
            .eq('id', draft.id)
            .select()


        if (draftError) {
            console.log(draftError)
            return fail(401, { error_message: draftError?.message || "Something went wrong" })
        }

        return {
            message: 'success'
        }


    }
}


async function autodraft(){
    console.log(autodraft)
}

async function manualDraft(currentPick, nextPick, draft, player_id, locals){

    if (currentPick.teams.manager !== locals.user.id) {
        return fail(401, { error_message: "You are not authorized to make this pick" })
    }


    const { data, error } = await supabase
        .from('picks')
        .update([
            { team_id: currentPick.teams.id, player_id: player_id },
        ])
        .eq('id', currentPick.id)

    const { data: updatedDraft, error: draftError } = await supabase
        .from('drafts')
        .update({ round: nextPick.round, pick: nextPick.pick })
        .eq('id', draft.id)


    if (error || draftError) {
        console.log(error || draftError)
        return fail(401, { error_message: error?.message || draftError?.message || "Something went wrong" })
    }

    return {
        pick: data,
        message: 'success'
    }
}

