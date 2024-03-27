<script lang="ts">
    import Pick from "./Pick.svelte";
	export let size: number;
	export let picks: object[];
    export let players: object[];
   
	$: picks;

	//filter through the number of picks = size and return each team
	let teams = [];
	for (let i = 0; i < size; i++) {
		teams.push(picks[i].teams.name);
	}
    //sort picks by round and pick
    picks.sort((a, b) => {
        if (a.round > b.round) {
            return 1;
        } else if (a.round < b.round) {
            return -1;
        } else {
            if (a.pick > b.pick) {
                return 1;
            } else if (a.pick < b.pick) {
                return -1;
            } else {
                return 0;
            }
        }
    });

	const gridCols = `grid-cols-${size.toString()}`
</script>


<div class="grid grid-cols-{size.toString()} gap-2 p-8 pb-24 bg-black pt-24 lg:pt-48 grid-body overflow-x-scroll" style="grid-template-columns: repeat({size}, minmax(100px, 1fr));">
	{#each teams as team}
		<div class="my-auto">
			<p class="text-white text-center pt-8 lg:pt-0 lg:pb-2 font-bold">{team}</p>
		</div>
	{/each}
	{#each picks as pick}
        <Pick {pick} player={players.find(player => player.name_id == pick.player_id) || null}/>
		
	{/each}
</div>

<style>
	.header-grid {
		
		position: fixed;
		width: 100%;
		left: 0;
		z-index: 1;
	}

	.grid-body {
		max-height: 50%;
		overflow: scroll;
		position: fixed;
		width: 100%;
	}
	@media (max-width: 1024px) {
		.grid {
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		}
	}
</style>
