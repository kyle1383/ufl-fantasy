<script>
	// @ts-nocheck

	/**
	 * @type {{ player_instances: any; }}
	 */
	import { enhance } from '$app/forms';
	export let team;
	export let roster_limits;
	const positions = team.positions;
	const players = team.player_instances;
	console.log(team)
</script>

<div class="overflow-x-auto">
	<table class="table w-full">
		<tbody>
			{#each positions as pos}
				{#if pos.player_teams_id === null && pos.position !== 'BENCH'}
					<tr>
						<td>
							<button
								class={`text-${pos.position} btn-xs border-2 rounded-lg border-${pos.position}`}
								>{pos.position}</button
							>
						</td>
						<td>Empty</td>
						<td></td>
					</tr>
				{/if}
			{/each}
			{#each players as { players: player }}
				<tr>
					<td>
						<button
							class={`text-BENCH btn-xs border-2 rounded-lg border-BENCH`}
							>BENCH</button
						>
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
