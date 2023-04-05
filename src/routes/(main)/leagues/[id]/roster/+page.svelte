<script>
    import Roster from '$lib/Roster.svelte'
    export let data;
    const { team } = data;
</script>

<Roster {team} />