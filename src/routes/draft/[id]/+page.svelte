<script>
	// @ts-nocheck
	import { supabase } from '$lib/supabaseClient';
	import { onDestroy, onMount } from 'svelte';

	import Timer from './Timer.svelte';
	import Players from './Players.svelte';
	import { getTimeRemaining } from './draftFunctions';
	import { enhance } from '$app/forms';

	//Define Reactive/load Variables
	let autodraftSubmit;

	export let data;
	let players = data.players;
	let draft = data.draft;
	$: draft;
	$: players;
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
	//TODO - does this cause issue if start is pressed too 	quickly?
	const picks_channel = supabase
		.channel('picks-channel')
		.on('postgres_changes', { event: '*', schema: 'public', table: 'picks' }, (payload) => {
			{
				payload.eventType === 'UPDATE'
					? (players = players.filter((player) => player.name_id !== payload.new.player_id))
					: null;
			}
		})
		.subscribe();

	const draft_channel = supabase
		.channel('draft-channel')
		.on('postgres_changes', { event: '*', schema: 'public', table: 'drafts' }, (payload) => {
			{
				let updatedDraft = draft;
				updatedDraft.pick = payload.new.pick;
				updatedDraft.pickEnd = payload.new.pickEnd;
				updatedDraft.round = payload.new.round;
				updatedDraft.status = payload.new.status;
				draft = updatedDraft;
			}
		})
		.subscribe();

	//Is a user on the clock? - update this check on Draft Change
	//TODO - autodrafts even when I am on the clock
	$: if (!currentPick?.teams.manager && currentPick) {
		onMount(() => {
			if (!autodrafting) {
				autodrafting = true;
				setTimeout(async () => {
					console.log('[AUTODRAFT] - CPU on Clock');
					//autodraftSubmit.click();
					autodrafting = false;
				}, 4000);
			}
		});
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

{#if !currentPick}
	<div>Draft over</div>
{:else}
	<div class="w-full">
		<form
			method="POST"
			action="?/autodraft"
			use:enhance={({ form, data, action, cancel }) => {
				//add roster_limits to the form data
				data.set('player', JSON.stringify(players[0]));
				data.set('draft', JSON.stringify(draft));
				//add size to the form data as an
				return async ({ result, update }) => {};
			}}
		>
			<button bind:this={autodraftSubmit} class="btn" type="submit">AutoDraft</button>
		</form>
		<Timer {draft} {timeRemaining} currentTeamName={currentPick.teams.name} />
		<Players {players} {draft} {currentPick} />
	</div>
{/if}
