<script lang="ts">
	import type { Team } from '$lib/types';
	import { page } from '$app/stores';
	export let teams: Team[];
	

	teams.sort((a, b) => {
		if (a.wins !== b.wins) {
			return b.wins - a.wins; // Sorting by priority first
		}
		return b.ptsFor - a.ptsFor
	});
</script>

<div class="text-white bg-gray-700 p-8 lg:w-fit rounded-lg border-gray-600 border-2">
	<p class="text-xl pb-4">Standings</p>

	<table class="grid w-full max-w-full md:gap-x-4 gap-y-0">
		<!-- head -->
		<th />
		<th />
		<th />
		<th />
		<th class="text-left text-small text-gray-300">pf</th>
		<th class="text-left text-small text-gray-300">pa</th>
		{#each teams as team, index}
			<td class="pl-0 mr-2 md:mr-0 pb-4"><p class="rounded-full">{index + 1}</p></td>
			<td class="bg-white font-bold" style="border-radius: 0 0 0 0.25rem"
				><a href={`/leagues/${$page.params.id}/roster/${team.id}`}>{team.name}</a></td
			>
			<td class="bg-white break-words">{team.manager_name}</td>

			<td class="bg-white w-max" style="border-radius: 0 0 0.25rem 0">{team.wins}-{team.losses}</td>
			<td class="bg-white w-max" style="border-radius: 0 0 0.25rem 0">{team.ptsFor || 0}</td>
			<td class="bg-white w-max" style="border-radius: 0 0 0.25rem 0">{team.ptsAgainst || 0}</td>
		{/each}
	</table>
</div>

<style>
	.grid {
		grid-template-columns: auto auto auto auto auto auto;
	}
	table th,
	td {
		background-color: transparent;

		@media (max-width: 1024px) {
			padding: 0.25rem;
		}
	}
</style>
