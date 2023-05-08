<script>
	import { page } from '$app/stores';
	import LeaguesHeader from './[id]/LeaguesHeader.svelte';
</script>
{#if !$page.data.session}
	logged out
{:else}
	<slot />
{/if}