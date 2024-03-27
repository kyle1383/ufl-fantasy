<script>
	import { page } from "$app/stores";
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";

	export let data;
	
	let {league} = data
	
</script>

<p class="text-3xl py-2 mb-4 text-white">Welcome to {league.name}</p>

<form use:enhance={({  }) => {
    return async ({ result}) => {
		result.type === 'success' 
			goto(`/leagues/${league.id}`);
    };
  }} method="POST">

	 <input type="text" class="input input-bordered max-w-xs text-white bg-gray-700 rounded-lg border-gray-600 border-2 mr-2" placeholder="Team name" required name="name" id="name" />
	<label>
		<button class="btn btn-primary btn-outline" type="submit">Join League</button>
	</label>
</form>
