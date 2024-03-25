<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	export let data;
	if (!data.league) {
		goto('/leagues');
	}

	const league = data?.league[0];
	const { teams } = league;

	async function copyInvite() {
		await navigator.clipboard.writeText(`${$page.url}/invite`);
		// Alert the copied text
		alert('Copied invite');
	}
	//get [id] param
</script>

<div class="text-base-100">
	<p class="text-3xl py-2 border-b-2 border-solid text-base-100 border-base-100">{league.name}</p>

	<div class="overflow-x-auto my-8">
		<p class="text-xl py-2">Standings</p>
		<table class="table w-auto">
			<!-- head -->
			<thead>
				<tr class="text-white ">
					<th class="bg-primary " style="border-radius: 0.25rem 0 0 0">Name</th>
					<th class="bg-primary">Manager</th>
					<th class="bg-primary">W</th>
					<th class="bg-primary "  style="border-radius: 0 0.25rem 0 0">L</th>
				</tr>
			</thead>
			<tbody>
				{#each teams as team}
					<tr class="border-solid border-t-2 border-gray-300">
						<td class="bg-white text-black  font-bold"  style="border-radius: 0 0 0 0.25rem"
							><a href={`/leagues/${$page.params.id}/roster/${team.id}`}>{team.name}</a></td
						>
						<td class="bg-white text-black">{team.manager_name}</td>
						<td class="bg-white text-black">{team.wins}</td>
						<td class="bg-white text-black "  style="border-radius: 0 0 0.25rem 0">{team.losses}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
<div class="mt-4 text-base-100">
	<p class="text-xl pb-2">Invite friends to the league!</p>

	<button class="btn btn-accent rounded" on:click={() => copyInvite()}
		>Copy Invite URL <Icon width="20" class="ml-2" icon="ph:copy" /></button
	>
</div>

<form
	use:enhance={({ form, data, action, cancel }) => {
		//TODO is stringify neccessary? why?
		
		if (league.draft_id) {
			cancel();
			goto(`/draft/${league.draft_id}`);
		}
		data.set('league', league.id);
		return async ({ result, update }) => {
			if (result.error) {
				update({ error: result.error });
				return;
			}
			goto(`/draft/${result.data.draft?.id}`);
		};
	}}
	method="POST"
	action="?/init"
>
	<button class="btn btn-secondary rounded">Draft</button>
</form>

<a class="btn btn-primary btn-outline" href="/leagues/{$page.params.id}/waivers">Waivers</a>
<!---
<a class="btn btn-secondary" href="/leagues/schedule">Schedule</a>

-->


<style>
	table{
		border-radius: 0.25rem;
	}
</style>