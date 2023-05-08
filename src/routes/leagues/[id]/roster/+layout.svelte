<script>
	export let data;
	const { team } = data;
</script>
<div class="bg-gradient-to-br from-acc5 from-10% to-raisin to-90%">
<div class="flex p-4 justify-center ">
	<div class="w-10  avatar mx-4 h-12 w-12">
		<img
			src="https://placeimg.com/80/80/people"
			alt="Profile"
			id="profile-image"
			class="rounded-full"
		/>
	</div>
	<div class="team-info">
		<strong>{team.name}</strong>

		<p>
			{team.profiles.username} |
			{team.wins}-{team.losses}
		</p>
	</div>
</div>

<slot />

</div>