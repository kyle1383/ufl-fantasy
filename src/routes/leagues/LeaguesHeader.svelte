<script lang="ts">
	import { page } from '$app/stores';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { League } from '$lib/types';
	import Icon from '@iconify/svelte';
	import { goto, invalidateAll } from '$app/navigation';
	export let leagues: League[] = [];
	export let supabase: SupabaseClient;
	$: league = $page.data.league || leagues.find((l) => l.id.toString() === $page.params.id);
	$: nonActiveLeagues = leagues.filter((l) => l.id.toString() !== $page.params.id);
	$: mobileMenu = false;
	console.log($page.data.session.user.user_metadata);
	$: isCommissioner = league.commissioners.some((c) => c.user_id === $page.data.session?.user.id);
	
	async function signOut() {
		await supabase.auth.signOut();
		mobileMenu = false;
		await invalidateAll();
	}
</script>

<div
	class="flex justify-between items-center w-full px-8 lg:px-24 py-2 bg-gray-700 text-white z-30 relative"
>
	<div class="dropdown hidden lg:block">
		<div tabindex="0" role="button" class="m-1 flex items-center space-x-8 font-bold">
			{league?.name || 'Leagues Dashboard'}
			<Icon width="10" class="ml-2" icon="teenyicons:down-outline" />
		</div>
		<ul class="dropdown-content z-[1] menu p-2 shadow bg-black rounded-box w-52">
			{#if league}
				<li><a href="/leagues">Leagues Dashboard</a></li>
			{/if}
			{#each nonActiveLeagues as l}
				<li><a href="/leagues/{l.id}" on:click={invalidateAll}>{l.name}</a></li>
			{/each}
		</ul>
	</div>
	<a href="/" on:click={() => (mobileMenu = false)} class="text-xl lg:text-md orbitron"
		>UFL FANTASY <span class=" lg:text-xs text-acc4">(BETA)</span></a
	>
	<div class="flex space-x-2 items-center">
		
		<Icon icon="clarity:settings-line" width="20" class="hidden" />
		
		
		<div class="dropdown dropdown-end">
			
			<div tabindex="0" role="button" class="hidden lg:flex btn btn-ghost space-x-2">
				
				<Icon icon="clarity:avatar-line" width="20" class="hidden lg:block my-auto" />
			</div>
			
			<ul
				class="menu menu-sm dropdown-content mt-3 p-2 shadow w-52 z-30 text-white bg-gray-700 rounded-lg border-gray-600 border-2"
			>
			<p class="text-left ml-4 py-2 font-bold">
				{$page.data.session.user.user_metadata.username ||
					$page.data.session.user.user_metadata.full_name ||
					''}
			</p>
				<li>
					<button>Profile 🚧</button>
				</li>
				<li><button on:click={signOut}>Logout</button></li>
			</ul>
		</div>

		<button on:click={() => (mobileMenu = !mobileMenu)} class="lg:hidden my-auto p-2"
			><Icon icon="clarity:bars-line" class="" width="20" /></button
		>
	</div>
</div>
<div class="bg {mobileMenu ? '' : 'hidden'}" />
<div
	class="flex bg-gray-600 text-white px-8 py-4 absolute w-full z-30 {mobileMenu ? '' : 'hidden'}"
>
	<ul class="space-y-4 flex flex-col">
		{#if league}
			<li>
				<a on:click={() => (mobileMenu = false)} href="/leagues/{$page.params.id}">Dashboard</a>
			</li>
			<li>
				<a on:click={() => (mobileMenu = false)} href="/leagues/{$page.params.id}/roster">Roster</a>
			</li>
			<li>
				<a on:click={() => (mobileMenu = false)} href="/leagues/{$page.params.id}/waivers"
					>Waivers</a
				>
			</li>
			{#if league.seasons.week && league.matchups.length !== 0 && league.matchups}<li>
					<a href="/leagues/{$page.params.id}/matchups/{league.seasons.week}">Matchups</a>
				</li>{/if}
			<li>
				<a on:click={() => (mobileMenu = false)} class="" href="/leagues/{$page.params.id}/draft"
					>Draft</a
				>
			</li>
		{/if}
		{#if isCommissioner}<li><a on:click={() => (mobileMenu = false)}>Settings</a></li>{/if}
		<li><button on:click={signOut}>Log Out</button></li>
	</ul>
</div>

<style>
	.bg {
		width: 100%;
		height: 100%;
		background-color: black;
		position: absolute;
		opacity: 0.5;
		top: 0;
		left: 0;
		z-index: 20;
	}
	menu {
		padding: 0 !important;
	}
</style>
