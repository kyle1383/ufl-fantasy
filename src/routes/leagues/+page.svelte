<script>
	import { page } from '$app/stores';
	import Leagues from './Leagues.svelte';
</script>

<svelte:head>
	<title>Xfl Fantasy</title>
	<meta name="description" content="Xfl fantasy app" />
</svelte:head>

{#if !$page.data.session}
	logged out
{:else}
	<Leagues />
{/if}


