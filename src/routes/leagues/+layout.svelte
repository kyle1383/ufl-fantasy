<script>
	import LeaguesHeader from './LeaguesHeader.svelte';
	export let data;
	const { user_leagues } = data;
	const supabase = data.supabase;
</script>

<div class="bg-black min-h-screen">
	<LeaguesHeader leagues={user_leagues} {supabase}/>
	<slot />
</div>
