<script>
	import Clock from './Clock.svelte';
	export let draft;
	export let currentTeamName;
	export let timeRemaining;
</script>

<div class="w-full md:px-8 draft-header">
	<div
		class="text-white text-sm lg:text-xl font-bold bg-gray-700 p-4 lg:p-8 rounded-t-none rounded-b-lg border-gray-600 border-2 w-full flex space-x-8 text-center lg:text-left justify-between items-center"
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
		top: 0rem;
		transform: translateX(-50%);
		z-index: 10;
		box-shadow: 0 -50px 10px 50px rgba(0, 0, 0, 0.9);

		
		@media (min-width: 1024px) {
			top: 2rem;
		}
	}
	.draft-header::before {
		content: '';
		position: absolute;
		width: 100%;
		height: 10px;
		left: 50%;
		top: 0;
		transform: translateX(-50%);
		z-index: -1;
		background-color: rgba(0, 0, 0, 1);
	}
</style>
