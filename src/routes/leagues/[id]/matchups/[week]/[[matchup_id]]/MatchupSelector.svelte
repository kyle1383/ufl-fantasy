<script lang="ts">
	import { calculateFantasyScore } from '$lib/helpers';
	import type { PlayerLeague, Matchup } from '$lib/types';

	export let matchups: Matchup[];
    console.log(matchups[1].team_2)
	$: matchups.map((m) => {
		m.team_1.player_leagues.forEach((player: PlayerLeague) => {
			player.score = calculateFantasyScore(player);
		});
		m.team_2.player_leagues.forEach((player: PlayerLeague) => {
			player.score = calculateFantasyScore(player);
		});
	});
	$: matchups.map((m) => {
		m.team_1.score =
			Math.round(m.team_1.player_leagues.reduce((acc, player) => acc + player.score, 0) * 100) /
			100;

		m.team_2.score =
			Math.round(m.team_2.player_leagues.reduce((acc, player) => acc + player.score, 0) * 100) /
			100;
	});
</script>

<div class="md:border-l-[1px] border-gray-700 h-full py-8 md:pl-8 text-white">
	<p class="text-xl font-bold pb-4">League Matchups</p>
	{#if matchups.length === 0}
		<p>No other matchups found</p>
	{/if}
	{#each matchups as matchup}
		<a
			class="grid items-center grid-cols-3 text-white bg-gray-700 p-8 rounded-lg border-gray-600 border-2 my-4 text-xl hover:bg-gray-500"
			href="/leagues/{matchup.league_id}/matchups/{matchup.week}/{matchup.id}"
		>
			<div class="flex items-center justify-between">
				<p class="text-lg flex flex-col">
					<span class="text-xs">{matchup.team_1.manager ? matchup.team_1.profiles.username || matchup.team_1.profiles.full_name : '-'}</span
					>{matchup.team_1.name}
				</p>
				<p class="mx-2">{matchup.team_1.score}</p>
			</div>
			<p class="text-center mx-4">VS</p>
			<div class="flex items-center justify-between">
				<p class="mx-2">{matchup.team_2.score}</p>
				<p class="text-lg flex flex-col text-right">
					<span class="text-xs">{matchup.team_2.profiles ? matchup.team_2.profiles.username || matchup.team_2.profiles.full_name : '-'}</span
					>{matchup.team_2.name}
				</p>
			</div>
		</a>
	{/each}
</div>

<style>
	.grid {
		grid-template-columns: 1fr auto 1fr;
	}
</style>
