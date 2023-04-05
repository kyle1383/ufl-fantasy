<script>
// @ts-nocheck

	/**
	 * @type {any}
	 */
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	/**
	 * @type {any}
	 */
	export let players;
	export let draft;
	export let currentPick;
	let submitted = false;
	$: onClock = $page.data.session.user.id === currentPick.teams.manager && draft.status === 'ACTIVE' && !submitted;
	
	
</script>
<div class="max-w-full w-full" style="max-width: 100%" >
	<table class="table w-full" style="max-width: 100%">
		<thead>
			<tr>
				<th/>
				<th>Name</th>
				<th />
			</tr>
		</thead>
		<tbody>
			{#each players as player}
				<tr>
					<td class="whitespace-normal">
						<div class="w-10 rounded-full">
							<img src={player.img_url} alt={player.name} class="w-8 h-8" />
						</div>
					</td>
					<td class="break-words"><p>{player.name}</p><sub class="font"><span class={`text-${player.position}`}>{player.position}</span> - {`${player.xfl_teams.city} ${player.xfl_teams.name}`}</sub></td>
					
				
					<td
						><form
							method="POST"
							action="?/draft"
							use:enhance={({ form, data, action, cancel }) => {
								submitted = true;
								//add roster_limits to the form data
								data.set('player_id', player.name_id);
								data.set('draft', JSON.stringify(draft) )
								//add size to the form data as an
								return async ({ result, update }) => {
									setTimeout(() => {
										submitted = false;
									}, 1000);
								};
							}}
						>
							<button type="submit" class="btn btn-circle btn-primary" disabled={!onClock}>+</button>
						</form></td
					>
				</tr>
			{/each}
		</tbody>
	</table>
	<div>{draft.status}</div>
</div>
