<script>
	// @ts-nocheck
	import { supabase } from '$lib/supabaseClient';
	import { onDestroy, onMount } from 'svelte';
	
	import Start from './Start.svelte';
	import Players from './Players.svelte';
	import Clock from './Clock.svelte';
	import { submitDraft, subscribeToRealtime, startTimer, getTimeRemaining } from './draftFunctions';

	//Define Reactive/load Variables
	export let data;
	$: draft = data.draft;
	$: players = data.players;
	$: currentPick = draft.picks.find(
		(pick) => pick.round === draft.round && pick.pick === draft.pick
	);
	let timerInterval;
	let autodrafting = false;

	/**
	 * Subscribe to realtime channels
	 * Draft - {pick, pieckEnd, round, status}
	 * Player - Remove player from list when drafted
	 * Presence - {user_id, status} - update this on presence change
	 */
	subscribeToRealtime(draft, players);

	//Is a user on the clock? - update this check on Draft Change
	$: if (!currentPick.teams.manager) {
		console.log('should now autopick - null');
		if (!autodrafting) {
			autodrafting = true;
			onMount(async () => {
				//setTimeout(()=>{
				console.log('begin')
				const results = await submitDraft(draft, players);
				console.log('end')
				console.log('results', results)
				autodrafting = false;
			//}, 4000);
				
			});
			
		}
		
	}
	//Are they present? - update this on presence change -- TODO

	//Initialize clock
	let timeRemaining = {
		minutes: 0,
		seconds: 0
	};
	$: if (draft.status === 'ACTIVE') {
		timeRemaining = getTimeRemaining(draft.pickEnd);
	}
	timerInterval = setInterval(() => {
		if (draft.status === 'ACTIVE') {
			timeRemaining = getTimeRemaining(draft.pickEnd);
		}
		//Is there time left?
	}, 1000);

	$: timeRemaining.minutes === 0 && timeRemaining.seconds === 0 ? null : null;

	//On Destroy - pause draft, stop timer
	onDestroy(() => {
		const { data, error } = supabase.from('drafts').update({ status: 'PAUSED' }).eq('id', draft.id);
		clearInterval(timerInterval);
		if (error) console.log('error: Draft not paused successdully', error);
	});
</script>

<div class="w-full">
	<Start {draft} />
	<Clock
		round={draft.round}
		pick={draft.pick}
		currentTeamName={currentPick.teams.name}
		{timeRemaining}
	/>
	<Players {players} {draft} {currentPick} />
</div>
