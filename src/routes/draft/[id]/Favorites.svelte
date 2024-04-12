<script>
	export let players = [];
	$: players;
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
						<div class="flex items-center justify-center">
							<div class="w-10 h-10 rounded-full overflow-hidden bg-cover mr-2">
								<img src={player.img_url} alt={player.name} class="w-full h-full object-cover" />
							</div>
						</div>
					</div>
					<div class="flex flex-col justify-center">
						<p>{player.name}</p>
						<span class="font text-gray-100 text-xs"
							><span class={`text-${player.position}`}>{player.position}</span> - {`${player.ufl_teams.city} ${player.ufl_teams.name}`}</span
						>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
