<script>
	// @ts-nocheck
	import Clock from './Clock.svelte';
	import { enhance } from '$app/forms';
	export let draft;
	export let currentPick;
</script>

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

	<p><strong>Pick: </strong>{draft.round}.<span>{draft.pick}</span></p>
	<p><strong>On Clock: </strong>{currentPick.teams.name}</p>
	<Clock {draft} />
</header>
