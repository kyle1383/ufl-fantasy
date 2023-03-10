<script>
// @ts-nocheck

	import { page } from '$app/stores';
	import NewLeague from './NewLeague.svelte';
	//export let data;
	let user_leagues = $page.data.user_leagues;
	
</script>

{#if user_leagues}
	{#each user_leagues as league}
		<li>
			<a href={`/leagues/${league.leagues.id}`}>{league.leagues.name}</a>
		</li>
	{/each}
{:else}
	<p>No Leagues are loading right now</p>
{/if}

<!-- The button to open modal -->
<label for="my-modal" class="btn btn-primary">Create League</label>

<a class="btn btn-secondary" href="/leagues/schedule">Schedule</a>


<!-- Put this part before </body> tag -->
<NewLeague />
