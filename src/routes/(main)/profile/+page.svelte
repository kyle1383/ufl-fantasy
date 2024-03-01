<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	export let data; 
	let {supabase} = data;
	onMount(async ()=>{
		const session = await supabase.auth.getSession()
		console.log(session)
	})
</script>

<svelte:head>
	<title>UFL Fantasy</title>
	<meta name="description" content="SvelteKit using supabase-js v2" />
</svelte:head>

{#if !$page.data.session}
	<p>not  logged in</p>
	
{:else}
	<p>logged in</p>
	<button on:click={()=>supabase.auth.signOut()}>Log Out</button>
{/if}
