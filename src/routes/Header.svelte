<script>
	import { page } from "$app/stores";
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
			<label tabindex="0" class="btn btn-ghost btn-circle avatar">
				<div class="w-10 rounded-full">
					<img src="https://placeimg.com/80/80/people" />
				</div>
			</label>
			<ul
				tabindex="0"
				class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
			>
				<li>
					<a class="justify-between">
						Profile
						<span class="badge">New</span>
					</a>
				</li>
				<li><a>Settings</a></li>
				<li><a>Logout</a></li>
			</ul>
		</div>
	</div>
</header>
