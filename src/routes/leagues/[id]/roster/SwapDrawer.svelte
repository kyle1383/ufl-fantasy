<script>
	// @ts-nocheck

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

	//check for click event outside of modal
	function handleClickOutside(event) {
		checked ? (checked = false) : null;
	}
</script>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="swap-modal" class="modal-toggle" {checked} />
<div class="modal modal-bottom sm:modal-middle cursor-pointer">
	<div class="modal-box" use:clickOutside on:click_outside={handleClickOutside}>
		<h3 class="font-bold text-lg">{position}{depth}</h3>
		{#each swapPlayers as player}
			<form
				method="post"
				action="?/updateRosterPosition"
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
							console.log(result);
						}
					};
				}}
			>
				<button class="w-full">
					<div class="flex flex-row">
						<div class="w-10 rounded-full">
							<img src={player.players.img_url} alt={player.players.name} class="w-8 h-8" />
						</div>
						<div class="break-words">
							<p>{player.players.name}</p>
							<sub class="font">
								{`${player.players.xfl_teams.city} ${player.players.xfl_teams.name}`}
							</sub>
						</div>
					</div>
				</button>
			</form>
		{/each}
	</div>
</div>
