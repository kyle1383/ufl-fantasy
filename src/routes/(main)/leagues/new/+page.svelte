<script>
// @ts-nocheck

	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { prevent_default } from 'svelte/internal';
	let size = 8;
	//default roster limits
	let roster_limits = [
		{ name: 'QB', value: 1 },
		{ name: 'RB', value: 2 },
		{ name: 'WR', value: 2 },
		{ name: 'TE', value: 1 },
		{ name: 'FLEX', value: 1 },
		{ name: 'DST', value: 1 },
		{ name: 'K', value: 1 },
		{ name: 'BENCH', value: 5 }
	];
	//default scoring
	let PPR = 1;
</script>

<form
	use:enhance={({ form, data, action, cancel }) => {
		//add roster_limits to the form data
		const roster_limits_obj = roster_limits.reduce((acc, item) => {
			acc[item.name] = item.value;
			return acc;
		}, {});
		data.set('roster_limits', JSON.stringify(roster_limits_obj));
		//add size to the form data as an
		data.set('size', JSON.stringify(size));
		return async ({ result, update }) => {
			goto('/leagues');
		};
	}}
	class="flex flex-col mx-8"
	method="POST"
>
	<label>
		Name: <input type="text" required name="name" id="name" />
	</label>
	<label>
		size: {size}
		<button
			class="btn btn-primary btn-circle"
			on:click={(e) => {
				e.preventDefault();
				size -= 2;
			}}>-</button
		>
		<button
			class="btn btn-primary btn-circle"
			on:click={(e) => {
				e.preventDefault();
				size += 2;
			}}>+</button
		>
	</label>
	<!--Roster limit +/- fields-->
	{#each roster_limits as position}
		{position.name}:
		<div>
			<button
				class="btn btn-primary btn-circle"
				on:click={(e) => {
					e.preventDefault();
					position.value -= 1;
				}}>-</button
			>
			{position.value}
			<button
				class="btn btn-primary btn-circle"
				on:click={(e) => {
					e.preventDefault();
					position.value += 1;
				}}>+</button
			>
		</div>
	{/each}
	<label>
		<button class="btn btn-primary" type="submit">Create League</button>
	</label>
</form>
