<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { WaiverClaim } from '$lib/types';
	export let claims: WaiverClaim[] = [];

</script>

<div class="lg:border-r-[1px] border-gray-700 h-full py-4 lg:mr-8 text-white">
	<p class="text-xl font-bold pb-4">Waiver Claims</p>
	{#if claims.length > 0}
		<div class="grid gap-y-4 lg:pr-8 w-full lg:w-fit">
			{#each claims as claim}
				<div class="flex items-center text-xs ml-8 lg:ml-0">
					<Icon icon="clarity:plus-line" width="15" class="my-auto text-acc3 mr-2" />
					<p>Add</p>
				</div>
				<div />
				<div class="flex items-center text-xs">
					<Icon icon="clarity:minus-line" width="15" class="my-auto text-error mr-2" />
					<p>Drop</p>
				</div>
				<div class="flex items-center relative">
					<div class="handle">
						<Icon icon="clarity:drag-handle-line" width="30" class="my-auto " />
					</div>

					<div class="rounded-full">
						<img src={claim.player_add.img_url} alt={claim.player_add.city} class="min-w-8 h-8" />
					</div>
					<div class="flex flex-col pl-2">
						<p class="text-sm">{claim.player_add.name}</p>
						<span class="text-xs"
							><span>{claim.player_add.position}</span> - {claim.player_add.ufl_teams.city}</span
						>
					</div>
				</div>
				<Icon icon="clarity:two-way-arrows-line" class="my-auto mx-auto lg:mx-4" width="20" />
				{#if claim.player_drop}
					<div class="flex items-center relative">
						<div class="flex items-center justify-center">
							<div class="w-10 h-10 rounded-full overflow-hidden bg-cover mr-2">
								<img src={claim.player_drop.img_url} alt={claim.player_drop.name} class="w-full h-full object-cover" />
							</div>
						</div>
						<div class="flex flex-col">
							<p class="text-sm">{claim.player_drop.name}</p>
							<span class="text-xs"
								><span>{claim.player_drop.position}</span> - {claim.player_drop.ufl_teams
									.city}</span
							>
						</div>
						<div class="handle-end ml-auto lg:ml-4">
							<Icon width="20" icon="clarity:remove-line" class="text-gray-300 ml-4 lg:ml-2 self-end" />
						</div>
					</div>
				{:else}
					<div class="text-xs text-gray-500">-</div>
				{/if}
			{/each}
		</div>
		{:else}
		<p class="text-gray-300">No Current Waiver Claims</p>
	{/if}
</div>

<style>
	.grid {
		grid-template-columns: auto 1fr auto;
		@media (min-width: 1280px) {
			grid-template-columns: minmax(0, max-content) 1fr auto;
		}
	}
	.handle {
		@media (min-width: 1024px) {
			position: absolute;
			top: 50%;
			left: -30px;
			transform: translateY(-50%);
		}
	}
	.handle-end {
		@media (min-width: 1024px) {
			position: absolute;
			top: 50%;
			right: -30px;
			transform: translateY(-50%);
		}
	}
</style>
