<script>
	export let player;
	export let waiver;
	export let waiver_request;
	export let rosterSize;
	export let team;

	export let checked;
	export let addPlayer;
</script>

<div class="">
	<div class="w-10 rounded-full">
		<img src={player.img_url} alt={player.name} class="w-8 h-8" />
	</div>
</div>
<div class="">
	<p>{player.name}</p>
	<sub class="font"
		><span class={`text-${player.position}`}>{player.position}</span> - {`${player.xfl_teams.city} ${player.xfl_teams.name}`}</sub
	>
</div>
<div class="flex justify-end">
	<button
		on:click={() => {
			checked = true;
			addPlayer = player;
		}}
		disabled={waiver_request}
		class="btn btn-circle {waiver_request ? '' : 'btn-outline'} flex flex-col {waiver
			? 'btn-secondary'
			: 'btn-primary'}"
		>{waiver ? 'W' : '+'}{#if waiver}<small class="text-[0.5rem]">Tues</small>{/if}</button
	>
</div>
