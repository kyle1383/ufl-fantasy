<script lang="ts">
	import Matchup from './Matchup.svelte';
	import { page } from '$app/stores';
	export let data;

	const { matchups, league, supabase } = data;
	let currentMatchup;
	const matchupID = $page.params.matchup_id;
	if (matchupID) {
		currentMatchup = matchups.find((matchup) => matchup.id === matchupID);
	} else {
		const user = $page.data.session.user;
		const userMatchup = matchups.find(
			(matchup) => matchup.team_1.manager === user.id || matchup.team_2.manager === user.id
		);
		currentMatchup = userMatchup;
	}
</script>

<Matchup matchup={currentMatchup} rosterSpots={JSON.parse(league.roster_limits)} {supabase} />
