<script>
	import Start from './[id]/Start.svelte';
    import { supabase } from '$lib/supabaseClient';
   
	const draft_channel = supabase
		.channel('draft-channell')
		.on('postgres_changes', { event: '*', schema: 'public', table: 'draft' }, (payload) => {
			{
				console.log(payload);
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

