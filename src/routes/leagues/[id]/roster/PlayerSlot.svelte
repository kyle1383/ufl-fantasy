<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import StatsDisplay from '$lib/StatsDisplay.svelte';
	import { calculateFantasyScore } from '$lib/helpers';

	// @ts-nocheck
	export let position;
	export let depth;
	export let player;
	export let checked = false;
	export let swapDepth = 0;
	export let swapPosition = 'BENCH';
	export let swapOutPlayer = null;
	export let modalPlayer;
	export let roster_lock;
	let loading = false;
	
	
	
</script>

{#if player !== 'null'}
	<div class="my-auto">
		<button
			on:click={() => {
				swapPosition = position;
				swapDepth = depth;
				swapOutPlayer = player;
				checked = true;
			}}
			disabled={roster_lock}
			class={`text-${position} btn-xs border-2 rounded-lg btn w-full btn-outline bg-gray-700  border-gray-600 disabled:bg-gray-700`}
		>
			{position}
		</button>
	</div>
	<button class="flex" on:click={() => {modalPlayer=player.players
		
	}}>
		<div class="my-auto">
			<div class="flex items-center justify-center">
				<div class="w-10 h-10 rounded-full overflow-hidden bg-cover mr-2">
					<img src={player.players.img_url} alt={player.players.name} class="w-full h-full object-cover" />
				</div>
			</div>
		</div>
		<div class="flex flex-col justify-start text-left">
			<p>{player.players.name}</p>
			<span class="text-xs">
				{`${player.players.position} ${player.players.ufl_teams.city} ${player.players.ufl_teams.name}`}</span
			>
		</div>
	</button>
	<div>{player.players.weekPts || 0}</div>
{:else}
	<div>
		<button
			on:click={() => {
				swapPosition = position;
				swapDepth = depth;
				swapOutPlayer = player;
				checked = true;
			}}
			class={`text-${position} btn-xs btn-outline border-2 rounded-lg bg-gray-700 border-gray-600 btn w-full `}
		>
			{position}
		</button>
	</div>

	<div class="flex items-center">
		<div class="w-10 rounded-full">
			<img
				src="https://res.cloudinary.com/xfl-production/image/upload/c_thumb,g_face,w_120/r_max/v1669141695/xfl-prod/headshots/no-avatar_dyafk8.png"
				alt="Empty avatar"
				class="w-8 h-8"
			/>
		</div>
		<div >Empty</div>
	</div>
	<div />
{/if}

