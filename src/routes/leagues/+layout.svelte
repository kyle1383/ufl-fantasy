<script>
	import LeaguesHeader from './LeaguesHeader.svelte';
	export let data;
	const { user_leagues } = data;
	
</script>

<div class="bg-black min-h-screen">
	<LeaguesHeader leagues={user_leagues} />
	<slot />
</div>
