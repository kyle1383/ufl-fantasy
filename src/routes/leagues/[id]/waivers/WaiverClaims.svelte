<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { WaiverClaim } from '../../../types';
	export let claims: WaiverClaim[] = [];
	console.log(claims[0].player_add);
</script>

<div class="border-r-[1px] border-gray-700 h-full py-4 mr-8 text-white">
	<p class="text-xl font-bold pb-4">Waiver Claims</p>
	<div class="grid gap-y-4 pr-8">
		<div class="flex items-center text-xs">
			
			<Icon icon="clarity:plus-line" width="15" class="my-auto text-acc3 mr-2" />
            <p>Add</p>
		</div>
		<div />
		<div class="flex items-center text-xs">
			
			<Icon icon="clarity:minus-line" width="15" class="my-auto text-error mr-2" />
            <p>Drop</p>
		</div>
		{#each claims as claim}
			<div class="flex items-center relative  ">
				<div class="handle">
					<Icon icon="clarity:drag-handle-line" width="30" class="my-auto " />
				</div>
               
				<div class="rounded-full">
					<img src={claim.player_add.img_url} alt={claim.player_add.city} class="min-w-8 h-8" />
				</div>
				<div class="flex flex-col pl-2">
					<p class="text-sm">{claim.player_add.name}</p>
					<span class="text-xs"
						><span>{claim.player_add.position}</span> - {claim.player_add.xfl_teams.city}</span
					>
				</div>
			</div>
			<Icon icon="clarity:two-way-arrows-line" class="my-auto mx-2" width="20" />
			{#if claim.player_drop}
				<div class="flex items-center relative">
					<div class="w-10 rounded-full">
						<img src={claim.player_drop.img_url} alt={claim.player_drop.city} class="w-8 h-8" />
					</div>
					<div class="flex flex-col">
						<p class="text-sm">{claim.player_drop.name}</p>
						<span class="text-xs"
							><span>{claim.player_drop.position}</span> - {claim.player_drop.xfl_teams.city}</span
						>
					</div>
                    <div class="handle-end">
                        <Icon width=20 icon="clarity:remove-line" class="text-gray-500"/>
                    </div>
				</div>
			{:else}
				<div class="text-xs text-gray-500">-</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.grid {
		grid-template-columns: minmax(0, max-content) 1fr auto; 
	}
	.handle {
		position: absolute;
		top: 50%;
		left: -30px;
		transform: translateY(-50%);
	}
    .handle-end {
		position: absolute;
		top: 50%;
		right: -25px;
		transform: translateY(-50%);
	}
</style>
