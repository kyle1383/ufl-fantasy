<script lang="ts">
	import type { Player } from '$lib/types';
	export let player: Player;
	export let away: boolean = false;
</script>

{#if player !== null}
	<div class="flex {away ? 'flex-row-reverse' : ''} md:w-full">
		<div class="my-auto">
			<div class="flex items-center justify-center hidden md:block">
				<div class="w-10 h-10 rounded-full overflow-hidden bg-cover {away ? 'ml-2' : 'mr-2'}">
					<img
						src={player?.players.img_url}
						alt={player?.players.name}
						class="w-full h-full object-cover"
					/>
				</div>
			</div>
		</div>
		<div class="flex flex-col justify-center {away ? 'text-right' : ''}">
			<p class="text-sm md:text-lg">{player?.players.name}</p>
			<span class="hidden md:block text-xs">
				{`${player?.players.ufl_teams.city} ${player?.players.ufl_teams.name}`}</span
			>
		</div>
		<div class="grow mx-2 md:mx-4 flex {away ? 'justify-start' : 'justify-end'} items-center">
			<p class="font-bold text-xl">{player?.score}</p>
		</div>
	</div>
{:else}
	<div class="flex {away ? 'flex-row-reverse' : ''} w-fit w-full justify">
		<div class="my-auto hidden md:block">
			<div class="flex items-center justify-center">
				<div class="w-10 h-10 rounded-full overflow-hidden bg-cover {away ? 'ml-2' : 'mr-2'}">
					<img
						src="https://res.cloudinary.com/xfl-production/image/upload/c_thumb,g_face,w_120/r_max/v1669141695/xfl-prod/headshots/no-avatar_dyafk8.png"
						alt="Empty avatar"
						class="w-full h-full object-cover"
					/>
				</div>
			</div>
		</div>
		<div class="flex flex-col justify-center {away ? 'text-right' : ''}">
			<p>Empty</p>
			<span class="text-xs">
				</span
			>
		</div>
		<div class="grow mx-2 md:mx-4 flex {away ? 'justify-start' : 'justify-end'} items-center">
			<p class="font-bold text-xl">-</p>
		</div>
	</div>
{/if}
