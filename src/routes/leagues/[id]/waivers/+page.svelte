<script>
	import AvailablePlayers from './AvailablePlayers.svelte';
	import WaiverClaims from './WaiverClaims.svelte';

	export let data;

	const { league, team, waiver_requests } = data;
	let players = league.player_leagues;

	players = players.map((player) => {
		const waiver_request_exists = waiver_requests.find(
			(w) => w.add_player_leagues_id === player.id
		);
		player.waiver_request = waiver_request_exists ? true : false;
		return player;
	});

	const unRosteredPlayers = players.filter((player) => player.rostered === false);
	
	const rosterSize = Object.values(JSON.parse(league.roster_limits)).reduce(
		(acc, cur) => acc + cur,
		0
	);

	$: claims = waiver_requests.map((claim) => {
		const player_add = players.find((p) => p.id === claim.add_player_leagues_id).players;
		const player_drop = claim.drop_player_leagues_id ? players.find((p) => p.id === claim.drop_player_leagues_id).players : null;
		return {
			...claim,
			player_add,
			player_drop,
		};
	});
</script>

<div class="flex">
	<div class="basis-1/3">
		<WaiverClaims {claims}/>
	</div>
	<div class="basis-2/3">
		<AvailablePlayers {team} {rosterSize} {unRosteredPlayers} />
	</div>
</div>
