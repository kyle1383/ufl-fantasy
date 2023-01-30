<script>
	import { enhance } from '$app/forms';
	
</script>

<form
	use:enhance={({ form, data, action, cancel }) => {
		return async ({ result, update }) => {
			//goto('/');
		};
	}}
	method="POST"
>
	<label>
		<button class="btn" type="submit">Update Players</button>
	</label>
</form>
