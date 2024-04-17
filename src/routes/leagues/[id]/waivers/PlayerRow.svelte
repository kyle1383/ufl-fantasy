<script>
	export let player;
	export let waiver;
	export let waiver_request;
	export let draftStatus;
	export let rosterSize;
	export let team;

	export let checked;
	export let addPlayer;
</script>

<div class="flex items-center justify-center">
	<div class="flex items-center justify-center">
		<div class="w-10 h-10 rounded-full overflow-hidden bg-cover mr-2">
			<img src={player.img_url} alt={player.name} class="w-full h-full object-cover" />
		</div>
	</div>
</div>


<div class="">
	<p>{player.name}</p>
	<p class="text-xs lg:text-sm"
		><span class={`text-${player.position}`}>{player.position}</span> - {`${player.ufl_teams.city} ${player.ufl_teams.name}`}</p
	>
</div>
<div class="flex justify-end">
	<button
		on:click={() => {
			checked = true;
			addPlayer = player;
		}}
		disabled={waiver_request || draftStatus === 'PREDRAFT' || draftStatus === 'ACTIVE' || draftStatus === 'PAUSED'}
		class="btn btn-circle {waiver_request ? '' : 'btn-outline'} flex flex-col {waiver
			? 'btn-secondary'
			: 'btn-primary'}"
		>{waiver ? 'W' : '+'}{#if waiver}<small class="text-[0.5rem]">Tues</small>{/if}</button
	>
</div>
