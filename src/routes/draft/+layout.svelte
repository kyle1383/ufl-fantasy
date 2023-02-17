<script>
	import Start from './[id]/Start.svelte';
    import { supabase } from '$lib/supabaseClient';
   
	const draft_channel = supabase
		.channel('draft-channell')
		.on('postgres_changes', { event: '*', schema: 'public', table: 'drafts' }, (payload) => {
			{
				draft.pick = payload.new.pick;
				draft.pickEnd = payload.new.pickEnd;
				draft.round = payload.new.round;
				draft.status = payload.new.status;
			}
		})
		.subscribe();
    export let data;
    $: draft = data.draft;
	$: currentPick = draft.picks.find(pick => pick.round === draft.round && pick.pick === draft.pick);

</script>

<div class="w-full">
    <Start draft={draft} currentPick ={currentPick}/>
    <slot />
</div>

