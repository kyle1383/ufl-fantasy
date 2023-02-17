<script>
	// @ts-nocheck

	import { onMount, onDestroy } from 'svelte';

	export let draft;
	export let currentPick;
	$: draft.pickEnd;

	let timerInterval;
	let timeRemaining = {
		minutes: 0,
		seconds: 0
	};

	function getTimeRemaining(endtime) {
		const total = Date.parse(endtime) - Date.parse(new Date());
		let seconds = Math.floor((total / 1000) % 60);
		let minutes = Math.floor((total / 1000 / 60) % 60);
		seconds = seconds < 10 ? '0' + seconds : seconds;

		return {
			minutes,
			seconds
		};
	}

	function startTimer() {
		timerInterval = setInterval(() => {
			timeRemaining = getTimeRemaining(draft.pickEnd);
			if (timeRemaining.minutes === 0 && timeRemaining.seconds === 0) {
				clearInterval(timerInterval);
			}
		}, 1000);
	}

	$: {
		draft.status === 'ACTIVE' && startTimer();
	}

	async function submitDraft() {
		const res = await fetch('?/draft', {
			method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
			body: {
        draft: JSON.stringify(draft),
        autodraft: true, 
        player_id: null
      }
		});

		if (res.ok) {
			// Handle success
		} else {
			// Handle error
		}
	}

	//if currentPick Team is null, then call /draft POST request
	onMount(() => {
		if (!currentPick.teams.manager) {
			submitDraft();
		}
	});

	onDestroy(() => {
		clearInterval(timerInterval);
	});
</script>

<div class="flex justify-center items-center">
	<div class="flex flex-col items-center justify-center text-white text-center">
		<div class="text-3xl font-bold mb-1">
			{timeRemaining.minutes}:{timeRemaining.seconds}
		</div>
	</div>
</div>
