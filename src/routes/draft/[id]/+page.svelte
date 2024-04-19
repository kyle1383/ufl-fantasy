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
	import { page } from '$app/stores';
	//Define Reactive/load Variables

	export let data;
	let { supabase } = data;
	let availablePlayers = data.availablePlayers;
	let draft = data.draft;
	let allPlayers = data.players;
	let picks = draft.picks;

	$: positionFilter = 'ALL';
	$: picks;
	$: draft;
	
	$: availablePlayers;
	$: availablePlayers.map((player) => {
		//passing points = 
		const passingPts = player.g_passing.reduce((acc, pStats) => acc + (pStats.touchdowns * 4 + pStats.yards/25 - pStats.interceptions * 2), 0);
		const rushingPts = player.g_rushing.reduce((acc, rStats) => acc + (rStats.touchdowns * 6 + rStats.yards/10), 0);
		const receivingPts = player.g_receiving.reduce((acc, rStats) => acc + (rStats.touchdowns * 6 + rStats.yards/10), 0);
		const kickingPts = player.g_kicking.reduce((acc, kStats) => acc + (kStats.made_19 * 3 + kStats.made_29 + kStats.made_39 * 3 + kStats.made_49 * 4 + kStats.made_50 * 5), 0);
		player.fpts = Math.round((passingPts + rushingPts + receivingPts + kickingPts) * 100) / 100;
		return player;
	});

	$: availablePlayers.sort((a, b) => b.fpts - a.fpts);
	$: players = positionFilter === 'ALL' ? availablePlayers : availablePlayers.filter((player) => player.position === positionFilter);
	$: currentPick = draft.picks.find(
		(pick) => pick.round === draft.round && pick.pick === draft.pick
	);

	//sort players by fpts
	

	let timerInterval;
	const isCommissioner = draft.leagues[0]?.commissioners[0].user_id === $page.data.session.user.id;
	
	
	/**
	 * Subscribe to realtime channels
	 * Draft - {pick, pieckEnd, round, status}
	 * Player - Remove player from list when drafted
	 * Presence - {user_id, status} - update this on presence change
	 */
	//TODO - does this cause issue if start is pressed too 	quickly?
	const picks_channel = supabase
		.channel('picks-channel')
		.on('postgres_changes', { event: '*', schema: 'public', table: 'picks', filter: `draft_id=eq.${draft.id}` }, (payload) => {
			{
				if (payload.eventType === 'UPDATE') {
					if (payload.new.draft_id !== draft.id) return;
					availablePlayers = availablePlayers.filter((player) => player.id !== payload.new.player_id);
					favoritePlayers = favoritePlayers.filter((player) => player.id !== payload.new.player_id);

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
		.on('postgres_changes', { event: '*', schema: 'public', table: 'drafts', filter: `id=eq.${draft.id}` }, (payload) => {
			
			if (payload.new.id !== draft.id) return;
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
	
	//Are they present? - update this on presence change -- TODO

	//Initialize clock
	/*let timeRemaining = {
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

	$: timeRemaining.minutes === 0 && timeRemaining.seconds === 0 ? null : null;*/

	//On Destroy - pause draft, stop timer
	onDestroy(() => {
		const { data, error } = supabase.from('drafts').update({ status: 'PAUSED' }).eq('id', draft.id);
		clearInterval(timerInterval);
		if (error) console.log('error: Draft not paused successdully', error);
	});
 	
	$: favoritePlayers = data.availablePlayers.filter((player) => JSON.parse($favorites).includes(player.id));
</script>

<div class="w-full">
	<DraftHeader {draft} currentTeamName={currentPick?.teams.name} timeRemaining={null} />
	<Selections size={draft.leagues[0].size} {picks} players={allPlayers} {isCommissioner} {draft} />

	<div class="player-section w-full">
		<div class="flex w-full">
			<div class="lg:basis-2/3 w-full lg:w-auto relative">
				<PlayerGrid {players} {draft} {currentPick} bind:positionFilter />
			</div>
			<div class="lg:basis-1/3 hidden lg:block"><Favorites players={favoritePlayers} /></div>
		</div>
	</div>
</div>

<style>
	.player-section {
		display: block;
		position: fixed;
		top: 50%;
	}
</style>
