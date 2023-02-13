<script>
	import Players from './Players.svelte';
	import { supabase } from '$lib/supabaseClient';
	/**
	 * @type {{ players: any; }}
	 */
	export let data;

	const channel = supabase
		.channel('table-db-changes')
		.on(
			'postgres_changes',
			{
				event: 'INSERT',
				schema: 'public',
				table: 'draft',
                filter: 'id=14',
			},
			(payload) => console.log(payload)
		)
		.subscribe();
    console.log(channel)
</script>

<Players players={data.players} />
