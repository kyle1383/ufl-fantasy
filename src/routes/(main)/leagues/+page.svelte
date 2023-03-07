<script>
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { redirect } from '@sveltejs/kit';
	import Leagues from './Leagues.svelte';

	if(!$page.data.session){
		if(browser){ 
			goto('/profile')
		}else {
			throw redirect(302, '/profile') 
		}
	}  

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
