<script>
	import { page } from "$app/stores";
	import { supabase } from '$lib/supabaseClient';
</script>
<header class={`navbar bg-oxford `}>
	<div class="flex-1">
		<a href="/" class="btn btn-ghost normal-case text-xl">XFL Fantasy</a>
	</div>
	<div class="flex-none gap-2">
		
		<ul class="menu menu-horizontal px-1">
			<li><a href="/profile">Profile</a></li>
			<li><a href="/leagues">Leagues</a></li>
		</ul>
		<div class="form-control">
			<input type="text" placeholder="Search" class="input input-bordered hidden md:block" />
		</div>
		<div class="dropdown dropdown-end">
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<label tabindex="0" class="btn btn-ghost btn-circle avatar" for="profile-image">
				<div class="w-10 rounded-full" >
					<img src="https://placeimg.com/80/80/people" alt="Profile" id="profile-image"/>
				</div>
			</label>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<ul tabindex="0" class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
				<li>
					<a href="/profile" class="justify-between">
						Profile
						<span class="badge">New</span>
					</a>
				</li>
			

				<li><button on:click={()=>{supabase.auth.signOut()}}>Logout</button></li>
			</ul>
		</div>
	</div>
	
</header>
