<script>
	import Icon from '@iconify/svelte';
	export let positionFilter;
	const positions = ['ALL', 'QB', 'RB', 'WR', 'TE', 'K'];
</script>

<div class="grid-header bg-black border-gray-600 border-t-2 border-b-2 lg:border-t-[1px] lg:border-b-[1px] flex items-center">
	<p class="hidden lg:block text-xl font-bold py-4 pl-8 pr-8">Available Players</p>
	<div class="flex gap-x-2 mx-auto my-2 lg:my-0 lg:mx-0">
		{#each positions as position}
			<button
				class=" btn-circle border-gray-600 border-2 rounded-full p-1 text-sm {position ===
				positionFilter
					? `bg-${position !== 'ALL' ? position : 'black'} text-white`
					: `bg-gray-700 text-${position}`}"
				class:selected={position === positionFilter}
				on:click={() => (positionFilter = position)}
			>
				{position}
			</button>
			
		{/each}
		
	</div>
</div>

<style>
	.grid-header {
		position: sticky;
		top: 0;
		z-index: 1; /* Ensures the header is above other content */
	}
</style>
