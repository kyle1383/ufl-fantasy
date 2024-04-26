<script lang="ts">
	export let player;
	

	let passing: object = null;
	let rushing: object = null;
	let receiving: object = null;
	let kicking: object = null;

	// Make 'passing' reactive by depending directly on 'player'
	$: if (player.g_passing && player.position === 'QB' && player.g_passing?.length > 0 ) {
		passing = player.g_passing.reduce(
			(acc, game) => ({
				completions: acc.completions + game.completions,
				attempts: acc.attempts + game.attempts,
				yards: acc.yards + game.yards,
				touchdowns: acc.touchdowns + game.touchdowns,
				interceptions: acc.interceptions + game.interceptions
			}),
			{
				completions: 0,
				attempts: 0,
				yards: 0,
				touchdowns: 0,
				interceptions: 0
			}
		);
	} else {
		// Reset 'passing' when the player does not meet criteria
		passing = null;
	}

	$: if ((player.position === 'QB' || player.position === 'RB') && player.g_rushing?.length > 0) {
		rushing = player.g_rushing.reduce(
			(acc, game) => ({
				attempts: acc.attempts + game.attempts,
				yards: acc.yards + game.yards,
				touchdowns: acc.touchdowns + game.touchdowns
			}),
			{
				attempts: 0,
				yards: 0,
				touchdowns: 0
			}
		);
	} else {
		// Reset 'passing' when the player does not meet criteria
		rushing = null;
	}

	$: if (
		(player.position === 'WR' || player.position === 'TE' || player.position === 'RB') &&
		player.g_receiving?.length > 0
	) {
		receiving = player.g_receiving.reduce(
			(acc, game) => ({
				targets: acc.targets + game.targets,
				receptions: acc.receptions + game.receptions,
				yards: acc.yards + game.yards,
				touchdowns: acc.touchdowns + game.touchdowns
			}),
			{
				targets: 0,
				receptions: 0,
				yards: 0,
				touchdowns: 0
			}
		);
	} else {
		// Reset 'passing' when the player does not meet criteria
		receiving = null;
	}

	$: if (player.position === 'K' && player.g_kicking?.length > 0) {
		kicking = player.g_kicking.reduce(
			(acc, game) => ({
				attempts: acc.attempts + game.attempts,
				made: acc.made + game.made,
				made_50: acc.made_50 + game.made_50
			}),
			{
				attempts: 0,
				made: 0,
				made_50: 0
			}
		);
	} else {
		// Reset 'passing' when the player does not meet criteria
		kicking = null;
	}
</script>

<div class="flex mx-2 lg:ml-4 ml-8">
	<div class="grid grid-cols-1 border-r-2 border-gray-400 text-sm pr-2 lg:pr-4">
		<p class="w-fit">fpts</p>
		<p>{player.fpts || 0}</p>
	</div>
	{#if passing !== null}
		<div class="px-2 lg:px-4 grid grid-cols-5 text-sm gap-x-4 opacity-60 border-r-2 border-gray-400">
			<p class="w-fit text-sm">cmp</p>
			<p class="w-fit text-sm">att</p>
			<p class="w-fit text-sm">yd</p>
			<p class="w-fit text-sm">TD</p>
			<p class="w-fit text-sm">INT</p>
			<p>{passing.completions}</p>
			<p>{passing.attempts}</p>
			<p>{passing.yards}</p>
			<p class="w-fit">{passing.touchdowns}</p>
			<p>{passing.interceptions}</p>
		</div>
	{/if}
	{#if rushing !== null}
		<div
			class="pl-2 lg:pl-4 grid grid-cols-3 text-sm gap-x-4 opacity-60 {receiving !== null
				? 'border-r-2'
				: ''} border-gray-400 px-4"
		>
			<p class="w-fit text-sm">att</p>
			<p class="w-fit text-sm">yd</p>
			<p class="w-fit text-sm">TD</p>

			<p>{rushing.attempts}</p>
			<p>{rushing.yards}</p>
			<p>{rushing.touchdowns}</p>
		</div>
	{/if}
	{#if receiving !== null}
		<div class="pl-2 lg:pl-4 grid grid-cols-4 text-sm gap-x-4 opacity-60">
			<p class="w-fit text-sm">tgt</p>
			<p class="w-fit text-sm">rec</p>
			<p class="w-fit text-sm">yd</p>
			<p class="w-fit text-sm text-sm">TD</p>
			<p>{receiving.targets}</p>
			<p>{receiving.receptions}</p>
			<p>{receiving.yards}</p>
			<p>{receiving.touchdowns}</p>
		</div>
	{/if}

	{#if kicking !== null}
		<div class="pl-2 lg:pl-4 grid grid-cols-3 text-sm gap-x-4 opacity-60">
			<p class="w-fit text-sm">att</p>
			<p class="w-fit text-sm">made</p>
			<p class="w-fit text-sm">50+</p>
			<p>{kicking.attempts}</p>
			<p>{kicking.made}</p>
			<p>{kicking.made_50}</p>
		</div>
	{/if}
</div>
