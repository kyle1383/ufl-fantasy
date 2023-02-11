<script>
// @ts-nocheck

	/**
	 * @type {any}
	 */
	import { enhance } from '$app/forms';
	/**
	 * @type {any}
	 */
	export let players;
	async function draft() {
		const response = await fetch('/api/add', {
			method: 'POST',
			body: 'test',
			headers: {
				'content-type': 'application/json'
			}
		});
	}
	let scrollBox, scroll, w;
</script>

<div class="overflow-scroll" on:scroll={()=> scroll = scrollBox.scrollLeft} bind:this={scrollBox} >
	<table class="table w-full text-xl">
		<thead>
			<tr>
				<th class={scroll > w ? 'opacity-0' : ''} bind:clientWidth={w}/>
				<th>Name</th>
				<th>Position</th>
				<th>Team </th>
				<th />
			</tr>
		</thead>
		<tbody>
			{#each players as player}
				<tr>
					<td>
						<div class="w-10 rounded-full">
							<img src={player.img_url} alt={player.name} class="w-8 h-8" />
						</div>
					</td>
					<td>{player.name}</td>
					<td>{player.position}</td>
					<td>{`${player.xfl_teams.city} ${player.xfl_teams.name}`}</td>
					<td
						><form
							method="POST"
							action="?/test"
							use:enhance={({ form, data, action, cancel }) => {
								//add roster_limits to the form data

								data.set('player_id', player.name_id);
								//add size to the form data as an
								return async ({ result, update }) => {};
							}}
						>
							<button type="submit" class="btn btn-primary">Draft Player</button>
						</form></td
					>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
