<script>
	// @ts-nocheck

	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	/**
	 * @type {{ league: any[]; session: { user: any; }; }}
	 */
	export let data;

	if (!data.league) {
		goto('/leagues');
	}
	const league = data?.league[0];
	const { teams } = league;

	async function copyInvite() {
		// Get the text field
		// Copy the text inside the text field

		await navigator.clipboard.writeText(`${$page.url}/invite`);
		// Alert the copied text
		alert('Copied invite');
	}
</script>

<h1>{league.name}</h1>

<div class="overflow-x-auto">
	<table class="table w-auto">
		<!-- head -->
		<thead>
			<tr>
				<th>Name</th>
				<th>Manager</th>
			</tr>
		</thead>
		<tbody>
			{#each teams as team}
				<tr>
					<td><a href="/">{team.name}</a></td>
					<td>{team.manager_name}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<p>{`${$page.url}/invite`}</p>
<button class="btn" on:click={() => copyInvite()}>Copy Invite</button>

<form
	use:enhance={({ form, data, action, cancel }) => {
		//TODO is stringify neccessary? why?
		data.set('league', JSON.stringify(league));
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
	<button class="btn btn-primary">Mock</button>
</form>

