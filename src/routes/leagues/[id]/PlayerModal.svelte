<script>
	import { calculateWeekFpts, clickOutside } from '$lib/helpers';
	export let player;
	export let week;
	$: player;
	$: console.log(player)
	function handleClickOutside() {
		player = null;
	}

	$: statsByWeek = [];
	$: if (player) {
		for (let i = 1; i < week + 1; i++) {
			const wps = player.players.g_passing.find((stat) => stat.ufl_games.week === i);
			const wrs = player.players.g_receiving.find((stat) => stat.ufl_games.week === i);
			const wrus = player.players.g_rushing.find((stat) => stat.ufl_games.week === i);
			const wks = player.players.g_kicking.find((stat) => stat.ufl_games.week === i);
			const ws = {
				week: i,
				passing: wps,
				receiving: wrs,
				rushing: wrus,
				kicking: wks
			};

			statsByWeek = [...statsByWeek, ws];
		}
	} else {
		statsByWeek = [];
	}
</script>

<input type="checkbox" id="player-modal" class="modal-toggle" checked={player} />
{#if player}
	<div class="modal modal-bottom lg:modal-middle">
		<div
			class="modal-box w-fit text-white bg-gray-700 p-8 rounded-t-lg lg:rounded-b-lg border-gray-600 border-2 flex flex-col"
			use:clickOutside
			on:click_outside={handleClickOutside}
		>
			<div class="flex mb-8">
				<div class="my-auto">
					<div class="flex items-center justify-center">
						<div class="w-10 h-10 rounded-full overflow-hidden bg-cover mr-2">
							<img
								src={player.players.img_url}
								alt={player.players.name}
								class="w-full h-full object-cover"
							/>
						</div>
					</div>
				</div>
				<div class="flex flex-col justify-center">
					<p>{player.players.name}</p>
					<span class="text-xs">
						{`${player.players.position} ${player.players.ufl_teams.city} ${player.players.ufl_teams.name}`}</span
					>
				</div>
			</div>
			<div
				class="grid gap-[2px] w-fit"
				style="grid-template-columns: auto 5px auto 10px  {player.players.position === 'QB'
					? 'auto auto auto auto auto 10px'
					: ''} {player.players.position === 'QB' || player.players.position === 'RB'
					? 'auto auto auto 10px'
					: ''} {player.players.position === 'RB' ||
				player.players.position === 'WR' ||
				player.players.position === 'TE'
					? 'auto auto auto auto 10px'
					: ''} {player.players.position === 'K' ? 'auto auto auto auto auto auto auto' : ''};"
			>
				<p class="col-span-4" />
				{#if player.players.position === 'QB'}
					<p class="col-span-6">Passing</p>
				{/if}

				{#if player.players.position === 'QB' || player.players.position === 'RB'}
					<p class="col-span-4">Rushing</p>
				{/if}
				{#if player.players.position === 'RB' || player.players.position === 'WR' || player.players.position === 'TE'}
					<p class="col-span-5">Receiving</p>
				{/if}
				{#if player.players.position === 'K'}
					<p class="col-span-7">Kicking</p>
				{/if}
				<p>wk</p>
				<p />
				<p>fpts</p>
				<p />
				{#if player.players.position === 'QB'}
					<p>yards</p>
					<p>tds</p>
					<p>cmp</p>
					<p>att</p>
					<p>int</p>
					<p />
				{/if}
				{#if player.players.position === 'QB' || player.players.position === 'RB'}
					<p>yards</p>
					<p>tds</p>
					<p>att</p>
					<p />
				{/if}
				{#if player.players.position === 'RB' || player.players.position === 'WR' || player.players.position === 'TE'}
					<p>yards</p>
					<p>tds</p>
					<p>rec</p>
					<p>tar</p>
					<p />
				{/if}
				{#if player.players.position === 'K'}
					<p>att</p>
					<p>fgm</p>
					<p>19</p>
					<p>29</p>
					<p>39</p>
					<p>49</p>
					<p>50</p>
				{/if}
				{#each statsByWeek as weeklyStats}
					<p>{weeklyStats.week}</p>
					<p />
					<div
						class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
					>
						{calculateWeekFpts(player.players, weeklyStats.week) || 0}
					</div>
					<p />
					{#if player.players.position === 'QB'}
						<p
							class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
						>
							{weeklyStats.passing?.yards || 0}
						</p>
						<p
							class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
						>
							{weeklyStats.passing?.touchdowns || 0}
						</p>
						<p
							class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
						>
							{weeklyStats.passing?.completions || 0}
						</p>
						<p
							class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
						>
							{weeklyStats.passing?.attempts || 0}
						</p>
						<p
							class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
						>
							{weeklyStats.passing?.interceptions || 0}
						</p>
						<p />
					{/if}
					{#if player.players.position === 'QB' || player.players.position === 'RB'}
						<p
							class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
						>
							{weeklyStats.rushing?.yards || 0}
						</p>
						<p
							class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
						>
							{weeklyStats.rushing?.touchdowns || 0}
						</p>
						<p
							class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
						>
							{weeklyStats.rushing?.attempts || 0}
						</p>
						<p />
					{/if}
					{#if player.players.position === 'RB' || player.players.position === 'WR' || player.players.position === 'TE'}
						<p
							class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
						>
							{weeklyStats.receiving?.yards || 0}
						</p>
						<p
							class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
						>
							{weeklyStats.receiving?.touchdowns || 0}
						</p>
						<p
							class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
						>
							{weeklyStats.receiving?.receptions || 0}
						</p>
						<p
							class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
						>
							{weeklyStats.receiving?.targets || 0}
						</p>
						<p />
					{/if}
					{#if player.players.position === 'K'}
						<p
							class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
						>
							{weeklyStats.kicking?.attempts || 0}
						</p>
						<p
							class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
						>
							{weeklyStats.kicking?.made || 0}
						</p>
						<p
							class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
						>
							{weeklyStats.kicking?.made_19 || 0}
						</p>
						<p
							class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
						>
							{weeklyStats.kicking?.made_29 || 0}
						</p>
						<p
							class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
						>
							{weeklyStats.kicking?.made_39 || 0}
						</p>
						<p
							class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
						>
							{weeklyStats.kicking?.made_40 || 0}
						</p>
						<p
							class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
						>
							{weeklyStats.kicking?.made_50 || 0}
						</p>
					{/if}
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
</style>
