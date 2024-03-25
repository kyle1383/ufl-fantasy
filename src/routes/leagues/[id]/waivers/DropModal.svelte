<script>
	import { enhance } from '$app/forms';
	import { clickOutside } from '$lib/helpers';

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
	<div class="modal-box" use:clickOutside on:click_outside={handleClickOutside}>
		<p>You are adding</p>
		{#if player}
			<div class="flex flex-col mb-4">
				<div class="flex items-center my-2">
					<div class="w-10 rounded-full">
						<img src={player.img_url} alt={player.name} class="w-8 h-8" />
					</div>

					<p>{player.name}</p>
				</div>

				<sub class="font"
					><span class={`text-${player.position}`}>{player.position}</span> - {`${player.xfl_teams.city} ${player.xfl_teams.name}`}</sub
				>
			</div>
		{/if}

		<form
			method="POST"
			action="?/add"
			use:enhance={({ formData, action, cancel, submitter }) => {
				checked = true;
				formData.append('add_player_id', player.name_id);
				return async ({ result, update }) => {
                  
                    if (result.data.status === 200){
                        checked = false;
				
						showToast(result.data.body)
                    } else{
                        alert(result.data.body)
                    }
                };
			}}
		>
			Who would you like to drop?
			<div class="flex flex-col">
				{#if underRosterLimit}
                <small class="text-primary">!! You have room on your roster !!</small>
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
							id="drop-{player.name_id}"
							value={player.name_id}
							class="radio radio-primary mr-2"
                            checked={index === 0 && !underRosterLimit}
						/>
						<label for="drop-{player.name_id}">{player.name} - <small>{player.position}</small></label>
					</div>
				{/each}
			</div>
			<button type="submit" class="btn btn-primary">Confirm</button>
		</form>
	</div>
</div>
