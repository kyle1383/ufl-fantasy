<script>
	import Players from './Players.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { page } from '$app/stores';
	/**
	 * @type {{ players: any; }}
	 */
	export let data;
	$: currentPick = data.draft.picks.find(pick => pick.round === data.draft.round && pick.pick === data.draft.pick);
	$: players = data.players;
	$: draft = data.draft;
	const picks_channel = supabase
		.channel('picks-channel')
		.on('postgres_changes', { event: '*', schema: 'public', table: 'picks' }, (payload) => {
			{
				payload.eventType === "UPDATE" ? players = players.filter(player => player.name_id !== payload.new.player_id) : null;	
			}
		})
		.subscribe();

	$: console.log(draft.round, draft.pick)

	

</script>

<Players players={players} draft={draft} currentPick={currentPick} />
