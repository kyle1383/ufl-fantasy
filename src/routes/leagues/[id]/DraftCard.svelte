<script lang="ts">
    import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
    import Icon from '@iconify/svelte';
    import type { League } from '$lib/types';
    export let league: League;
</script>

<div class="text-white bg-gray-700 p-8 rounded-lg border-gray-600 border-2">
	<div class="flex justify-between items-center pb-2">
		<p class="text-xl">Draft Center</p>
		<Icon icon="clarity:settings-line" width="20" />
	</div>
	<!--<form
		use:enhance={({ form, data, action, cancel }) => {
			//TODO is stringify neccessary? why?

			if (league.draft_id) {
				cancel();
				goto(`/draft/${league.draft_id}`);
			}
			/*data.set('league', league.id.toString());
			return async ({ result, update }) => {
                console.log(result)
				if (result.error) {
					update({ error: result.error });
					return;
				}
				goto(`/draft/${result.data.draft?.id}`);
			};*/
		}}
		method="POST"
		action="?/init"
	>
		<button class="btn btn-primary rounded">Enter Draft</button>
	</form>-->
	<a href="/draft/{league.draft_id}" class="btn btn-primary rounded">Enter Draft</a>
</div>
