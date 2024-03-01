<script>
	import { browser } from '$app/environment';
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { redirect } from '@sveltejs/kit';
	import Leagues from './Leagues.svelte';

	export let data;
	const user_leagues = data.user_leagues;
</script>

<svelte:head>
	<title>Xfl Fantasy</title>
	<meta name="description" content="Xfl fantasy app" />
</svelte:head>

{#if !$page.data.session}
	<p></p>
{:else}
	<Leagues {user_leagues}/>
{/if}
