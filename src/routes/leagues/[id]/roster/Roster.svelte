<script>
	// @ts-nocheck

	/**
	 * @type {{ player_leagues: any; }}
	 */
	import SwapDrawer from './SwapDrawer.svelte';
	import PlayerSlot from './PlayerSlot.svelte';
	import { findPlayer } from '$lib/helpers';
	export let team;
	export let roster_spots;
	

	//drawer initial values
	const players = team.player_leagues
	$: newPlayers = players;
	$: roster = roster_spots;
	$: swapPosition = 'QB';
	$: swapDepth = 1;
	$: swapPlayers = players.filter((player) => swapPosition === 'FLEX' ? player.players.position === 'RB' || 'WR' || 'TE': player.players.position === swapPosition);
	$: checked = false;
	$: swapOutPlayer = null;
	

</script>

<div class="overflow-x-auto px-4">
	<table class="table w-full table-auto">
		<tbody>
			
			{#each Object.keys(roster) as position}
				{#if position !== 'BENCH'}
					{#each Array.from({ length: roster[position] }, (_, index) => index + 1) as depth}
						<PlayerSlot
							{position}
							{depth}
							player={findPlayer(position, depth, players) || 'null'}
							bind:checked
							bind:swapPosition
							bind:swapDepth
							bind:swapOutPlayer
						/>
					{/each}
				{/if}
			{/each}
			
			{#each newPlayers as player}
				{#if player.team_position === 'BENCH'}
					<PlayerSlot position={player.team_position} depth={0} {player}/>
				{/if}
			{/each}
		</tbody>
	</table>

	<SwapDrawer position={swapPosition} depth={swapDepth} {swapPlayers} {swapOutPlayer} bind:newPlayers bind:roster bind:checked />
</div>
