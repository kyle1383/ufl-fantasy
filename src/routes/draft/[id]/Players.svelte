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
	$: onClock =
		$page.data.session.user.id === currentPick.teams.manager &&
		draft.status === 'ACTIVE' &&
		!submitted;
</script>

<div class="max-w-full w-full table-container text-white" style="max-width: 100%">
	<table class="table w-full" style="max-width: 100%">
		<thead class="table-header">
			<tr>
				<th class="rounded-none"/>
				<th class="">Name</th>
				<th class="rounded-none"/>
			</tr>
		</thead>
		<tbody>
			{#each players as player}
				<tr>
					<td class=" whitespace-nowrap w-fit">
						<div class="flex items-center justify-center">
							<div class="w-10 h-10 rounded-full overflow-hidden bg-cover mr-2">
								<img src={player.img_url} alt={player.name} class="w-full h-full object-cover" />
							</div>
						</div>
					</td>
					<td class="break-words"
						><p>{player.name}</p>
						<sub class="font text-gray-100"
							><span class={`text-${player.position}`}>{player.position}</span> - {`${player.ufl_teams.city} ${player.ufl_teams.name}`}</sub
						></td
					>

					<td
						><form
							method="POST"
							action="?/draft"
							use:enhance={({ form, data, action, cancel }) => {
								submitted = true;
								//add roster_limits to the form data
								data.set('player_id', player.id);
								data.set('draft', JSON.stringify(draft));
								//add size to the form data as an
								return async ({ result, update }) => {
									setTimeout(() => {
										submitted = false;
									}, 1000);
								};
							}}
						>
							<button type="submit" class="btn btn-circle btn-primary" disabled={!onClock}>+</button
							>
						</form></td
					>
				</tr>
			{/each}
		</tbody>
	</table>
	<div>{draft.status}</div>
</div>

<style>
	.table-container {
		max-height: 50%; /* Adjust based on your requirement */
		overflow-y: auto; /* Enables vertical scrolling */
		display: block;
		position: fixed;
		top: 50%;
	}

	thead th {
		position: sticky;
		top: 0;
		z-index: 1; /* Ensures the header is above other content */
		background-color: #2a2a2a;
		color: white;
		
		
	}
	td{
		background-color: #000;
		border-color: #1d1d1d;

	}

	
</style>
