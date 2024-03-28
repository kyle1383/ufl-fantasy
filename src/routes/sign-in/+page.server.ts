import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
export const load = async ({ locals: { getSession }, cookies }) => {
    
    const cook = cookies.getAll()
    
    const session = await getSession()
    const redirectUrl = cookies.get('invite');
 
    if (session) throw redirect(303, redirectUrl || '/leagues')

    if (redirectUrl) return {
        redirectUrl,
    }

}


export const actions = {
    signUp: async ({ url, request, params, locals: { supabase } }) => {
        const formData = await request.formData();
        const username = formData.get('username');
        const email = formData.get('email');
        const pw = formData.get('password');
        const redirect = formData.get('redirect')
        console.log(redirect)
        if (!email || !pw) return { status: 400, body: 'email and password are required' }
        const { data, error } = await supabase.auth.signUp(
            {
                email: email.toString(),
                password: pw.toString(),
                options: {
                    data: {
                        username: username
                    },
                    redirectTo: redirect
                }
            }
        )
        if (error) return { status: 500, body: error.message }
        return { status: 200, body: data };
    },
    signIn: async ({ request, params, locals: { supabase }, cookies }) => {
        const formData = await request.formData();
        const email = formData.get('email');
        const pw = formData.get('password');
        const redirectUrl = formData.get('redirect')?.toString() || cookies.get('invite') || '/leagues'

        if (!email || !pw) return { status: 400, body: 'email and password are required' }
        const { error } = await supabase.auth.signInWithPassword(
            {
                email: email.toString(),
                password: pw.toString(),

            }
        )
       
        if (error) return fail(400, error.message)
        throw redirect(303, redirectUrl)
        return { status: 200 };
    },
   

}