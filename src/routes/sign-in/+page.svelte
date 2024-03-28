<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	// @ts-ignore
	
	$: signUpMode = false;
	export let data;
	let { supabase } = data;
	$: error = '';
	$: loading = false;
	async function google() {
		loading = true;
		const { error ,data } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
    redirectTo: `${$page.url.origin}/auth/callback`,
  },
			
		});
		console.log(error, data)
	}

	
</script>

<div class="flex flex-col items-center justify-center bg-black text-white min-h-screen">
	<div class="login">
		<div class="flex justify-center items-end max-w-xs w-xs relative invisible lg:visible">
			<img src="/fg_white.gif" alt="UFL Logo" class="w-24" />
		</div>
		<div class="text-white bg-gray-700 p-8 rounded-lg border-gray-600 mx-4 border-2 sm:max-w-xs">
			<form
			class="text-center"
				method="POST"
				action={signUpMode ? '?/signUp' : '?/signIn'}
				use:enhance={({ formElement, data, action, cancel }) => {
					loading = true;
					return async ({ result, update }) => {
					
						
						if (result.type === 'failure') {
							loading=false;
							if (result.data && result.data.toString() === 'Invalid login credentials') {
								error = 'Invalid username or password';
							} else {
								error = result.data;
							}
							return;
						}
						update();
					};
				}}
			>
				<p class="text-2xl pb-4 orbitron text-center w-full">Welcome to UFL Fantasy Football</p>

				{#if error}<p class="text-center error text-error pb-2">{error}</p>{/if}
				{#if signUpMode}
					<input
						type="text"
						placeholder="Enter your username"
						class="input input-primary w-full max-w-xs rounded-xl mb-4 w-full"
						name="username"
						required
					/>
				{/if}
				<input
					type="email"
					placeholder="Enter your Email"
					class="form-input rounded-md shadow-sm text-black p-4 font-semibold bg-gray-700 rounded-lg border-gray-600 border-2 text-white min-w-64 w-full"
					name="email"
					required
				/>
				<input
					type="password"
					placeholder="Enter your Password"
					class="form-input rounded-md shadow-sm text-black p-4 font-semibold bg-gray-700 rounded-lg border-gray-600 border-2 text-white mt-4 min-w-64 w-full"
					name="password"
					required
				/>
				<input type="hidden" name="redirect" value={$page.url.searchParams.get('url')} />
				<button
					type="submit"
					class="mx-auto btn btn-primary w-full max-w-xs rounded-xl mt-4"
					disabled={loading}>Sign {signUpMode ? 'up' : 'in'}</button
				>
				<div class="divider">OR</div>
			</form>

			<button
				on:click={() => google()}
				disabled={loading}
				class="mx-auto btn bg-white text-black w-full max-w-xs rounded-xl px-1 flex"
				><img src="/google-logo.png" class="w-8 ml-2" alt="google logo" />
				<p class="grow">Sign {signUpMode ? 'up' : 'in'} with Google</p></button
			>

			{#if !signUpMode}
				<p class="mt-4 text-center lg:text-left">
					Don't have an account? <span
						class="text-primary"
						on:click={() => (signUpMode = true)}
						on:keydown={() => {}}>Sign-up</span
					>
				</p>
			{/if}
		</div>
	</div>
</div>

<style>
	.login {
		transform: translateY(-48px);
	}
</style>
