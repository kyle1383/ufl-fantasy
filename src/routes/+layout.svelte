<script>
	import { page } from '$app/stores';
	import '../app.css';
	import LogRocket from 'logrocket';
	LogRocket.init('1zkmlx/ufl-fantasy');
	$: user = $page.data.session.user;
	$: console.log('user', user)
	$: console.log('session', $page.data.session)
	if(user){
		console.log('adding to ler')
		LogRocket.identify(user.id, {
		name: user.full_name,
		email: user.email,
	});
	}
	
</script>

<slot />
