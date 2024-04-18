<script>
	import { page } from '$app/stores';
	import LeagueHeader from './LeagueHeader.svelte';
	//get last url paramater
	export let data;
	
	const {league, user_leagues} = data

</script>
<LeagueHeader week={league.seasons.week} matchups={league.matchups} commissioners={league.commissioners}/>
<div class="lg:mx-24 mx-8">
	
	<slot />
</div>
