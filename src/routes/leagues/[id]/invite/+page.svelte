<script>
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data;
	let { league } = data;
	$: loading = false;
	onMount(() => {
		const redirectUrl = `/leagues/${$page.params.id}/invite`;
		let currentRedirects = JSON.parse(window.localStorage.getItem('invites') || '[]') || [];
		currentRedirects = currentRedirects.filter(r => r !== null);
		console.log(currentRedirects)
		const updatedRedirects = currentRedirects.includes(redirectUrl)
			? currentRedirects
			: [...currentRedirects, redirectUrl];

		console.log(updatedRedirects)
		window.localStorage.setItem('invites', JSON.stringify(updatedRedirects));
		

		
	});

	function removeLeagueFromInvites() {
		let currentRedirects = JSON.parse(window.localStorage.getItem('invites') || '[]') || [];
		currentRedirects = currentRedirects.filter((r) => r !== null);
		const updatedRedirects = currentRedirects.includes(`/leagues/${$page.params.id}/invite`)
			? currentRedirects.filter((r) => r !== `/leagues/${$page.params.id}/invite`)
			: currentRedirects;

		window.localStorage.setItem('invites', JSON.stringify(updatedRedirects));
	}
</script>

<p class="text-3xl pt-8 pb-4 text-white">Welcome to {league?.name}</p>

<form
	use:enhance={({}) => {
		loading = true;
		return async ({ result }) => {
			loading = false;
			if (result.type === 'success') {
				removeLeagueFromInvites();
				invalidateAll();
				//goto(`/leagues/${league.id}`);
			} else {
				alert(result.data);
			}
		};
	}}
	method="POST"
>
	<input
		type="text"
		class="input w-full input-bordered lg:max-w-xs text-white bg-gray-700 rounded-lg border-gray-600 border-2 lg:mr-2 mr-0 m"
		placeholder="Team name"
		required
		name="name"
		id="name"
	/>
	<label>
		<button class="btn btn-primary btn-outline mt-4 lg:mt-0 w-full lg:w-auto" type="submit" disabled={loading}
			>Join League</button
		>
	</label>
</form>
