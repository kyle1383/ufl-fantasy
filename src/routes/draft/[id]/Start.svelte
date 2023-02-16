<script>
// @ts-nocheck
   
    import { enhance } from "$app/forms";
    export let draft;
    export let currentPick;
   
</script>
<header class="navbar">
    <form method="POST" action="?/start" use:enhance>
        <button class="btn btn-ivory">Start</button>
    </form>

    <p><strong>Pick: </strong>{draft.round}.<span>{draft.pick}</span></p>
    <p><strong>On Clock: </strong>{currentPick.teams.name}</p>
   
</header>