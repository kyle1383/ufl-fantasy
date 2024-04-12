<script>
	import PlayerUpdates from './PlayerUpdates.svelte';
	import Roster from './Roster.svelte';
	export let data;
	//const { team } = data;
	//const { league } = data;
	$: team = data.team;
	$: league = data.league;

</script>

<div class="flex">
    <div class="basis-1/3 hidden lg:block">
		<PlayerUpdates />
	</div>
	<div class="lg:basis-2/3">
		<Roster {team} roster_spots={JSON.parse(league.roster_limits)} />
	</div>
	
</div>
