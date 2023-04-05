<script>
    import { enhance } from '$app/forms';
	export let data;
	const { league } = data;
	const players = league[0].player_instances;
	const filteredPlayers = players.filter((player) => player.rostered === false);
	console.log(filteredPlayers.length);
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
		{#each filteredPlayers as { players: player }}
			<tr>
				<td class="whitespace-normal">
					<div class="w-10 rounded-full">
						<img src={player.img_url} alt={player.name} class="w-8 h-8" />
					</div>
				</td>
				<td class="break-words"
					><p>{player.name}</p>
					<sub class="font"
						><span class={`text-${player.position}`}>{player.position}</span> - {`${player.xfl_teams.city} ${player.xfl_teams.name}`}</sub
					></td
				>
				<td>
					<form
						method="POST"
						action="?/add"
						use:enhance={({ form, data, action, cancel }) => {
							return async ({ result, update }) => {};
						}}
					>
						<button type="submit" class="btn btn-circle btn-primary">+</button>
					</form>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
