<script lang="ts">
	import Icon from '@iconify/svelte';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { Player } from '$lib/types';
	import favorites from './favorites';
	import PlayerGridHeader from './PlayerGridHeader.svelte';
	import StatsDisplay from '$lib/StatsDisplay.svelte';

	let parsedFavorites: String[] = JSON.parse($favorites);
	export let players: Player[];
	
	export let draft;
	export let currentPick;
	export let positionFilter: 'ALL' | 'QB' | 'RB' | 'WR' | 'TE' | 'K';
	let submitted = false;
	$: onClock =
		$page.data.session.user.id === currentPick?.teams.manager &&
		draft.status === 'ACTIVE' &&
		!submitted;

	const addPlayerToFavorites = (player: Player) => {
		parsedFavorites.push(player.id);
		favorites.set(JSON.stringify(parsedFavorites));
		parsedFavorites = JSON.parse($favorites);
	};

	const removePlayerFromFavorites = (player: Player) => {
		const index = parsedFavorites.indexOf(player.id);
		if (index > -1) {
			parsedFavorites.splice(index, 1);
		}
		favorites.set(JSON.stringify(parsedFavorites));
		parsedFavorites = JSON.parse($favorites);
	};

</script>

<div class="w-full table-container text-white bg-black lg:pl-8">
	<PlayerGridHeader bind:positionFilter />
	<div class="grid gap-y-4 w-full bg-black basis-2/3 pt-4">
		{#each players as player}
	
			<div class="flex items-center">
				{#if parsedFavorites.includes(player.id)}
					<button on:click={removePlayerFromFavorites(player)}
						><Icon icon="clarity:heart-solid" class="ml-8 mr-4" /></button
					>
				{:else}
					<button on:click={addPlayerToFavorites(player)}
						><Icon icon="clarity:heart-line" class="ml-8 mr-4" /></button
					>
				{/if}
			</div>
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
			<div class="lg:block hidden"><StatsDisplay {player}/></div>
			<div class="flex justify-end items-center pr-8">
				<form
					method="POST"
					action="?/draft"
					use:enhance={({ form, data, action, cancel }) => {
						submitted = true;
						//add roster_limits to the form data
						data.set('player_id', player.id);
						data.set('draft', JSON.stringify(draft));
						//add size to the form data as an
						return async ({ result, update }) => {
							if (result.type === 'failure') {
								if (result.data?.error_message) {
									alert(result.data.error_message);
								} else {
									alert('Error selecting player');
								}
							}
							setTimeout(() => {
								submitted = false;
							}, 1000);
						};
					}}
				>
					<button type="submit" class="btn btn-circle btn-primary" disabled={!onClock}>+</button>
				</form>
			</div>
			<div class="stat-display lg:hidden"><StatsDisplay {player} /></div>
		{/each}
	</div>
</div>

<style>
	.stat-display{
		grid-column: 1/-1;
	}
	.grid {
		grid-template-columns: auto auto auto  1fr;
		@media (min-width: 1024px) {
		grid-template-columns: auto auto auto  1fr auto;
		}
	}

	.table-container {
		overflow-y: auto; /* Enables vertical scrolling */
		max-height: 50vh;
		height: 50vh;
		overscroll-behavior: none;
	}

	.table-container::-webkit-scrollbar {
		display: none;
	}

	thead th,
	td {
		background-color: #000;
		border-color: #1d1d1d;
	}
</style>
