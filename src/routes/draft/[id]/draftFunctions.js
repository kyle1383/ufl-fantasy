// @ts-nocheck
//imports 
import { supabase } from '$lib/supabaseClient';

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