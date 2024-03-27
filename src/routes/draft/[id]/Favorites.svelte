<script>
	export let players = [];
</script>

<div class="border-l-[1px] border-gray-700 h-full text-white bg-black">
	<p class="text-xl font-bold py-4 border-gray-600 pl-8 border-t-[1px] border-b-[1px]">Favorites</p>
	{#if players.length === 0}
		<p class="pl-8 pt-4 text-gray-300">No players favorited</p>
	{:else}
		<div class="flex flex-col space-y-2 pt-4 pl-8">
			{#each players as player}
				<div class="flex">
					<div class="flex items-center">
						<div class="w-10 rounded-full">
							<img src={player.img_url} alt={player.name} class="w-8 h-8" />
						</div>
					</div>
					<div class="flex flex-col justify-center">
						<p>{player.name}</p>
						<span class="font text-gray-100 text-xs"
							><span class={`text-${player.position}`}>{player.position}</span> - {`${player.xfl_teams.city} ${player.xfl_teams.name}`}</span
						>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
