<script lang="ts">
    import type { Player } from '$lib/types';
	import PlayerMatchupView from './PlayerMatchupView.svelte';
	export let position: string;
	export let depth: number;
	export let players: {home: Player, away: Player};

	
</script>

<PlayerMatchupView player={players.home} />
<div class="my-auto">
	<div
		class={`text-${position} btn-xs border-2 rounded-lg btn w-full btn-outline bg-gray-700  border-gray-600 `}
	>
		{position}
	</div>
</div>

<PlayerMatchupView player={players.away} away={true}/>
