<script>
    import Roster from './Roster.svelte';
    export let data;
    //const { team } = data;
    //const { league } = data;
    $: team = data.team
    $: league = data.league

    
</script>

<Roster {team} roster_spots={JSON.parse(league[0].roster_limits)}/>

    

