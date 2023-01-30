<script>
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import '../app.css';

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<Header />
<div class="container" style="padding: 50px 0 100px 0">
	<slot />
</div>
<Footer />
