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
	export let modalPlayer;

	//drawer initial values
	$: players = team.player_leagues;
	$: newPlayers = team.player_leagues;
	$: roster = roster_spots;
	$: swapPosition = 'QB';
	$: swapDepth = 1;
	$: swapPlayers = players.filter((player) =>
		swapPosition === 'FLEX'
			? player.players.position === 'RB' ||
			  player.players.position === 'TE' ||
			  player.players.position === 'WR'
			: player.players.position === swapPosition
	);
	$: checked = false;
	$: swapOutPlayer = null;

	$: team;
	$: openBenchSpots =
		roster.BENCH - players.filter((player) => player.team_position === 'BENCH').length;
</script>

<p class="text-xl font-bold pt-4 text-white">Roster</p>
<div class="grid gap-x-8 gap-y-4 pt-4 pb-24">
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
					bind:modalPlayer
				/>
			{/each}
		{/if}
	{/each}

	{#each newPlayers as player}
		{#if player.team_position === 'BENCH'}
			<PlayerSlot position={player.team_position} depth={0} {player} bind:modalPlayer/>
		{/if}
	{/each}
	{#if openBenchSpots > 0}
		{#each Array.from({ length: openBenchSpots }, (_, index) => index + 1) as depth}
			<PlayerSlot position="BENCH" depth={0} player="null" bind:modalPlayer/>
		{/each}
	{/if}
</div>

<SwapDrawer
	position={swapPosition}
	depth={swapDepth}
	{swapPlayers}
	{swapOutPlayer}
	bind:newPlayers
	bind:roster
	bind:checked
/>

<style>
	.grid {
		grid-template-columns: auto auto 1fr;
		
		
		grid-auto-rows: minmax(40px, auto);
	}
</style>
