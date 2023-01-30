<script>
	import { goto } from '$app/navigation';

// @ts-nocheck
	import { page } from '$app/stores';
	import { supabase } from '$lib/supabaseClient';

	let loading = false;
	let email;
	let password;

	const handleLogin = async () => {

		try {
			loading = true;
			if (!password) {
				//TODO - seems like we are sent to the right page, but aren't authenticated, so then we aren't sent to the right page 
				const redirection = $page.url.searchParams.get('url') ? $page.url.origin + $page.url.searchParams.get('url') : $page.url.origin + '/profile'
				console.log(redirection)
				const { error } = await supabase.auth.signInWithOtp({ email,  options: { emailRedirectTo: redirection }});
        if (error) throw error;
			  alert('Check your email for the login link!');
			} else {
				const { data, error } = await supabase.auth.signInWithPassword({
					email: email,
					password: password
				});
        if (error) throw error;
			}

			
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
			goto($page.url.searchParams.get('url') || '/')
		}
	};
</script>

<form class="row flex-center flex" on:submit|preventDefault={handleLogin}>
	<div class="col-6 form-widget">
		<p class="description">Sign in via magic link with your email below</p>
		<div>
			<input class="inputField" type="email" placeholder="Your email" bind:value={email} />
		</div>
		<div>
			<input class="inputField" type="password" placeholder="Password" bind:value={password} />
		</div>
		<div>
			<input
				type="submit"
				class="button block"
				value={loading ? 'Loading' : 'Send magic link'}
				disabled={loading}
			/>
		</div>
	</div>
</form>
