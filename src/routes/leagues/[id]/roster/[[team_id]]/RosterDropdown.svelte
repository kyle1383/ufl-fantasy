<script>
// @ts-nocheck
    import { enhance } from '$app/forms';
    export let position;
    export let players;
    export let team_id;
	function findPlayersByPosition(position) {
		return players.filter((player) => player.players.position === position);
	}
</script>
{#if players}
<div class="dropdown ">
    
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <ul tabindex="0" class="dropdown-content menu p-2 shadow rounded-box w-52 list-none">
        {#each findPlayersByPosition(pos.position) as player}
            <li class=" w-full">
                <form
                    action="roster?/updateRosterPosition"
                    method="POST"
                    use:enhance={({ form, data, action, cancel }) => {
                        //add size to the form data as an
                        data.set('position', JSON.stringify(pos));
                        data.set('player', JSON.stringify(player));
                        data.set('team_id', team_id)
                        return async ({ result, update }) => {
                            console.log(result)
                            update()

                        };
                    }}
                >
                    <button>
                        <td class="whitespace-normal bg-white">
                            <div class="w-10 rounded-full bg-white">
                                <img
                                    src={player.players.img_url}
                                    alt={player.players.name}
                                    class="w-8 h-8"
                                />
                            </div>
                            <div class="text-black">
                                <p>{player.players.name}</p>
                                <p>{player.players.img_url}</p>
                                <sub class="font">
                                    {`${player.players.ufl_teams.city} ${player.players.ufl_teams.name}`}</sub
                                >
                            </div></td
                        >
                    </button>
                </form>
            </li>
        {/each}
    </ul>
</div>
{:else}
<div>Loading</div>
{/if}