<script >
	import { page } from '$app/stores';

	export let week;
	export let matchups;
	export let commissioners;

	$: isCommissioner = commissioners.some((c) => c.user_id === $page.data.session?.user.id);
	
</script>

<div class="hidden lg:block w-full text-white">
	<ul class="flex w-full justify-end space-x-4 text-sm border-b-[1px] border-gray-700 py-2 px-24">
		<li><a href="/leagues/{$page.params.id}">Dashboard</a></li>
		<li><a href="/leagues/{$page.params.id}/roster">Roster</a></li>
		<li><a href="/leagues/{$page.params.id}/waivers">Waivers</a></li>
		{#if week && matchups.length !== 0 && matchups}<li><a href="/leagues/{$page.params.id}/matchups/{week}">Matchups</a></li>{/if}
		{#if isCommissioner}<li><a href="/leagues/{$page.params.id}/settings">Settings</a></li>{/if}
		<li><a class="" href="/leagues/{$page.params.id}/draft">Draft</a></li>
	</ul>
</div>
