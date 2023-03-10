// @ts-nocheck
//imports 
import { supabase } from '$lib/supabaseClient';


export async function submitDraft(draft, players) {
	
	
	let data = JSON.stringify({
		draft: JSON.stringify(draft),
		players: players
	});
	
	const res = await fetch(`http://localhost:5173/draft/autodraft`, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: data
	  });
	const pick = await res.json();
	return pick;
}

export function subscribeToRealtime(draft, players) {
	const draft_channel = supabase
		.channel('draft-channel')
		.on('postgres_changes', { event: '*', schema: 'public', table: 'drafts' }, (payload) => {
			{
				console.log(payload)
				draft.pick = payload.new.pick;
				draft.pickEnd = payload.new.pickEnd;
				draft.round = payload.new.round;
				draft.status = payload.new.status;
			}
		})
		.subscribe();

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
}

export function startTimer(timeRemaining, pickEnd) {
	/*const timerInterval = setInterval(() => {
		timeRemaining = getTimeRemaining(pickEnd);
		if (timeRemaining.minutes === 0 && timeRemaining.seconds === 0) {
			clearInterval(timerInterval);
		}
	}, 1000);*/
	timeRemaining = getTimeRemaining(pickEnd);
	return timeRemaining;
}

export function getTimeRemaining(endtime) {
	const total = Date.parse(endtime) - Date.parse(new Date());
	let seconds = Math.floor((total / 1000) % 60);
	let minutes = Math.floor((total / 1000 / 60) % 60);

	seconds = seconds < 0 ? 0 : seconds;
	minutes = minutes < 0 ? 0 : minutes;

	return {
		minutes,
		seconds
	};
}