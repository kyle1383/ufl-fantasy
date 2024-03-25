<script lang="ts">
	import NewLeague from './NewLeague.svelte';

	export let user_leagues: any[] = [];
	$: user_leagues;


</script>

<p class="text-3xl mx-8 mx-8 py-2 border-b-2 border-solid border-base-100 text-base-100">LEAGUES</p>
<div class="grid grid-cols-6 m-8 gap-x-8">
	{#each user_leagues as league}
		<a href="/leagues/{league.id}" class="border-2 border-solid border-gray-300 bg-white p-4 league rounded">
			<p class="text-2xl text-base-100 font-bold gothic">{league.name}</p>
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

<style>
	.league {
		box-shadow: 5px 5px 0px 0px #000;
		transition: 0.1s;
	}
	.league:hover{
		box-shadow: none;
	}
</style>
