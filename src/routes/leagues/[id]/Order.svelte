<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	console.log($page.data.session?.user.id);
	export let league;
	export let teams;
	let order;
	$: order = league.order;
	$: teams = teams.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
	$: isCommissioner = league.commissioners.some((c) => c.user_id === $page.data.session?.user.id);
</script>

<div class="text-white bg-gray-700 p-8 rounded-lg border-gray-600 border-2">
	<p class="text-xl pb-4">Order</p>

	<table class="grid w-full max-w-full md:gap-x-4 gap-y-4">
		<!-- head -->

		{#each teams as team, index}
			<td class="pl-0 mr-2 md:mr-0"><p class="rounded-full">{index + 1}</p></td>
			<td class="bg-white font-bold" style="border-radius: 0 0 0 0.25rem"><p>{team.name}</p></td>
			<td class="bg-white break-words">{team.manager_name}</td>
		{/each}
	</table>
	{#if isCommissioner}
		<form
			method="POST"
			action="?/randomizeOrder"
			use:enhance={({ form, data, action, cancel }) => {
				return async ({ result, update }) => {
					console.log(result);
					if (result.type === 'failure' || result.type === 'error') {
						alert(result.data.message || 'error');
					} else {
						order = result.data.order;
					}
				};
			}}
		>
			<button class="btn btn-primary mt-4">Randomize Order</button>
		</form>
	{/if}
</div>

<style>
	.grid {
		grid-template-columns: auto auto auto;
	}
	table th,
	td {
		background-color: transparent;

		@media (max-width: 1024px) {
			padding: 0.25rem;
		}
	}
</style>
