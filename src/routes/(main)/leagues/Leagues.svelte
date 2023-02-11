<script>
	import { page } from '$app/stores';
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

<a class="btn btn-primary" href="/leagues/new">Create a new league</a>
