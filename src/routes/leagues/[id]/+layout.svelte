<script>
	import { page } from '$app/stores';
	import LeagueHeader from './LeagueHeader.svelte';
	//get last url paramater
	export let data;
	
	const {league, user_leagues} = data

	$: league.player_leagues.map(pl => {
		const player = pl.players ;
		const passingPts = player.g_passing?.reduce((acc, pStats) => acc + (pStats.touchdowns * 4 + pStats.yards/25 - pStats.interceptions * 2), 0);
		const rushingPts = player.g_rushing?.reduce((acc, rStats) => acc + (rStats.touchdowns * 6 + rStats.yards/10), 0);
		const receivingPts = player.g_receiving?.reduce((acc, rStats) => acc + (rStats.touchdowns * 6 + rStats.yards/10 + rStats.receptions), 0);
		const kickingPts = player.g_kicking?.reduce((acc, kStats) => acc + (kStats.made_19 * 3 + kStats.made_29 + kStats.made_39 * 3 + kStats.made_49 * 4 + kStats.made_50 * 5), 0);
		pl.players.fpts = Math.round((passingPts + rushingPts + receivingPts + kickingPts) * 100) / 100;
		
	})


</script>
<LeagueHeader week={league.seasons.week} matchups={league.matchups} commissioners={league.commissioners}/>
<div class="lg:mx-24 mx-8">
	
	<slot />
</div>
