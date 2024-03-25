<script>
	import { page } from '$app/stores';

	const currentPage = $page.url.pathname.split('/').slice(-1)[0];
</script>
<!--
<header class="navbar">
	<div class="flex-none gap-2">
		<ul class="menu menu-horizontal px-1">
			<li>
				<a
					class="{currentPage === 'waivers' ? 'btn-active' : ''}"
					href={`/leagues/${$page.params.id}/waivers`}>Waivers</a
				>
			</li>
			<li>
				<a
					class="{currentPage === 'roster' ? 'btn-active' : ''}"
					href={`/leagues/${$page.params.id}/roster`}>Roster</a
				>
			</li>
		</ul>
	</div>
</header>
-->
