<script lang="ts">
	import type { Matchup } from '$lib/types';
	import { findPlayer } from '$lib/helpers';
	import MatchupSlot from './MatchupSlot.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	export let matchup: Matchup;
	export let rosterSpots: any;
	export let supabase: SupabaseClient;
	const home = matchup.team_1;
	const away = matchup.team_2;

	home.player_leagues.forEach(player => {
		player.score = calculateScore(player)
	})
	away.player_leagues.forEach(player => {
		player.score = calculateScore(player)
	})

	const homeTotal = Math.round(home.player_leagues.reduce((acc, player) => acc + player.score, 0) *100) /100
	const awayTotal = Math.round(away.player_leagues.reduce((acc, player) => acc + player.score, 0) * 100) /100
	function calculateScore(player) {
		if (!player.stats) return 0
		const passingYardsPoints = player.stats.passing?.yards/25 || 0
		const passingTouchdownPoints = player.stats.passing?.touchdowns*4 || 0
		const rushingYardsPoints = player.stats.rushing?.yards/10 || 0
		const rushingTouchdownPoints = player.stats.rushing?.touchdowns*6 || 0
		const receivingYardsPoints = player.stats.receiving?.yards/10 || 0
		const receivingTouchdownPoints = player.stats.receiving?.touchdowns*6 || 0
		const fumblePoints = player.stats.fumbles?.lost*-2 || 0
		const missedFieldGoalPoints = player.stats.kicking?.missed*-1 || 0
		const kickingPoints = player.stats.kicking?.made_19*3 + player.stats.kicking?.made_29*3 + player.stats.kicking?.made_39*3 + player.stats.kicking?.made_49*4 + player.stats.kicking?.made_50*5 || 0
		const total = Math.round((passingYardsPoints + passingTouchdownPoints + rushingYardsPoints + rushingTouchdownPoints + receivingYardsPoints + receivingTouchdownPoints + fumblePoints + missedFieldGoalPoints + kickingPoints) *100) /100
		
		return total
	}
	/*const picks_channel = supabase
		.channel('picks-channel')
		.on('postgres_changes', { event: '*', schema: 'public', table: 'picks' }, (payload) => {
			{
				if (payload.eventType === 'UPDATE') {
					
				}
			}
		})
		.subscribe();*/
	
</script>

<div class="flex justify-center py-8">
	<div class="grid gap-x-4 gap-y-4 basis-2/3 justify-center">
			
			<div class="flex justify-center flex-col items-center">
				<p class="text-2xl pb-2">{home.name}</p>
				<p class="font-bold text-2xl">{homeTotal}</p>
			</div>
			<div class="flex justify-center">
				<p class="font-bold text-2xl"></p>
			</div>
			<div class="flex justify-center flex-col items-center">
				<p class="text-2xl pb-2">{away.name}</p>
				<p class="font-bold text-2xl">{awayTotal}</p>
			</div>
		
		{#each Object.keys(rosterSpots) as position}
			{#each Array.from({ length: rosterSpots[position] }, (_, index) => index + 1) as depth}
				<MatchupSlot
					{position}
					{depth}
					players={{
						home: findPlayer(position, depth, home.player_leagues),
						away: findPlayer(position, depth, away.player_leagues)
					}}
				/>
			{/each}
		{/each}
	</div>
	<div class="basis-1/3">This will show all league matchups</div>
</div>

<style>
	.grid {
		grid-template-columns: minmax(auto, max-content) minmax(auto, max-content) minmax(
				auto,
				max-content
			);
	
	}
</style>
