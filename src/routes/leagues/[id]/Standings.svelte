<script lang="ts">
    import type { Team } from "../../types";
    import { page } from "$app/stores";
    export let teams: Team[];
</script>
<div class="text-white bg-gray-700 p-8 w-fit rounded-lg border-gray-600 border-2">
    <p class="text-xl">Standings</p>
    
    <table class="table w-auto">
        <!-- head -->
        
        <tbody>
            {#each teams as team, index}
                <tr class="border-solid border-t-2 border-transparent">
                    <td class="pl-0"><p class="rounded-full">{index + 1 }</p></td>
                    <td class="bg-white   font-bold"  style="border-radius: 0 0 0 0.25rem"
                        ><a href={`/leagues/${$page.params.id}/roster/${team.id}`}>{team.name}</a></td
                    >
                    <td class="bg-white ">{team.manager_name}</td>
              
                    <td class="bg-white  "  style="border-radius: 0 0 0.25rem 0">{team.wins}-{team.losses}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
<style>
    table th, td{
        background-color: transparent ;
    }
</style>