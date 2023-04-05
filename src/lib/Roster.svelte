<script>
	/**
	 * @type {{ player_instances: any; }}
	 */
	import { enhance } from '$app/forms';
	export let team;
</script>

<div class="overflow-x-auto">
	<table class="w-full">
		<thead>
			<tr>
				<th>Player</th>
				<th>Position</th>
				<th>Team</th>
			</tr>
		</thead>
		<tbody>
			{#each team.player_instances as {players: player}}
			<tr>
				<td>
					<button class={`text-${player.position} btn-xs border-2 rounded-lg border-${player.position}`}>{player.position}</button>
				</td>
				<td class="whitespace-normal">
					<div class="w-10 rounded-full">
						<img src={player.img_url} alt={player.name} class="w-8 h-8" />
					</div>
				</td>
				<td class="break-words"
					><p>{player.name}</p>
					<sub class="font"
						> {`${player.xfl_teams.city} ${player.xfl_teams.name}`}</sub
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
</div>
