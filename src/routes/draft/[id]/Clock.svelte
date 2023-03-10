<script>
	// @ts-nocheck
	export let round; 
	export let pick;
	export let currentTeamName; 
	export let timeRemaining;

</script>

<div class="flex justify-center items-center">
	<p><strong>Pick: </strong>{round}.<span>{pick}</span></p>
	<p><strong>On Clock: </strong>{currentTeamName}</p>
	<div class="flex flex-col items-center justify-center text-white text-center">
		<div class="text-3xl font-bold mb-1">
			{timeRemaining.minutes}:{timeRemaining.seconds}
		</div>
	</div>
</div>
