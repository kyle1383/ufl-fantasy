
import { redirect } from '@sveltejs/kit';


export async function load({ locals }) {
    if (locals.user) {
        throw redirect(303, '/leagues/')
    } else{
        throw redirect(303, '/profile/')
    }
}