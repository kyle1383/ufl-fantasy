// @ts-nocheck
//only use on the server
import { fail } from "@sveltejs/kit"
import { supabase } from './supabaseClient'
import { goto } from "$app/navigation"
export async function initialize(user){
    const draft = {
        //league_id: ,
        mock: true,
        //-1 represents cpu
        order: [user.id, null, null, null],
        active: true,
        season: 2023,
    
    }
    
    const { data, error } = await supabase
        .from('drafts')
        .insert(draft)
        .select()
        .single()
    
    if (error) {
        console.log(error)
        return fail(401, { error_message: error.message || "Something went wrong" })
    }

    return {
        status: 200,
        draft: data
    }

}


