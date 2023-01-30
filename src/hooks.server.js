import '$lib/supabaseClient'
import {auth} from '$db/auth';
import { sequence } from '@sveltejs/kit/hooks';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';




async function authorize({event, resolve}){
    const { session } = await getSupabase(event)

    //If I do this here, can I just check for locals.user in all page.server files?
    const user = session?.user   
    event.locals.user = user;
    return resolve(event);
}
export const handle = sequence(authorize);
