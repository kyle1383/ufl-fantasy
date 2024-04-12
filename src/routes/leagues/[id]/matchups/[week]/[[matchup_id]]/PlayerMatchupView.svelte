<script lang="ts">
	import type { Player } from '$lib/types';
	export let player: Player;
	export let away: boolean = false;
	
</script>

<div class="flex {away ? 'flex-row-reverse' : ''} w-full">
	<div class="my-auto">
		<div class="flex items-center justify-center">
			<div class="w-10 h-10 rounded-full overflow-hidden bg-cover {away ? 'ml-2' : 'mr-2'}">
				<img
					src={player.players.img_url}
					alt={player.players.name}
					class="w-full h-full object-cover"
				/>
			</div>
		</div>
	</div>
	<div class="flex flex-col justify-center {away ? 'text-right' : ''}">
		<p>{player.players.name}</p>
		<span class="text-xs">
			{`${player.players.ufl_teams.city} ${player.players.ufl_teams.name}`}</span
		>
	</div>
	<div class="grow mx-4 flex {away ? 'justify-start' : 'justify-end'} items-center">
		<p class="font-bold text-xl">{player.score}</p>
	</div>
</div>
