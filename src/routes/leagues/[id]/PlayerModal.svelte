<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { calculateFpts, calculateWeekFpts, clickOutside, showToast } from '$lib/helpers';

	export let player;
	export let week;
	$: player;

	function handleClickOutside() {
		player = null;
	}


	$: statsByWeek = [];
	$: if (player) {
		for (let i = 1; i < week + 1; i++) {
			const wps = player.g_passing.find((stat) => stat.ufl_games.week === i);
			const wrs = player.g_receiving.find((stat) => stat.ufl_games.week === i);
			const wrus = player.g_rushing.find((stat) => stat.ufl_games.week === i);
			const wks = player.g_kicking.find((stat) => stat.ufl_games.week === i);
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

	$: loading = false;
</script>

<input type="checkbox" id="player-modal" class="modal-toggle" checked={player} />
{#if player}
	<div class="modal modal-bottom lg:modal-middle">
		<div
			class="modal-box w-fit text-white bg-gray-700 p-8 rounded-t-lg lg:rounded-b-lg border-gray-600 border-2 flex flex-col"
			use:clickOutside
			on:click_outside={handleClickOutside}
		>
			<div class="flex mb-8 justify-between space-x-8">
				<div class="flex">
					<div class="my-auto">
						<div class="flex items-center justify-center">
							<div class="w-10 h-10 rounded-full overflow-hidden bg-cover mr-2">
								<img src={player.img_url} alt={player.name} class="w-full h-full object-cover" />
							</div>
						</div>
					</div>
					<div class="flex flex-col justify-center">
						<p>{player.name}</p>
						<span class="text-xs">
							{`${player.position} ${player.ufl_teams.city} ${player.ufl_teams.name}`}</span
						>
					</div>
				</div>
				{#if $page.url.pathname.includes('roster')}
				<form
					method="POST"
					action="?/drop"
					use:enhance={({ formElement, formData, action, cancel, spanmitter }) => {
						loading = true;
						if (!confirm(`Are you sure you want to drop ${player.name}?`)) {
							loading = false
							cancel();
						}
						return async ({ result, update }) => {
							if (result.type === 'success') {
								
								showToast('Player dropped successfully');
								loading = false;
								player = null;
								invalidateAll();
							} else if (result.type === 'error') {
								alert('internal error');
							} else {
								alert(`${result.data.error_message}`);
							}
						};
					}}
				>
				<input type="hidden" name="player_id" value={player.id}/>
					<button class="btn btn-error btn-outline rounded-lg mr-2" disabled={loading}> Drop </button>
				</form>
				
				{/if}
			</div>
			<div
				class="grid gap-[2px] w-fit self-center"
				style="grid-template-columns: auto 5px auto 10px  {player.position === 'QB'
					? 'auto auto auto auto auto 10px'
					: ''} {player.position === 'QB' || player.position === 'RB'
					? 'auto auto auto 10px'
					: ''} {player.position === 'RB' || player.position === 'WR' || player.position === 'TE'
					? 'auto auto auto auto 10px'
					: ''} {player.position === 'K' ? 'auto auto auto auto auto auto auto' : ''};"
			>
				<p class="col-span-4" />
				{#if player.position === 'QB'}
					<p class="col-span-6 text-gray-300 text-sm p-0">Passing</p>
				{/if}

				{#if player.position === 'QB' || player.position === 'RB'}
					<p class="col-span-4 text-gray-300 text-sm">Rushing</p>
				{/if}
				{#if player.position === 'RB' || player.position === 'WR' || player.position === 'TE'}
					<p class="col-span-5 text-gray-300 text-sm">Receiving</p>
				{/if}
				{#if player.position === 'K'}
					<p class="col-span-7 text-gray-300 text-sm">Kicking</p>
				{/if}

				<p class="col-span-2" />
				<p class="mt-2 text-center">fpts</p>
				<p />

				{#if player.position === 'QB'}
					<p class="px-1">yards</p>
					<p class="px-1">tds</p>
					<p class="px-1">cmp</p>
					<p class="px-1">att</p>
					<p class="px-1">int</p>
					<p />
				{/if}
				{#if player.position === 'QB' || player.position === 'RB'}
					<p class="px-1">yds</p>
					<p class="px-1">tds</p>
					<p class="px-1">att</p>
					<p />
				{/if}
				{#if player.position === 'RB' || player.position === 'WR' || player.position === 'TE'}
					<p class="px-1">yds</p>
					<p class="px-1">tds</p>
					<p class="px-1">rec</p>
					<p class="px-1">tar</p>
					<p />
				{/if}
				{#if player.position === 'K'}
					<p class="px-1">att</p>
					<p class="px-1">fgm</p>
					<p class="px-1">19</p>
					<p class="px-1">29</p>
					<p class="px-1">39</p>
					<p class="px-1">49</p>
					<p class="px-1">50</p>
				{/if}
				<p class="flex items-center">2024</p>
				<p />
				<div
					class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
				>
					{calculateFpts(player) || 0}
				</div>
				<p />
				{#if player.position === 'QB'}
					<p
						class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
					>
						{player.g_passing.reduce((acc, stat) => acc + stat.yards, 0)}
					</p>
					<p
						class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
					>
						{player.g_passing.reduce((acc, stat) => acc + stat.touchdowns, 0)}
					</p>
					<p
						class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
					>
						{player.g_passing.reduce((acc, stat) => acc + stat.completions, 0)}
					</p>
					<p
						class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
					>
						{player.g_passing.reduce((acc, stat) => acc + stat.attempts, 0)}
					</p>
					<p
						class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
					>
						{player.g_passing.reduce((acc, stat) => acc + stat.interceptions, 0)}
					</p>
					<p />
				{/if}
				{#if player.position === 'QB' || player.position === 'RB'}
					<p
						class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
					>
						{player.g_rushing.reduce((acc, stat) => acc + stat.yards, 0)}
					</p>
					<p
						class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
					>
						{player.g_rushing.reduce((acc, stat) => acc + stat.touchdowns, 0)}
					</p>
					<p
						class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
					>
						{player.g_rushing.reduce((acc, stat) => acc + stat.attempts, 0)}
					</p>
					<p />
				{/if}
				{#if player.position === 'RB' || player.position === 'WR' || player.position === 'TE'}
					<p
						class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
					>
						{player.g_receiving.reduce((acc, stat) => acc + stat.yards, 0)}
					</p>
					<p
						class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
					>
						{player.g_receiving.reduce((acc, stat) => acc + stat.touchdowns, 0)}
					</p>
					<p
						class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
					>
						{player.g_receiving.reduce((acc, stat) => acc + stat.receptions, 0)}
					</p>
					<p
						class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
					>
						{player.g_receiving.reduce((acc, stat) => acc + stat.targets, 0)}
					</p>
					<p />
				{/if}
				{#if player.position === 'K'}
					<p
						class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
					>
						{player.g_kicking.reduce((acc, stat) => acc + stat.attempts, 0)}
					</p>
					<p
						class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
					>
						{player.g_kicking.reduce((acc, stat) => acc + stat.made, 0)}
					</p>
					<p
						class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
					>
						{player.g_kicking.reduce((acc, stat) => acc + stat.made_19, 0)}
					</p>
					<p
						class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
					>
						{player.g_kicking.reduce((acc, stat) => acc + stat.made_29, 0)}
					</p>
					<p
						class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
					>
						{player.g_kicking.reduce((acc, stat) => acc + stat.made_39, 0)}
					</p>
					<p
						class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
					>
						{player.g_kicking.reduce((acc, stat) => acc + stat.made_40, 0)}
					</p>
					<p
						class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
					>
						{player.g_kicking.reduce((acc, stat) => acc + stat.made_50, 0)}
					</p>
				{/if}
				<p class="mt-4">wk</p>
				<p />
				<p class="mt-4 text-center">fpts</p>
				<p />

				{#if player.position === 'QB'}
					<p class="px-1 mt-4">yards</p>
					<p class="px-1 mt-4">tds</p>
					<p class="px-1 mt-4">cmp</p>
					<p class="px-1 mt-4">att</p>
					<p class="px-1 mt-4">int</p>
					<p />
				{/if}
				{#if player.position === 'QB' || player.position === 'RB'}
					<p class="px-1 mt-4">yds</p>
					<p class="px-1 mt-4">tds</p>
					<p class="px-1 mt-4">att</p>
					<p />
				{/if}
				{#if player.position === 'RB' || player.position === 'WR' || player.position === 'TE'}
					<p class="px-1 mt-4">yds</p>
					<p class="px-1 mt-4">tds</p>
					<p class="px-1 mt-4">rec</p>
					<p class="px-1 mt-4">tar</p>
					<p />
				{/if}
				{#if player.position === 'K'}
					<p class="px-1 mt-4">att</p>
					<p class="px-1 mt-4">fgm</p>
					<p class="px-1 mt-4">19</p>
					<p class="px-1 mt-4">29</p>
					<p class="px-1 mt-4">39</p>
					<p class="px-1 mt-4">49</p>
					<p class="px-1 mt-4">50</p>
				{/if}
				{#each statsByWeek as weeklyStats}
					<p class="flex items-center">{weeklyStats.week}</p>
					<p />
					<div
						class="text-white bg-gray-700 p-1 w-full text-center rounded-lg border-gray-600 border-2"
					>
						{calculateWeekFpts(player, weeklyStats.week) || 0}
					</div>
					<p />
					{#if player.position === 'QB'}
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
					{#if player.position === 'QB' || player.position === 'RB'}
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
					{#if player.position === 'RB' || player.position === 'WR' || player.position === 'TE'}
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
					{#if player.position === 'K'}
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
	.modal-box {
		width: 100% !important;
		@media (min-width: 1024px) {
			width: fit-content !important;
		}
	}
</style>
