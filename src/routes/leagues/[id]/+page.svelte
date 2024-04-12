<script lang="ts">
	
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Standings from './Standings.svelte';
	import Invite from './Invite.svelte';
	import Order from './Order.svelte';
	import DraftCard from './DraftCard.svelte';
	import type { Team } from '$lib/types';
	export let data;
	if (!data.league) {
		goto('/leagues');
	}

	const {league} = data;
	const { teams } = league;

	$: league;
	$: teams;
	$: managedTeams = teams.filter((t: Team) => t.manager !== null);
</script>

<div class="grid grid-cols-2 gap-4 lg:w-max my-8">
	{#if  managedTeams.length < league.size}
		<Invite size={league.size} teams={managedTeams.length} />
	{/if}
	<DraftCard {league}/>
	<Order {league} {teams}/>
	<Standings {teams} />
</div>

