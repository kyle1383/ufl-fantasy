<script>
	// @ts-nocheck
	import { supabase } from '$lib/supabaseClient';
	import { page } from '$app/stores';
	import NewLeague from './NewLeague.svelte';
	import { onMount } from 'svelte';
	//export let data;
	let user_leagues;
	$: user_leagues = $page.data.user_leagues;

	function getLeagues() {
		
		supabase
			.from('members')
			.select('leagues ( * )')
			.eq('user_id', $page.data.session.user.id)
			.then((data) => {
				user_leagues = data.data;
			});
	}
</script>

{#if user_leagues}
	{#each user_leagues as league}
		<li>
			<a href={`/leagues/${league.leagues.id}`} data-sveltekit-preload-data="off">{league.leagues.name}</a>
		</li>
	{/each}
{:else}
	<p>No Leagues are loading right now</p>
{/if}

<NewLeague getLeagues={getLeagues}/>
