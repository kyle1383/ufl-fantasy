<script lang="ts">
	import type { Matchup, PlayerLeague } from '$lib/types';
	import { findPlayer, calculateFantasyScore, mergeArrays } from '$lib/helpers';
	import MatchupSlot from './MatchupSlot.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let matchup: Matchup;
	export let rosterSpots: any;
	export let supabase: SupabaseClient;

	$: matchup
	$: home = matchup.team_1;
	$: away = matchup.team_2;

	$: home.player_leagues.forEach((player: PlayerLeague) => {
		player.score = calculateFantasyScore(player);
	});
	$: away.player_leagues.forEach((player) => {
		player.score = calculateFantasyScore(player);
	});

	$: homeTotal =
		Math.round(home.player_leagues.reduce((acc, player) => acc + player.score, 0) * 100) / 100;
	$: awayTotal =
		Math.round(away.player_leagues.reduce((acc, player) => acc + player.score, 0) * 100) / 100;

	/*const picks_channel = supabase
		.channel('picks-channel')
		.on('postgres_changes', { event: '*', schema: 'public', table: 'picks' }, (payload) => {
			{
				if (payload.eventType === 'UPDATE') {
					
				}
			}
		})
		.subscribe();*/

	$: homeBench = home.player_leagues.filter(
		(player) => player.team_position === 'BENCH' || player.team_position === null
	);
	$: awayBench = away.player_leagues.filter(
		(player) => player.team_position === 'BENCH' || player.team_position === null
	);

	$: bench = mergeArrays(homeBench, awayBench);
</script>

<div class="flex justify-center flex-col items-center">
	<p class="text-2xl pb-2">{home.name}</p>
	<p class="font-bold text-2xl">{homeTotal}</p>
</div>
<div class="flex justify-center">
	<p class="font-bold text-2xl" />
</div>
<div class="flex justify-center flex-col items-center">
	<p class="text-2xl pb-2">{away.name}</p>
	<p class="font-bold text-2xl">{awayTotal}</p>
</div>

{#each Object.keys(rosterSpots) as position}
	{#if position !== 'BENCH'}
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
	{/if}
{/each}

{#each bench as benchPair}
	<MatchupSlot
		position={'BENCH'}
		depth={0}
		players={{
			home: benchPair.home,
			away: benchPair.away
		}}
	/>
{/each}

