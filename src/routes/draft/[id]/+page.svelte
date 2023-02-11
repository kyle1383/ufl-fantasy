<script>
    import Players from "./Players.svelte";
    /**
	 * @type {{ players: any; }}
	 */
     export let data;
    console.log(data.draft)
</script>

<Players players={data.players}/>

