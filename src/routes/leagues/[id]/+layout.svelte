<script>
	import { page } from '$app/stores';
	import LeagueHeader from './LeagueHeader.svelte';
	//get last url paramater
	export let data;
	
	const {league, user_leagues} = data

</script>
<LeagueHeader />
<div class="mx-24 ">
	
	<slot />
</div>
