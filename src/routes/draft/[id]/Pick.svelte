<script lang="ts">
	import type { Player } from '$lib/types';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { enhance } from '$app/forms';
	export let pick;
	export let player: Player;
	export let isCommissioner: Boolean;
	export let draft;
	let loading = false;
	$: loading;
	let pickElement;
	let isActive = false;
	$: isCurrentPick = draft.round === pick.round && draft.pick === pick.pick;
	function handleClick(e) {
		if (isCommissioner && isCurrentPick && draft.status === 'ACTIVE') {
			isActive = !isActive;
		}
	}
	onMount(() => {
		document.addEventListener('click', function (event) {
			var isClickInsideMenu = pickElement?.contains(event.target);

			if (!isClickInsideMenu) {
				isActive = false;
				// The click was outside the menu, close the menu
			}
		});
	});
</script>

{#if !player}
	<div
		class="pick text-white bg-gray-700 p-4 rounded-lg border-gray-600 border-2 relative"
		on:click={handleClick}
		on:keydown={handleClick}
		on:keyup={handleClick}
		bind:this={pickElement}
	>
		<p class="text-right">{pick.round}.{pick.pick}</p>
		<div style="display: {isActive ? 'block' : 'none'};" class="text-black rounded-lg dropdownMenu">
			<!-- Add your dropdown content here -->
			<form
				method="POST"
				action="?/autodraft"
				use:enhance={({ form, data, action, cancel }) => {
					loading = true;
					return async ({ result, update }) => {
						if (result.type === 'failure'){
							alert(result.data?.message)
						}
						//goto('/');
						 loading = false;
					};
				}}
			>
				<input type="hidden" name="draft" value={JSON.stringify(draft)} />
				<input type="hidden" name="pick" value={JSON.stringify(pick)} />
				<button class="flex items-center" disabled={loading}>
					<Icon icon="material-symbols:refresh" class="text-primary pr-1" width="20" />AutoDraft
				</button>
			</form>
		</div>
	</div>
{:else}
	<div
		class="bg-{player.position} text-white rounded p-2 m-1 bg-QB flex justify-between items-center"
	>
		<div>
			<p class="text-xs md:text-lg">{player.name}</p>
			<p class="text-xs md:text-md">{player.position} | {player.ufl_teams.name}</p>
		</div>
		<div class="flex items-center justify-center">
			<div class="w-10 h-10 rounded-full overflow-hidden bg-cover mr-2">
				<img src={player.img_url} alt={player.name} class="w-full h-full object-cover" />
			</div>
		</div>
	</div>
{/if}

<style>
	.dropdownMenu {
		position: absolute;
		border: 1px solid #ccc;
		background-color: white;
		padding: 10px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
		z-index: 1000;
		left: 50%;
		top: 100%;
		transform: translate(-50%, 0%);
	}
</style>
