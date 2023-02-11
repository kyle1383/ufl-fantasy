<script>
	import { page } from '$app/stores';
</script>

{#if !$page.data.session}
	logged out
{:else}
	<slot />
{/if}