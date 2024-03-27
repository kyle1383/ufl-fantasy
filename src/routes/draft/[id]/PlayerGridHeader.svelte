<script>
	export let positionFilter;
	const positions = ['ALL', 'QB', 'RB', 'WR', 'TE', 'K'];
</script>

<div class="grid-header bg-black border-gray-600 border-t-[1px] border-b-[1px] flex items-center">
	<p class="text-xl font-bold py-4 pl-8 pr-8">Available Players</p>
	<div class="flex gap-x-2">
		{#each positions as position}
			<button
				class=" btn-circle border-gray-600 border-2 rounded-full {position ===
				positionFilter
					? `bg-${position !== 'ALL' ? position : 'black'} text-white`
					: `bg-gray-700 text-${position}` }"
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
