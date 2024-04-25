<script>
	import AvailablePlayers from './AvailablePlayers.svelte';
	import WaiverClaims from './WaiverClaims.svelte';
	import PlayerModal from '../PlayerModal.svelte';
	export let data;

	const {team } = data;
	$: waiver_requests = data.waiver_requests;
	$: league = data.league;
	$: players = league.player_leagues.map((player) => {
		const waiver_request_exists = waiver_requests.find(
			(w) => w.add_player_leagues_id === player.id
		);
		player.waiver_request = waiver_request_exists ? true : false;
		return player;
	});

	

	let draftStatus = league?.drafts?.status;
	
	$: unRosteredPlayers = players.filter((player) => player.rostered === false);
	
	$: console.log(unRosteredPlayers[0])
	$: unRosteredPlayers.sort((a, b) => b.players.fpts - a.players.fpts);
	
	$: rosterSize = Object.values(JSON.parse(league.roster_limits)).reduce(
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

	$: modalPlayer = null;
</script>

<div class="flex lg:flex-row flex-col">
	<div class="lg:basis-1/3  lg:block">
		<WaiverClaims {claims}/>
	</div>
	<div class="basis-1 grow lg:basis-2/3">
		<AvailablePlayers {team} {rosterSize} {unRosteredPlayers} {draftStatus} bind:modalPlayer/>
	</div>
</div>

<PlayerModal player={modalPlayer} week={league.seasons.week}/>