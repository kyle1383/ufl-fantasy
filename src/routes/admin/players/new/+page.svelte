<script>
	// @ts-nocheck

	import { enhance } from '$app/forms';
	$: response = {};
</script>

<form
	use:enhance={({ form, data, action, cancel }) => {
		return async ({ result, update }) => {
			//goto('/');
			response = result;
		};
	}}
	action="?/updatePlayers"
	method="POST"
>
	<label>
		<button class="btn" type="submit">Update Players</button>
	</label>

	{#if response.status === 200}
		{#each response.data?.duplicates as player}
			{player.name}
		{/each}
	{/if}
</form>

<form method="POST" action="?/processWaivers" use:enhance>
	<button class="btn btn-primary">Process waivers</button>
</form>

<form method="POST" action="?/uflPlayers" use:enhance>
	<button class="btn btn-primary">ufl players update</button>
</form>

<form method="POST" action="?/updateSchedule" use:enhance>
	<button class="btn btn-primary">upload schedule</button>
</form>

<form method="POST" action="?/gameStats" use:enhance>
	<button class="btn btn-primary">game stats</button>
</form>