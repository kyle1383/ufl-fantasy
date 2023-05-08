<script>
	// @ts-nocheck
	export let position;
    export let depth;
    export let player;
	export let checked = false;
    export let swapDepth = 0;
	export let swapPosition = 'BENCH';
	export let swapOutPlayer = null;
</script>

<tr>
	{#if player !== 'null'}
		<td>
			<button on:click={()=>{swapPosition=position;swapDepth=depth; swapOutPlayer=player;checked=true}} class={`text-${position} btn-xs border-2 rounded-lg border-${position} btn`}>
			{position}
			</button
			>
		</td>
		<td class="whitespace-normal">
			<div class="w-10 rounded-full">
				<img src={player.players.img_url} alt={player.players.name} class="w-8 h-8" />
			</div>
		</td>
		<td class="break-words"
			><p>{player.players.name}</p>
			<sub class="font">
				{`${player.players.xfl_teams.city} ${player.players.xfl_teams.name}`}</sub
			>
		</td>
	{:else}
		<td>
			<button on:click={()=>{swapPosition=position;swapDepth=depth;swapOutPlayer=player; checked=true}} class={`text-${position} btn-xs border-2 rounded-lg border-${position} btn`}>
				{position}
			</button>
		</td>

		<td>Empty</td>
		<td />
	{/if}
</tr>
