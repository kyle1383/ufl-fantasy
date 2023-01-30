<script>
    import { page } from '$app/stores'
    $: console.log('page', $page); //$: makes it run everytime it changes
</script>
  
<h1>oops!</h1>
<h2>{$page.status}</h2>
<p>{$page.error?.message}</p>

