
import { redirect } from '@sveltejs/kit';


export async function load({ locals: {getSession} }) {
    const session = await getSession()
    const user = session?.user
    if (user) {
       
        throw redirect(303, '/leagues/')
    } else{
        throw redirect(303, '/sign-in/')
    }
}