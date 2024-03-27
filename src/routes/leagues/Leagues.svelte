<script lang="ts">
	import NewLeague from './NewLeague.svelte';

	export let user_leagues: any[] = [];
	$: user_leagues;


</script>

<div class="grid grid-cols-4 m-8 gap-x-8 mx-24">
	{#each user_leagues as league}
		<a href="/leagues/{league.id}" class="text-white bg-gray-700 p-8 rounded-lg border-gray-600 border-2">
			<p class="text-2xl text-white font-bold">{league.name}</p>
			<div class="flex py-2">
				<div class="badge badge-primary font-semibold badge-outline mr-2">{league.size} Teams</div>
				<div class="badge badge-secondary badge-outline font-semibold">PPR</div>
			</div>
		
		</a>
	{/each}
	<NewLeague bind:user_leagues={user_leagues}/>
</div>
<div class="text-center">
	
</div>

