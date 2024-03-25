<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	// @ts-nocheck
	export let position;
	export let depth;
	export let player;
	export let checked = false;
	export let swapDepth = 0;
	export let swapPosition = 'BENCH';
	export let swapOutPlayer = null;
	let loading = false;
</script>

<tr>
	{#if player !== 'null'}
		<td>
			<button
				on:click={() => {
					swapPosition = position;
					swapDepth = depth;
					swapOutPlayer = player;
					checked = true;
				}}
				class={`text-${position} btn-xs border-2 rounded-lg border-${position} btn`}
			>
				{position}
			</button>
		</td>
		<td class="whitespace-normal">
			<div class="w-10 rounded-full">
				<img src={player.players.img_url} alt={player.players.name} class="w-8 h-8" />
			</div>
		</td>
		<td class="break-words"
			><p>{player.players.name}</p>
			<sub class="font"> {`${player.players.xfl_teams.city} ${player.players.xfl_teams.name}`}</sub>
		</td>
		<td>
			<form
				method="POST"
				action="?/drop"
				use:enhance={({ formElement, formData, action, cancel, submitter }) => {
					loading = true;
					if (!confirm(`Are you sure you want to drop this ${player.players.name}?`)) {
						cancel();
					}
					return async ({ result, update }) => {
						if (result.type === 'success') {
							console.log(result);
							invalidateAll();
						} else if (result.type === 'error') {
							alert('internal error');
						} else {
							alert(`Player drop failed; ${result.data.error_message}`);
						}
					};
				}}
			>
				<input type="hidden" name="player_id" value={player.players.name_id} />
				{#if loading}
					<div class="btn btn-error btn-outline btn-circle loading loading-spinner loading-lg" />
				{:else}
					<button class="btn btn-error btn-outline btn-circle">-</button>{/if}
			</form>
		</td>
	{:else}
		<td>
			<button
				on:click={() => {
					swapPosition = position;
					swapDepth = depth;
					swapOutPlayer = player;
					checked = true;
				}}
				class={`text-${position} btn-xs border-2 rounded-lg border-${position} btn`}
			>
				{position}
			</button>
		</td>

		<td>Empty</td>
		<td />
		<td />
	{/if}
</tr>
