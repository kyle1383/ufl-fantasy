<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Standings from './Standings.svelte';
	import Invite from './Invite.svelte';
	import Order from './Order.svelte';
	import DraftCard from './DraftCard.svelte';
	import type { Team } from '$lib/types';
	export let data;
	if (!data.league) {
		goto('/leagues');
	}

	$: league = data.league;
	$: teams = league.teams;
	$: teamStats = league.matchups.reduce((acc, matchup) => {
		// Initialize or update team 1
		if (!acc[matchup.team_id_1]) {
			acc[matchup.team_id_1] = { ptsFor: 0, ptsAgainst: 0 };
		}
		acc[matchup.team_id_1].ptsFor += matchup.team_1_final_score;
		acc[matchup.team_id_1].ptsAgainst += matchup.team_2_final_score;

		// Initialize or update team 2
		if (!acc[matchup.team_id_2]) {
			acc[matchup.team_id_2] = { ptsFor: 0, ptsAgainst: 0 };
		}
		acc[matchup.team_id_2].ptsFor += matchup.team_2_final_score;
		acc[matchup.team_id_2].ptsAgainst += matchup.team_1_final_score;

		return acc;
	}, {});

	$: teams.map((team) => {
		team.ptsFor = teamStats[team.id].ptsFor;
		team.ptsAgainst = teamStats[team.id].ptsAgainst;
	});

	$: managedTeams = teams.filter((t: Team) => t.manager !== null);
</script>

<div class="grid md:grid-cols-2 gap-4 lg:w-max my-8">
	{#if managedTeams.length < league.size}
		<Invite size={league.size} teams={managedTeams.length} />
	{/if}
	<DraftCard {league} />
	<Order {league} {teams} />
	<Standings {teams} />
</div>
