<script>
	import { calculateFpts, calculateWeekFpts } from '$lib/helpers';
	import PlayerModal from '../PlayerModal.svelte';
	import PlayerUpdates from './PlayerUpdates.svelte';
	import Roster from './Roster.svelte';
	export let data;
	//const { team } = data;
	//const { league } = data;
	$: team = data.team;
	$: league = data.league;
	$: console.log(team)
	$: team.player_leagues.map(pl => {
		pl.players.fpts = calculateFpts(pl.players);
		pl.players.weekPts = calculateWeekFpts(pl.players, league.seasons.week);
	})

	
	$: modalPlayer = null;


</script>

<div class="flex">
    <div class="basis-1/3 hidden lg:block">
		<PlayerUpdates />
	</div>
	<div class="lg:basis-2/3">
		<Roster {team} roster_spots={JSON.parse(league.roster_limits)} bind:modalPlayer={modalPlayer}/>
	</div>
	
</div>

<PlayerModal player={modalPlayer} week={league.seasons.week}/>