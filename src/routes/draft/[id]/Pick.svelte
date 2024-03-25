<script>
	export let pick;
	export let player;

</script>

{#if !player}
	<div class="bg-slate-900 rounded p-4 m-1">
		<p class="text-right">{pick.round}.{pick.pick}</p>
	</div>
{:else}
	<div class="bg-{player.position} text-white rounded p-2 m-1 bg-QB flex justify-between items-center">
		<div>
			<p>{player.name}</p>
			<p class="">{player.position}-{player.xfl_teams.name}</p>
		</div>
		<div class="w-10 rounded-full">
			<img src={player.img_url} alt={player.name} class="w-auto h-full" />
		</div>
	</div>
{/if}
