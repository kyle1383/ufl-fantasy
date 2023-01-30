<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { prevent_default } from 'svelte/internal';
    let size = 8; 
</script>

<form use:enhance={({ form, data, action, cancel }) => {
    return async ({ result, update }) => {
		goto('/leagues');
    };
  }} method="POST">
	<label>
		Name: <input type="text" required name="name" id="name" />
	</label>
	<label>
		<button class="minus" on:click={(e)=>{e.preventDefault();size-=2}}>-</button>
		size: <input type="number" required name="size" id="size" bind:value={size}/>
		<button class="plus" on:click={(e)=>{e.preventDefault(); size+=2}}>+</button>
	</label>

	<label>
		<button type="submit">Create League</button>
	</label>
</form>
