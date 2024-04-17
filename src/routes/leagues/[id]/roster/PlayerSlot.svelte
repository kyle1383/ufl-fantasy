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
	$:console.log(player)
</script>

{#if player !== 'null'}
	<div class="my-auto">
		<button
			on:click={() => {
				swapPosition = position;
				swapDepth = depth;
				swapOutPlayer = player;
				checked = true;
			}}
			class={`text-${position} btn-xs border-2 rounded-lg btn w-full btn-outline bg-gray-700  border-gray-600 `}
		>
			{position}
		</button>
	</div>
	<div class="flex">
		<div class="my-auto">
			<div class="flex items-center justify-center">
				<div class="w-10 h-10 rounded-full overflow-hidden bg-cover mr-2">
					<img src={player.players.img_url} alt={player.players.name} class="w-full h-full object-cover" />
				</div>
			</div>
		</div>
		<div class="flex flex-col justify-center">
			<p>{player.players.name}</p>
			<span class="text-xs">
				{`${player.players.position} ${player.players.ufl_teams.city} ${player.players.ufl_teams.name}`}</span
			>
		</div>
	</div>
	<div class="flex justify-end">
		<form
			method="POST"
			action="?/drop"
			use:enhance={({ formElement, formData, action, cancel, spanmitter }) => {
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
			<input type="hidden" name="player_id" value={player.players.id} />
			{#if loading}
				<div
					class="btn btn-sm my-auto btn-error btn-outline btn-circle loading loading-spinner loading-lg"
				/>
			{:else}
				<button class="btn-sm btn my-auto btn-error btn-outline btn-circle">-</button>{/if}
		</form>
	</div>
{:else}
	<div>
		<button
			on:click={() => {
				swapPosition = position;
				swapDepth = depth;
				swapOutPlayer = player;
				checked = true;
			}}
			class={`text-${position} btn-xs btn-outline border-2 rounded-lg bg-gray-700 border-gray-600 btn w-full `}
		>
			{position}
		</button>
	</div>

	<div class="flex items-center">
		<div class="w-10 rounded-full">
			<img
				src="https://res.cloudinary.com/xfl-production/image/upload/c_thumb,g_face,w_120/r_max/v1669141695/xfl-prod/headshots/no-avatar_dyafk8.png"
				alt="Empty avatar"
				class="w-8 h-8"
			/>
		</div>
		<div >Empty</div>
	</div>
	<div />
{/if}
