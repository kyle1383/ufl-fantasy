<script lang="ts">
	import { browser } from '$app/environment';
	import type League from '../../types/league';
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { redirect } from '@sveltejs/kit';
	import Leagues from './Leagues.svelte';
	import { onMount } from 'svelte';
	const supabase = $page.data.supabase;
	export let data;

	$: user_leagues = data.user_leagues;
	
	let invites: string[] = [];
	let invitedLeagues: League[] = [];

	

	onMount(async () => {
		invites = JSON.parse(window.localStorage.getItem('invites') || '[]');
		invites = invites.filter((invite) => invite !== null);
		removeLeagueFromInvites(null);
		let invitesIds = invites.map((invite) => invite.split('/')[2]);
		//remove invites from local storage if league i in user_leagues
		invitesIds = invitesIds.filter((id) => {
			// Log the first user league for debugging purposes

			// Use `some` to check if `user_leagues` contains an element with a matching `id`
			if (!user_leagues.some((l) => l.id.toString() === id)) {
				return true; // Keep the id in `invitesIds` if it's not found in `user_leagues`
			}

			removeLeagueFromInvites(id);
			return false; // Otherwise, filter it out
		});

		if (supabase) {
			const { data: invitesData, error } = await supabase
				.from('leagues')
				.select('*')
				.in('id', invitesIds);
			if (error) {
				console.log('error fetching league data');
			}
			invitedLeagues = invitesData;
		}
	});

	function removeLeagueFromInvites(id) {
		const currentRedirects = JSON.parse(window.localStorage.getItem('invites') || '[]') || [];

		const updatedRedirects = currentRedirects.includes(`/leagues/${id}/invite`)
			? currentRedirects.filter((r) => r !== `/leagues/${id}/invite` && r !== null)
			: currentRedirects.filter((r) => r !== null);

		window.localStorage.setItem('invites', JSON.stringify(updatedRedirects));
	}
</script>

<svelte:head>
	<title>Xfl Fantasy</title>
	<meta name="description" content="Xfl fantasy app" />
</svelte:head>

{#if !$page.data.session}
	<p />
{:else}
	<Leagues {user_leagues} />

	{#if invitedLeagues.length > 0}
		<p class="text-xl text-white font-bold mx-8 lg:mx-24">Invites</p>
		<div
			class="grid grid-cols-1 md:grid-cols-2 gap-y-4 lg:grid-cols-4 my-4 mx-8 gap-x-8 lg:mx-24"
		>
			{#each invitedLeagues as league}
				<div>
					<div class="text-white bg-gray-700 p-4 rounded-lg border-gray-600 border-2">
						<p class="text-2xl text-white font-bold">{league.name}</p>
						<div class="flex py-2">
							<div class="badge badge-primary font-semibold badge-outline mr-2">
								{league.size} Teams
							</div>
							<div class="badge badge-secondary badge-outline font-semibold">PPR</div>
						</div>
					</div>
					<a class="btn btn-primary w-full mt-4 btn-outline" href="/leagues/{league.id}/invite"
						>Join Now</a
					>
				</div>
			{/each}
			</div>
	{/if}
{/if}
