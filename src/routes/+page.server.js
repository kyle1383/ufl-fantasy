
import { redirect } from '@sveltejs/kit';


export async function load({ locals: {getSession} }) {
    const { user } = await getSession()
    if (user) {
        throw redirect(303, '/leagues/')
    } else{
        throw redirect(303, '/sign-in/')
    }
}