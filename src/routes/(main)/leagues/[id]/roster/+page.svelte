<script>
    import Roster from './Roster.svelte';
    export let data;
    const { team } = data;
    const { league } = data
    
</script>

<Roster {team} roster_limits={JSON.parse(league[0].roster_limits)}/>

    

