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
