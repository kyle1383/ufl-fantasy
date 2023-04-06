<script>
	// @ts-nocheck

	/**
	 * @type {{ player_instances: any; }}
	 */
	import { enhance } from '$app/forms';
	export let team;
	export let roster_limits;
	let positions = team.positions;
	const players = team.player_instances;

	positions = positions.filter((pos) => {
		if (pos.player_teams_id !== null) {
			pos.player = players.find((player) => player.id === pos.player_teams_id);
		}
		if (pos.position !== 'BENCH') {
			return pos;
		}
	});

	positions = positions.sort((a, b) => {
		const positionOrder= {'QB': 1, 'RB': 2,'WR': 3, 'TE':4, 'FLEX': 5, 'K': 6}
		const positionCompare =  positionOrder[a.position] - positionOrder[b.position]
		if (positionCompare !== 0){
			return positionCompare; 
		}

		return a.depth - b.depth
	})

	//order players by position 
	console.log(positions)

	function findPlayersByPosition(position) {
		return players.filter((player) => player.players.position === position);
	}

	//set all players without positions as bench 
	//todo remove bench caveats
</script>

<div class="overflow-x-auto">
	<table class="table w-full">
		<tbody>
			{#each positions as pos}
				{#if pos.player_teams_id === null}
					<tr>
						<td>
							<div class="dropdown">
								<button
									class={`text-${pos.position} btn-xs border-2 rounded-lg border-${pos.position}`}
									>{pos.position}</button
								>
								<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
								<ul tabindex="0" class="dropdown-content menu p-2 shadow rounded-box w-52">
									{#each findPlayersByPosition(pos.position) as player}
										<li class=" w-full">
											<form
												action="roster?/updateRosterPosition"
												method="POST"
												use:enhance={({ form, data, action, cancel }) => {
													//add size to the form data as an
													data.set('position', JSON.stringify(pos));
													data.set('player', JSON.stringify(player));
													return async ({ result, update }) => {};
												}}
											>
												<button>
													<td class="whitespace-normal bg-white">
														<div class="w-10 rounded-full bg-white">
															<img
																src={player.players.img_url}
																alt={player.players.name}
																class="w-8 h-8"
															/>
														</div>
														<div class="text-black">
															<p>{player.players.name}</p>
															<sub class="font">
																{`${player.players.xfl_teams.city} ${player.players.xfl_teams.name}`}</sub
															>
														</div></td
													>
												</button>
											</form>
										</li>
									{/each}
								</ul>
							</div>
						</td>
						<td>Empty</td>
						<td />
					</tr>
				{:else}
					<tr>
						<td>
							<div class="dropdown">
								<button
									class={`text-${pos.position} btn-xs border-2 rounded-lg border-${pos.position}`}
									>{pos.position}</button
								>
								<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
								<ul tabindex="0" class="dropdown-content menu p-2 shadow rounded-box w-52">
									{#each findPlayersByPosition(pos.position) as player}
										<li class=" w-full">
											<form
												action="roster?/updateRosterPosition"
												method="POST"
												use:enhance={({ form, data, action, cancel }) => {
													//add size to the form data as an
													data.set('position', JSON.stringify(pos));
													data.set('player', JSON.stringify(player));
													return async ({ result, update }) => {};
												}}
											>
												<button>
													<td class="whitespace-normal bg-white">
														<div class="w-10 rounded-full bg-white">
															<img
																src={player.players.img_url}
																alt={player.players.name}
																class="w-8 h-8"
															/>
														</div>
														<div class="text-black">
															<p>{player.players.name}</p>
															<sub class="font">
																{`${player.players.xfl_teams.city} ${player.players.xfl_teams.name}`}</sub
															>
														</div></td
													>
												</button>
											</form>
										</li>
									{/each}
								</ul>
							</div>
						</td>
						<td class="whitespace-normal">
							<div class="w-10 rounded-full">
								<img
									src={pos.player.players.img_url}
									alt={pos.player.players.name}
									class="w-8 h-8"
								/>
							</div>
						</td>
						<td class="break-words"
							><p>{pos.player.players.name}</p>
							<sub class="font">
								{`${pos.player.players.xfl_teams.city} ${pos.player.players.xfl_teams.name}`}</sub
							></td
						>
					</tr>
				{/if}
			{/each}
			{#each players as { players: player }}
				<tr>
					<td>
						<button class={`text-BENCH btn-xs border-2 rounded-lg border-BENCH`}>BENCH</button>
					</td>
					<td class="whitespace-normal">
						<div class="w-10 rounded-full">
							<img src={player.img_url} alt={player.name} class="w-8 h-8" />
						</div>
					</td>
					<td class="break-words"
						><p>{player.name}</p>
						<sub class="font"> {`${player.xfl_teams.city} ${player.xfl_teams.name}`}</sub></td
					>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
