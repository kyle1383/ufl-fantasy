<script lang="ts">
    import { page } from "$app/stores";
    import Icon from "@iconify/svelte";
    export let size: number;
    export let teams: number;
    async function copyInvite() {
		await navigator.clipboard.writeText(`Join my UFL fantasy league: ${$page.url}/invite`);
		
        // Alert the copied text
		alert('Copied invite');
	}
</script>


<div class=" text-white bg-gray-700 p-8 rounded-lg border-gray-600 border-2">
    <div class="flex justify-between pb-4">
	<p class="text-xl ">Invite friends to the league!</p>
    <p class="text-lg"><span class="text-acc4 mr-1">{teams}</span>/<span class="ml-1">{size}</span></p>
    </div>

	<button class="btn btn-primary btn-outline rounded" on:click={() => copyInvite()}
		>Copy Invite URL <Icon width="20" class="ml-2" icon="ph:copy" /></button
	>
</div>
