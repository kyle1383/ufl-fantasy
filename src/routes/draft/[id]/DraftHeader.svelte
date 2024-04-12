<script>
	import Clock from './Clock.svelte';
	export let draft;
	export let currentTeamName;
	export let timeRemaining;
	
	
</script>

<div class="w-full px-8 draft-header">
	<div
		class="text-white text-sm lg:text-xl font-bold bg-gray-700 p-4 lg:p-8 rounded-lg border-gray-600 border-2 w-full mt-4 flex space-x-8 text-center lg:text-left justify-between items-center"
	>
		<p>Welcome to the <span class="text-primary orbitron">{draft.leagues[0].name}</span> draft</p>

		<Clock {draft} {currentTeamName} />
	</div>
</div>

<style>
	.draft-header {
		position: fixed;
		width: 100%;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1;
	}
</style>
