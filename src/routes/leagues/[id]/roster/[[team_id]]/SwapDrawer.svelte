<script>
	// @ts-nocheck
	import Icon from '@iconify/svelte';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { clickOutside } from '$lib/helpers';
	// @ts-nocheck

	export let position;
	export let depth;
	export let swapPlayers;
	export let swapOutPlayer;
	export let newPlayers;
	export let roster;
	export let checked;
	let loading = '';
	$: swapOutPlayer;
	$: swapPlayers
	$: swapPlayers = swapPlayers?.filter((p) => p.id !== swapOutPlayer?.id);

	//check for click event outside of modal
	function handleClickOutside(event) {
		checked ? (checked = false) : null;
	}
</script>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="swap-modal" class="modal-toggle" {checked} />
<div class="modal modal-bottom sm:modal-middle cursor-pointer">
	<div
		class="modal-box text-white bg-gray-700 p-8 rounded-b-0 rounded-t-lg lg:rounded-lg border-gray-600 border-2"
		use:clickOutside
		on:click_outside={handleClickOutside}
	>
		<h3 class="font-bold text-lg py-4">
			Replacing <span
				class="text-{position} border-2 rounded-lg bg-gray-700 border-gray-600 py-1 text-sm px-2"
				>{position}</span
			>
		</h3>
		{#each swapPlayers as player}
			<form
				method="post"
				action="?/updateRosterPosition"
				class="flex"
				use:enhance={({ form, data, action, cancel }) => {
					data.set('player', JSON.stringify(player));
					data.set('swapOutPlayer', JSON.stringify(swapOutPlayer));
					data.set('position', position);
					data.set('depth', depth);
					loading = 'loading';
					return async ({ result, update }) => {
						//close modal if result okay
						if (result.type === 'success') {
							checked = false;
							const updatedPlayers = result.data.players;
							let modifiedPlayers = newPlayers.map((player) => {
								const updatedPlayer = updatedPlayers.find(
									(updatedPlayer) => updatedPlayer.id === player.id
								);
								if (updatedPlayer) {
									player.team_position = updatedPlayer.team_position;
									player.depth = updatedPlayer.depth;
								}
								return player;
							});
							newPlayers = modifiedPlayers;
							roster = roster;
						} else {
							alert(result.data.error_message);
						}
					};
				}}
			>
				<button class="w-full">
					<div class="grid flex-row items-center">
						<div
							class={`text-${player.team_position} btn-xs border-2 rounded-lg btn btn-outline bg-gray-700  border-gray-600 min-w-16 mr-4 `}
						>
						
							{player.team_position}
					</div>
						<div class="flex items-center justify-center">
							<div class="w-10 h-10 rounded-full overflow-hidden bg-cover mr-4">
								<img
									src={player.players.img_url}
									alt={player.name}
									class="w-full h-full object-cover"
								/>
							</div>
						</div>
						<div class="flex flex-col items-start">
							<p>{player.players.name}</p>
							<span class="text-xs">
								{`${player.players.ufl_teams.city} ${player.players.ufl_teams.name}`}
							</span>
						</div>
					</div>
				</button>
				<p>{player.players.weekPts || 0}</p>
			</form>
		{/each}
	</div>
</div>

<style>
	.grid{
		grid-template-columns: auto auto 1fr;
	}
</style>