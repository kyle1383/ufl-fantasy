<script>
    import { page } from "$app/stores";
    //get last url paramater 
    const currentPage = $page.url.pathname.split('/').slice(-1)[0];
</script>
<div class="btn-group">
    <ul>
        <li><a class="btn btn-sm {currentPage === 'waivers' ? 'btn-active' : ''}" href={`/leagues/${$page.params.id}/waivers`}>Waivers</a></li>
        <li><a class="btn btn-sm {currentPage === 'roster' ? 'btn-active' : ''}" href={`/leagues/${$page.params.id}/roster`}>Roster</a></li>
    </ul>
</div>
<slot />