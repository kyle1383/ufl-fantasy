<script>
    import Timer from "./Timer.svelte";
    export let draft;
    export let currentTeamName;
    export let timeRemaining;
</script>
<div class=" p-4 bg-slate-900 draft-header">
    <Timer {draft} {currentTeamName} {timeRemaining} />
</div>
