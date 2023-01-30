// @ts-nocheck
import { fail } from '@sveltejs/kit'
import { supabase } from '$lib/supabaseClient'
import { redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ locals, request, fetch }) => {
       //redirect if not logged in
        /*if (!locals.user){
            throw redirect(303, '/')
        }
        const formData = await request.formData();
        let players = formData.get('players').split('\n')
        players = players.map(player=> player.replace(/\r$/, ''))
        players = players.map(player => player.split('\t'))
        players.shift();
        players = players.map(player=> {return {Team_ID: player[0], Name: player[1], Position: player[2]}})
       
        const { data: playersData, error } = await supabase
        .from('Players')
        .insert(players)

        if (error) {
            console.log(error)
            return fail(401, { error_message: "Unauthorized" })
        }*/

        //throw redirect(307, '/leagues');
        const res = await fetch('https://kit.svelte.dev/docs/load');
        const item = await res.json();
        console.log(item)
        
        return {
            message: "Inserted Players",
        }
    }
}