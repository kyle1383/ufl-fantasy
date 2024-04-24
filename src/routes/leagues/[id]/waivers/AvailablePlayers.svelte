<script lang="ts">
	import type { Player, Team } from '$lib/types';
	import DropModal from './DropModal.svelte';
	import PlayerRow from './PlayerRow.svelte';
	import { fade } from 'svelte/transition';
	
	export let team: Team;
	export let rosterSize: number;
	export let unRosteredPlayers: { players: Player[]; waiver: boolean; waiver_request: boolean }[];
	export let draftStatus: string;
	export let modalPlayer: Player | null; 
	$: unRosteredPlayers;
	$: unRosteredPlayers = unRosteredPlayers.sort((a, b) => b.fpts - a.fpts);
	
	$: toast = null;
	$: addPlayer = null;
	$: checked = false;
	
	
	function showToast(value) {
		toast = value;
		setTimeout(() => {
			toast = null;
		}, 3000);
	}
</script>

<p class="text-xl font-bold pt-4 text-white">Available Players</p>
<div class="grid gap-y-4 w-full py-4 pb-24">
	{#each unRosteredPlayers as player}
		<PlayerRow
			player={player.players}
			waiver={player.waiver}
			waiver_request={player.waiver_request}
			{draftStatus}
			{rosterSize}
			{team}
			bind:checked
			bind:addPlayer
			bind:modalPlayer
		/>
	{/each}
</div>

<DropModal player={addPlayer} bind:checked {team} {rosterSize} {showToast} />

{#if toast}
	<div class="toast toast-center w-max" transition:fade={{ duration: 100 }}>
		<div class="alert bg-primary text-white min-w-xl">
			<span>{toast}</span>
		</div>
	</div>
{/if}

<style>
	.grid {
		grid-template-columns: auto auto 1fr;
		@media (min-width: 1024px) {
		grid-template-columns: auto auto auto  1fr;
		}
	}
</style>
