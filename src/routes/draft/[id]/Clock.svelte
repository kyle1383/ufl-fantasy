<script>
	// @ts-nocheck
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	const { user } = $page.data.session;
	export let draft;
	export let currentTeamName;
	$: draft.status;
	$: draft.time_remaining;
	
	let timeRemaining;
	let interval;

	// Update time every second when component mounts
	onMount(() => {
		// Initial calculation
		timeRemaining = formatTimeRemaining(draft.pickEnd);
		
		// Set up interval to update every second
		interval = setInterval(() => {
			timeRemaining = formatTimeRemaining(draft.pickEnd);
		}, 1000);
	});

	// Clean up the interval when the component is destroyed
	onDestroy(() => {
		if (interval) {
			clearInterval(interval);
		}
	});

	function formatTimeRemaining(pickEnd) {
		const endTime = new Date(pickEnd);
		const currentTime = new Date();
		const timeDiff = endTime - currentTime;

		if (timeDiff <= 0) {
			return "Time's up!";
		}

		const seconds = Math.floor((timeDiff / 1000) % 60);
		const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
		

		return `${minutes}m ${seconds}s`;
	}
</script>

{#if draft.status === 'PREDRAFT'}
	{#if draft.leagues[0]?.commissioners[0].user_id === user.id}
		<form
			method="POST"
			action="?/start"
			use:enhance={() => {
				//add roster_limits to the form data

				//add size to the form data as an
				return async ({ result, update }) => {
					if (result.type === 'failure') {
						alert(result.data.message || 'error starting draft');
					}
				};
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
<div class="flex items-center">
	<p>
		The Draft has concluded. Good luck!
		
	</p>
	<a class="btn btn-outline ml-4 btn-primary" href="/leagues/{draft.leagues[0].id}">Return to League</a>
</div>
{/if}
