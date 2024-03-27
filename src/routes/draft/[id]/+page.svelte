<script>
	// @ts-nocheck
	import { onDestroy, onMount } from 'svelte';
	import Timer from './Timer.svelte';
	import Players from './Players.svelte';
	import { getTimeRemaining } from './draftFunctions';
	import { enhance } from '$app/forms';
	import Selections from './Selections.svelte';
	import DraftHeader from './DraftHeader.svelte';
	import PlayerGrid from './PlayerGrid.svelte';
	import Favorites from './Favorites.svelte';
	import favorites from './favorites';
	//Define Reactive/load Variables
	let autodraftSubmit;

	export let data;
	let { supabase } = data;
	let players = data.availablePlayers;
	let draft = data.draft;
	let allPlayers = data.players;
	let picks = draft.picks;

	$: positionFilter = 'ALL';
	$: picks;
	$: draft;
	$: players = positionFilter === 'ALL' ? data.availablePlayers : data.availablePlayers.filter((player) => player.position === positionFilter);
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
				if (payload.eventType === 'UPDATE') {
					players = players.filter((player) => player.name_id !== payload.new.player_id);
					//replace pick with same round and pick number
					let updatedPicks = picks;
					let index = updatedPicks.findIndex(
						(pick) => pick.round === payload.new.round && pick.pick === payload.new.pick
					);
					updatedPicks[index] = payload.new;
					picks = updatedPicks;
				}
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
 	
	$: favoritePlayers = data.availablePlayers.filter((player) => JSON.parse($favorites).includes(player.name_id));
</script>

{#if !currentPick}
	<div>Draft over</div>
{:else}
	<div class="w-full">
		<!--<form
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
		</form>-->
		<DraftHeader {draft} currentTeamName={currentPick.teams.name} {timeRemaining} />
		<Selections size={draft.leagues[0].size} {picks} players={allPlayers} />
		<Timer {draft} currentTeamName={currentPick.teams.name} {timeRemaining} />
		<div class="player-section w-full">
			<div class="flex">
				<div class="basis-2/3">
					<PlayerGrid {players} {draft} {currentPick} bind:positionFilter={positionFilter}/>
				</div>
				<div class="basis-1/3"><Favorites players={favoritePlayers}/></div>
			</div>
		</div>
	</div>
{/if}

<style>
	.player-section {
		display: block;
		position: fixed;
		top: 50%;
	}
</style>
