<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import {browser } from '$app/environment'
</script>

<svelte:head>
	<title>UFL Fantasy</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

{#if !$page.data.session}
	logged out
{:else}
	logged in
{/if}
