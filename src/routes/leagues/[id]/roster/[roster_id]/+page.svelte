<script>
	/**
	 * This page should pull in all of the players for the current user.
	 * It will filter player_leagues by the league_id and the player id
	 */
	import Roster from '../Roster.svelte';

	export let data;
	const { team } = data;
	
</script>

<Roster {team} />