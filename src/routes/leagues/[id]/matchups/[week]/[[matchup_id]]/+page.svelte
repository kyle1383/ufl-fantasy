<script lang="ts">
	import Matchup from './Matchup.svelte';
	import MatchupSelector from './MatchupSelector.svelte';
	import { page } from '$app/stores';
	export let data;

	const { matchups, league, supabase } = data;
	let currentMatchup;
	$: matchupID = $page.params.matchup_id;
	$: if (matchupID) {
		currentMatchup = matchups.find((matchup) => matchup.id === parseInt(matchupID));
	} else {
		const user = $page.data.session.user;
		const userMatchup = matchups.find(
			(matchup) => matchup.team_1.manager === user.id || matchup.team_2.manager === user.id
		);
		currentMatchup = userMatchup;
	}
	
	$: unselectedMatchups = matchups.filter((matchup) => matchup.id !== currentMatchup.id) || [];
</script>

<div class="flex justify-center flex-col md:flex-row ">
	<div class="grid gap-x-2 md:gap-x-4 gap-y-4 basis-1 md:basis-2/3 justify-center py-8">
		<Matchup matchup={currentMatchup} rosterSpots={JSON.parse(league.roster_limits)} {supabase} />
	</div>

	<div class="basis-1 md:basis-1/3">
	<MatchupSelector matchups={unselectedMatchups}/></div>
</div>

<style>
	.grid {
		grid-template-columns: minmax(auto, max-content) minmax(auto, max-content) minmax(
				auto,
				max-content
			);
		@media (max-width: 1024px) {
			grid-template-columns: 1fr minmax(auto, max-content) 1fr;
		}
	}
</style>

