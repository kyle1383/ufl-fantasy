<script>
	export let pick;
	export let player;

</script>

{#if !player}
	<div class="text-white bg-gray-700 p-4 rounded-lg border-gray-600 border-2">
		<p class="text-right">{pick.round}.{pick.pick}</p>
	</div>
{:else}
	<div class="bg-{player.position} text-white rounded p-2 m-1 bg-QB flex justify-between items-center">
		<div>
			<p class="text-xs lg:text-md">{player.name}</p>
			<p class="text-xs">{player.xfl_teams.name}</p>
		</div>
		<div class="w-10 rounded-full">
			<img src={player.img_url} alt={player.name} class="w-auto h-full" />
		</div>
	</div>
{/if}
