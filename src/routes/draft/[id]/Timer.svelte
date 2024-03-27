<script>
	// @ts-nocheck
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	const { user } = $page.data.session;
	export let draft;
	export let currentTeamName;
	export let timeRemaining;
	$: draft.status;
</script>

{#if draft.status === 'PREDRAFT'}
	{#if draft.leagues[0]?.commissioners[0].user_id === user.id}
		<header class="navbar">
			<form
				method="POST"
				action="?/start"
				use:enhance={({ form, data, action, cancel }) => {
					//add roster_limits to the form data
					data.set('draft', JSON.stringify(draft));
					//add size to the form data as an
					return async ({ result, update }) => {};
				}}
			>
				<button class="btn btn-primary">Start</button>
			</form>
		</header>
	{/if}
{:else if draft.status === 'PAUSED'}
	{#if draft.leagues[0].commissioners[0].user_id === user.id}
		<header class="navbar">
			<form
				method="POST"
				action="?/start"
				use:enhance={({ form, data, action, cancel }) => {
					//add roster_limits to the form data
					data.set('draft', JSON.stringify(draft));
					//add size to the form data as an
					return async ({ result, update }) => {};
				}}
			>
				<button class="btn btn-ivory">Start</button>
			</form>
		</header>
	{/if}
{:else}
	<header class="navbar">
		<div class="flex justify-center items-center">
			<p><strong>Pick: </strong>{draft.round}.<span>{draft.pick}</span></p>
			<p><strong>On Clock: </strong>{currentTeamName}</p>
			<div class="flex flex-col items-center justify-center text-white text-center">
				<div class="text-3xl font-bold mb-1">
					{timeRemaining.minutes}:{timeRemaining.seconds}
				</div>
			</div>
			<form
				method="POST"
				action="?/pause"
				use:enhance={({ form, data, action, cancel }) => {
					//add roster_limits to the form data
					data.set('draft', JSON.stringify(draft));
					//add size to the form data as an
					return async ({ result, update }) => {};
				}}
			>
				<button class="btn btn-ivory">Pause</button>
			</form>
		</div>
	</header>
{/if}
