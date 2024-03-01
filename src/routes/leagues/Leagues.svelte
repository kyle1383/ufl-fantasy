<script lang="ts">
	import NewLeague from './NewLeague.svelte';

	export let user_leagues: any[] = [];
</script>

<div class="max-w-sm m-auto flex justify-center p-24">
	{#if user_leagues}
		{#each user_leagues as league}
			<li>
				<a href={`/leagues/${league.leagues.id}`} data-sveltekit-preload-data="off"
					>{league.leagues.name}</a
				>
			</li>
		{/each}
	{:else}
		<p>No Leagues are loading right now</p>
	{/if}

	<NewLeague />
</div>
