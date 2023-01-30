<script>
	import { page } from '$app/stores';
	console.log($page.data)
</script>

{#if !$page.data.session}
	logged out
{:else}
	<slot />
{/if}