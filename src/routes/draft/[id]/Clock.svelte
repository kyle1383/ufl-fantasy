<script>
	// @ts-nocheck
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	const { user } = $page.data.session;
	export let draft;
	export let currentTeamName;
	$: draft.status;
</script>

{#if draft.status === 'PREDRAFT'}
	{#if draft.leagues[0]?.commissioners[0].user_id === user.id}
		<form
			method="POST"
			action="?/start"
			use:enhance={({ formData }) => {
				//add roster_limits to the form data
				formData.append('draft', JSON.stringify(draft));
				//add size to the form data as an
				return async ({ result, update }) => {};
			}}
		>
			<button class="btn btn-primary">Start</button>
		</form>
	{:else}
		<p class=" hidden lg:block lg:text-center">Waiting for the draft to begin</p>
	{/if}
{:else if draft.status === 'PAUSED'}
	{#if draft.leagues[0].commissioners[0].user_id === user.id}
		<form
			method="POST"
			action="?/start"
			use:enhance={({ form, data, action, cancel }) => {
				//add roster_limits to the form data
				data.set('draft', JSON.stringify(draft));
				//add size to the form data as an
				return async ({ result, update }) => {
					
					if (result.type === 'failure') {
						alert(result.message);
					}
				};
			}}
		>
			<button class="btn btn-ivory">Start</button>
		</form>
	{/if}
{:else if draft.status === 'ACTIVE'}
	<div class="flex flex-col justify-center items-start">
		<p><strong>Pick: </strong>{draft.round}.<span>{draft.pick}</span></p>
		<p><strong>On Clock: </strong>{currentTeamName}</p>
	</div>
{:else if draft.status === 'COMPLETE'}
	<p>The Draft has concluded. Good luck!</p>
	<form
			method="POST"
			action="?/endDraft"
			use:enhance={({ form, data, action, cancel }) => {
				//add roster_limits to the form data
				data.set('draft', JSON.stringify(draft));
				//add size to the form data as an
				return async ({ result, update }) => {
					
					if (result.type === 'failure') {
						alert(result.message);
					}
				};
			}}
		>
			<button class="btn btn-ivory">Start</button>
		</form>
	
{/if}
