<script>
	import { page } from "$app/stores";
	let hide = false; 
	$page.route.id === '/leagues/[id]/(drafts)/mock' ? hide = true : hide = false; 
</script>
<footer class={`bg-oxford p-8 ${hide ? 'hidden' : ''}`}>
	<p >Footer</p>
</footer>
