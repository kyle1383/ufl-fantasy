<script>
	import DropModal from './DropModal.svelte';
	import PlayerRow from './PlayerRow.svelte';
	import { fade } from 'svelte/transition';
	export let data;

	const { league, team, waiver_requests } = data;
	let players = league[0].player_leagues;
	
	
	players = players.map((player) =>{
		const waiver_request_exists = waiver_requests.find(w => w.add_player_leagues_id === player.id)
		player.waiver_request = waiver_request_exists ? true : false;
		return player;
	})
	
	const unRosteredPlayers = players.filter((player) => player.rostered === false);
	const rosterSize = Object.values(JSON.parse(league[0].roster_limits)).reduce(
		(acc, cur) => acc + cur,
		0
	);
	$: toast = null;
	$: addPlayer = null;
	$: checked = false;

	function showToast(value){
		toast = value;
		setTimeout(() => {
			toast = null;
		}, 3000);
	
	}
</script>

<table class="table w-full">
	<thead>
		<tr>
			<th>Name</th>
			<th>Team</th>
			<th />
		</tr>
	</thead>
	<tbody>
		{#each unRosteredPlayers as player}
			<PlayerRow
				player={player.players}
				waiver={player.waiver}
				waiver_request={player.waiver_request}
				{rosterSize}
				{team}
				bind:checked
				bind:addPlayer
			/>
		{/each}
	</tbody>
</table>

<DropModal player={addPlayer} bind:checked {team} {rosterSize} {showToast}/>

{#if toast}
	<div class="toast toast-center w-max" transition:fade={{duration: 100}}>
		<div class="alert bg-primary text-white min-w-xl">
			<span>{toast}</span>
		</div>
	</div>
{/if}
