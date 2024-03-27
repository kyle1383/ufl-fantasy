<script lang="ts">
	import { enhance } from '$app/forms';
	import {page} from '$app/stores';
	// @ts-ignore
	import { gsap } from 'gsap';
	import { onMount } from 'svelte';
	$: signUpMode = false;
	export let data;
	let { supabase } = data;

	async function google() {
		supabase.auth.signInWithOAuth({
			provider: 'google',
			options: { redirectTo: `http://localhost:5173/leagues` }
		});
	}

	onMount(() => {
		let tl = gsap.timeline();
		//tl.to('.ball', { duration: 1, rotation: 360, scale: 1.5 })
		//const tl = gsap.timeline({paused: true});
	});
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-slate-900">
	<div class="login">
		<div class="flex justify-center items-end max-w-xs w-xs relative">
			<img src="/field_themed.png" alt="UFL Logo" class="w-full field hidden" />
			<img src="/fg.gif" alt="UFL Logo" class="w-24"/>
		</div>
		<div class="rounded-lg p-8 max-w-xs bg-base-100">
			<form method="POST" action={signUpMode ? '?/signUp' : '?/signIn'} use:enhance>
				<p class="gothic text-3xl pb-8">Welcome to UFL Fantasy Football</p>
				{#if signUpMode}
					<input
						type="text"
						placeholder="Enter your username"
						class="gothic input input-primary w-full max-w-xs rounded-xl mb-4"
						name="username"
						required
					/>
				{/if}
				<input
					type="email"
					placeholder="Enter your Email"
					class="input input-primary w-full max-w-xs rounded-xl"
					name="email"
					required
				/>
				<input
					type="password"
					placeholder="Enter your Password"
					class="input input-primary w-full max-w-xs rounded-xl mt-4"
					name="password"
					required
				/>
				<input
				type="hidden"
				name="redirect"
				value={$page.url.searchParams.get('url')}
				/>
				<button type="submit" class="btn w-full max-w-xs rounded-xl mt-4"
					>Sign {signUpMode ? 'up' : 'in'}</button
				>
				<div class="divider">OR</div>
			</form>

			<button on:click={() => google()} class="btn w-full max-w-xs rounded-xl px-1 flex"
				><img src="/google-logo.png" class="w-8" alt="google logo" />
				<p class="grow">Sign {signUpMode ? 'up' : 'in'} with Google</p></button
			>

			{#if !signUpMode}
				<p class="mt-4">
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
	.ball {
		position: absolute;
		left: 50px;
		bottom: -10px;
		transform: rotate(50deg);
	}
	.custom-cursor {
		cursor: url('/sm_ball.png'), auto;
	}
	.field {
		transform: translateY(10px);
	}
	.login{
		transform: translateY(-24px);
	}
</style>
