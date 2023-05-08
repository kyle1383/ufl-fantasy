<script>
	import { page } from "$app/stores";
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";

	export let data;
	
	let league = data?.league[0];
</script>

<h1>{league.name}</h1>

<form use:enhance={({  }) => {
    return async ({ result}) => {
		result.type === 'success' 
			goto(`/leagues/${league.id}`);
    };
  }} method="POST">

	 <input type="text" class="input input-bordered w-full max-w-xs" placeholder="Team name" required name="name" id="name" />
	<label>
		<button class="btn" type="submit">Join League</button>
	</label>
</form>
