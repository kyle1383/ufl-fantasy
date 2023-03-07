<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	!$page.data.session ? goto('/profile') : goto('/leagues')
</script>

<svelte:head>
	<title>Supabase + SvelteKit</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

{#if !$page.data.session}
	
	logged out
{:else}
	logged in
{/if}
