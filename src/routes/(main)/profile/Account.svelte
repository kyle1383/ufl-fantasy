<script>
	// @ts-nocheck

	import { onMount } from 'svelte';

	export let session;
	
	let loading = false;
	let username = null;
	let password = null;

	onMount(() => {
		getProfile();
	});

	const getProfile = async () => {
		try {
			loading = true;
			const { user } = session;

			const { data, error, status } = await supabase
				.from('profiles')
				.select(`username`)
				.eq('id', user.id)
				.single();

			if (data) {
				username = data.username;
			}

			if (error && status !== 406) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};

	async function updateProfile() {
		try {
			loading = true;
			const { user } = session;

			const updates = {
				id: user.id,
				username,
				updated_at: new Date()
			};

			let { error } = await supabase.from('profiles').upsert(updates);
			//update password
			const { error: passwordError } = await supabase.auth.updateUser({ password: password });

			if (error || passwordError) throw error;
			//toDO: catch passwordError
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	}

	async function signOut() {
		try {
			loading = true;
			let { error } = await supabase.auth.signOut();
			if (error) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	}
</script>

<form class="form-widget" on:submit|preventDefault={updateProfile}>
	<div>
		<input
			id="email"
			type="text"
			placeholder="Email"
			value={session.user.email}
			class="input input-bordered w-full max-w-xs"
			disabled
		/>
	</div>
	<div>
		<input
			id="username"
			type="text"
			bind:value={username}
			placeholder="Username"
			class="input input-bordered w-full max-w-xs"
		/>
	</div>
	<div>
		<input
			id="password"
			type="text"
			bind:value={password}
			placeholder="Password"
			class="input input-bordered w-full max-w-xs"
		/>
	</div>

	<div class="flex">
		<div>
			<input
				type="submit"
				class="btn"
				value={loading ? 'Loading...' : 'Update'}
				disabled={loading}
			/>
		</div>

		<div>
			<button class="btn btn-primary" on:click={signOut} disabled={loading}>Sign Out</button>
		</div>
	</div>
</form>
