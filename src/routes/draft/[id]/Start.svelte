<script>
	// @ts-nocheck
	import Clock from './Clock.svelte';
	import { enhance } from '$app/forms';
	export let draft;
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

</header>
