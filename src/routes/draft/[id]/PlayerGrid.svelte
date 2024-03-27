<script lang="ts">
	import Icon from '@iconify/svelte';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { Player } from '../../types';
	import favorites from './favorites';
	import PlayerGridHeader from './PlayerGridHeader.svelte';

	let parsedFavorites: String[] = JSON.parse($favorites)
	export let players: Player[];
	export let draft;
	export let currentPick;
	export let positionFilter: 'ALL' | 'QB' | 'RB' | 'WR' | 'TE' | 'K' ;
	let submitted = false;
	$: onClock =
		$page.data.session.user.id === currentPick.teams.manager &&
		draft.status === 'ACTIVE' &&
		!submitted;

	const addPlayerToFavorites = (player: Player) => {
		parsedFavorites.push(player.name_id);
		favorites.set(JSON.stringify(parsedFavorites))
		parsedFavorites = JSON.parse($favorites)
	};

	const removePlayerFromFavorites = (player: Player) => {
		const index = parsedFavorites.indexOf(player.name_id);
		if (index > -1) {
			parsedFavorites.splice(index, 1);
		}
		favorites.set(JSON.stringify(parsedFavorites))
		parsedFavorites = JSON.parse($favorites)
	};
	
</script>

<div class="w-full table-container text-white bg-black">
	<PlayerGridHeader bind:positionFilter={positionFilter}/>
	<div class="grid gap-y-4 w-full bg-black basis-2/3 pt-4">
		{#each players as player}
		<div class="flex items-center">
			
			{#if parsedFavorites.includes(player.name_id)}
				<button on:click={removePlayerFromFavorites(player)}><Icon icon="clarity:heart-solid" class="ml-8 mr-4"/></button>
			{:else}
				<button on:click={addPlayerToFavorites(player)}><Icon icon="clarity:heart-line" class="ml-8 mr-4"/></button>
			{/if}
			
		</div>
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

			<div class="flex justify-end items-center pr-8">
				<form
					method="POST"
					action="?/draft"
					use:enhance={({ form, data, action, cancel }) => {
						submitted = true;
						//add roster_limits to the form data
						data.set('player_id', player.name_id);
						data.set('draft', JSON.stringify(draft));
						//add size to the form data as an
						return async ({ result, update }) => {
							setTimeout(() => {
								submitted = false;
							}, 1000);
						};
					}}
				>
					<button type="submit" class="btn btn-circle btn-primary" disabled={!onClock}>+</button>
				</form>
			</div>
		{/each}
	</div>
</div>

<style>
	.grid {
		grid-template-columns: auto auto auto 1fr;
	}

	.table-container {
		overflow-y: auto; /* Enables vertical scrolling */
		max-height: 50vh;
		height: 50vh;
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
