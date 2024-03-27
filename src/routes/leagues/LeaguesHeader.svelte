<script lang="ts">
    import { page } from '$app/stores';
	import type { League } from '../types';
	import Icon from '@iconify/svelte';
	export let leagues: League[] = [];

    $: league = $page.data.league || leagues.find(l => l.id.toString() === $page.params.id);
    const nonActiveLeagues = leagues.filter(l => l.id.toString() !== $page.params.id);
    $: console.log(league)
</script>


<div class="flex justify-between items-center w-full px-24 py-2 bg-gray-700 text-white">
    <div class="dropdown">
        <div tabindex="0" role="button" class="m-1 flex items-center space-x-8 font-bold">
            {league?.name || 'Leagues Dashboard'}
            <Icon width="10" class="ml-2" icon="teenyicons:down-outline" />
        </div>
        <ul class="dropdown-content z-[1] menu p-2 shadow bg-black rounded-box w-52">
            {#if league}
                <li><a href="/leagues">Leagues Dashboard</a></li>
            {/if}
            {#each nonActiveLeagues as l}
                <li><a href="/leagues/{l.id}">{l.name}</a></li>
            {/each}
        </ul>
    </div>
    <a href="/" class="orbitron">UFL FANTASY <span class="text-xs text-acc4">(BETA)</span></a>
    <p class="flex space-x-2">
        <Icon icon="clarity:settings-line" width=20/>
        <Icon icon="clarity:avatar-line" width="20" />
    </p>
</div>