<script>
	// @ts-nocheck
	import { enhance } from '$app/forms';
	let size = 8;
    $: checked = false;
   
</script>

<input type="checkbox" id="my-modal" class="modal-toggle" checked={checked} />
<div class="modal">
	<div class="modal-box">
		<label for="my-modal" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
		<form
			use:enhance={({ form, data, action, cancel }) => {
				//add size to the form data as an
				data.set('size', JSON.stringify(size));
				return async ({ result, update }) => {
                    console.log(result)
					//close modal if result okay
					if (result.type === "success") {
                        console.log('okay')
						checked = true;
					} else {
						console.log(result);
					}
				};
			}}
			class="flex flex-col mx-8"
			method="POST"
		>
			<div class="flex items-center space-x-4">
				<label for="name" class="block font-medium ">Name:</label>
				<input type="text" required name="name" id="name" class="form-input rounded-md shadow-sm" />
			</div>

			<div class="flex items-center space-x-4 mt-4">
				<label for="size" class="block font-medium ">Size:</label>
				<select class="select max-w-xs rounded-md shadow-sm" bind:value={size} id="size">
					<option value={2}>2</option>
					<option value={4}>4</option>
					<option value={6}>6</option>
					<option selected value={8}>8</option>
					<option value={10}>10</option>
					<option value={12}>12</option>
					<option value={14}>14</option>
				</select>
			</div>

			<div class="mt-8">
				<button type="submit" class="btn btn-primary">Create League</button>
			</div>
		</form>
	</div>
</div>
