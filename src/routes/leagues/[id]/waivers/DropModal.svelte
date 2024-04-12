<script>
	import { enhance } from '$app/forms';
	import { clickOutside } from '$lib/helpers';
	import Icon from '@iconify/svelte';
	export let player = null;
	export let checked;
	export let team;
	export let rosterSize;
	export let showToast;
	const underRosterLimit = team.player_leagues.length < rosterSize;
	function handleClickOutside(event) {
		checked ? (checked = false) : null;
	}
</script>

<input type="checkbox" id="swap-modal" class="modal-toggle" {checked} />
<div class="modal modal-bottom sm:modal-middle cursor-pointer">
	<div
		class="modal-box text-white bg-gray-700 p-8 lg:rounded-lg border-gray-600 border-2 lg:w-max w-full mx-0 rounded-b-0 rounded-t-lg"
		use:clickOutside
		on:click_outside={handleClickOutside}
	>
		
		{#if player}
			<div class="flex mb-4">
				
					<Icon icon="clarity:plus-line" width="15" class="my-auto text-acc3 mr-2" />
					
					<div class="flex items-center justify-center">
						<div class="w-10 h-10 rounded-full overflow-hidden bg-cover mr-2">
							<img src={player.img_url} alt={player.name} class="w-full h-full object-cover" />
						</div>
					</div>
				<div class="flex flex-col">
					
					<p>{player.name}</p>
					<sub class=""
						><span class={`text-${player.position}`}>{player.position}</span> - {`${player.ufl_teams.city} ${player.ufl_teams.name}`}</sub
					>
				</div>
			</div>
		{/if}

		<form
			method="POST"
			action="?/add"
			use:enhance={({ formData, action, cancel, submitter }) => {
				checked = true;
				formData.append('add_player_id', player.id);
				return async ({ result, update }) => {
					if (result.data.status === 200) {
						checked = false;

						showToast(result.data.body);
					} else {
						console.log(result)
						alert(result.data.body);
					}
				};
			}}
		>
			Who would you like to drop?
			<div class="flex flex-col">
				{#if underRosterLimit}
					<small class="text-primary">You are not required to drop anyone</small>
					<div class="flex my-1">
						<input
							type="radio"
							name="drop_player"
							id="drop-none"
							value={null}
							class="radio radio-primary mr-2"
							checked
						/>
						<label for="drop-none">Do not drop any players</label>
					</div>
				{/if}
				{#each team.player_leagues as { players: player }, index}
					<div class="flex my-1">
						<input
							type="radio"
							name="drop_player"
							id="drop-{player.id}"
							value={player.id}
							class="radio radio-primary mr-2"
							checked={index === 0 && !underRosterLimit}
						/>
						<label for="drop-{player.id}"
							>{player.name} - <small>{player.position}</small></label
						>
					</div>
				{/each}
			</div>
			<button type="submit" class="btn btn-primary btn-outline mt-4">Confirm</button>
		</form>
	</div>
</div>
