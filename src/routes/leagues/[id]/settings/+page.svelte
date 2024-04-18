<script>
	import { enhance } from '$app/forms';
	import { showToast } from '$lib/helpers';
	export let data;
	$: league = data.league;
	const sizes = [2, 4, 6, 8, 10, 12];
	$: currentSize = league.size;
    $: filledTeams = league.teams.filter((team) => team.manager !== null)
   
</script>

<div>
	<p class="font-bold text-3xl py-4">League Settings</p>
</div>
<form
	class="w-fit"
	method="POST"
	action="?/updateLeague"
	use:enhance={({ formData }) => {
		formData.append('size', currentSize);
		return async ({ result }) => {
			if (result.type === 'success') {
				showToast('League updated successfully');
			} else {
				alert(result.data.message);
			}
		};
	}}
>
	<div class="flex flex-col">
		<label class="text-xl text-white py-2" for="name">Name</label>
		<input
			type="text"
			name="name"
			class="form-input rounded-md shadow-sm text-black p-2 font-semibold bg-gray-700 rounded-lg border-gray-600 border-2 text-white min-w-64"
			value={league.name}
		/>
	</div>
	<p class="text-xl text-white pb-2 pt-8">Teams</p>
	<div class="flex gap-x-1 mx-auto my-2 lg:my-0 lg:mx-0">
		{#each sizes as size}
			<button
				class="btn-circle border-gray-600 border-2 rounded-full text-sm disabled:text-gray-600 {size === currentSize
					? 'bg-primary text-white'
					: ''}"
                disabled={filledTeams.length > size}
				class:selected={size === currentSize}
				on:click={(e) => {
					e.preventDefault();
					currentSize = size;
				}}
			>
				{size}
			</button>
		{/each}
	</div>
	<button type="submit" class="btn btn-primary mt-8">Confirm Changes</button>
</form>
