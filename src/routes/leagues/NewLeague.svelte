<script>
	// @ts-nocheck
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import Spinner from '$lib/Spinner.svelte';
	import { page } from '$app/stores';
	const supabase = $page.data.supabase;

	export let user_leagues = [];
	async function getLeagues() {
		const { data, error } = await supabase
			.from('leagues')
			.select('*, members ( user_id )')
			.eq('members.user_id', $page.data.session.user.id);

		if (error) {
			console.log(error);
		} else {
			user_leagues = data;
		}

	}
	let size = 8;
	//to programatically close modal on submission
	$: checked = false;
	//define roster limits
	let roster_limits = [
		{ name: 'QB', value: 1 },
		{ name: 'RB', value: 2 },
		{ name: 'WR', value: 2 },
		{ name: 'TE', value: 1 },
		{ name: 'FLEX', value: 1 },
		{ name: 'K', value: 1 },
		{ name: 'BENCH', value: 5 }
	];

	$: loading = false;
</script>

<button
	on:click={() => (checked = true)}
	for="new-league-modal"
	class="border-2 border-solid border-primary text-primary text-2xl py-4 px-8 league flex justify-between items-center rounded"
	>Create League <span class="text-4xl">+</span></button
>
<input type="checkbox" id="new-league-modal" class="modal-toggle" {checked} />
<div class="modal">
	<div class="modal-box">
		<label for="new-league-modal" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
		<form
			use:enhance={({ form, data, action, cancel }) => {
				loading = true;
				//add roster_limits to the form data
				const roster_limits_obj = roster_limits.reduce((acc, item) => {
					acc[item.name] = item.value;
					return acc;
				}, {});
				data.set('roster_limits', JSON.stringify(roster_limits_obj));
				//add size to the form data as an
				data.set('size', JSON.stringify(size));
				return async ({ result, update }) => {
					//close modal if result okay
					if (result.type === 'success') {
						await getLeagues();
						checked = false;
					} 
				};
			}}
			class="flex flex-col mx-8"
			method="POST"
		>
			<div class="flex items-center space-x-4">
				<label for="name" class="block font-medium">Name:</label>
				<input
					type="text"
					required
					name="name"
					id="name"
					class="form-input rounded-md shadow-sm text-black p-2 font-semibold"
					disabled={loading}
				/>
			</div>

			<div class="flex items-center space-x-4 mt-4">
				<label for="size" class="block font-medium">Size:</label>
				<select
					class="select max-w-xs rounded-md shadow-sm"
					bind:value={size}
					id="size"
					disabled={loading}
				>
					<option value={2}>2</option>
					<option value={4}>4</option>
					<option value={6}>6</option>
					<option selected value={8}>8</option>
					<option value={10}>10</option>
					<option value={12}>12</option>
					<option value={14}>14</option>
				</select>
			</div>
			{#if loading}
				<div class="flex justify-center">
					<Spinner isLoading={loading} />
				</div>
			{:else}
				<div class="mt-8">
					<button type="submit" class="btn btn-primary">Create League</button>
				</div>
			{/if}
		</form>
	</div>
</div>

<style>
	.league {
		box-shadow: 5px 5px 0px 0px #000;
		transition: 0.1s;
	}
	.league:hover {
		box-shadow: none;
	}
</style>
