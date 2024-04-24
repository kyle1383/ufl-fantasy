<div class="flex justify-end">
    <form
        method="POST"
        action="?/drop"
        use:enhance={({ formElement, formData, action, cancel, spanmitter }) => {
            loading = true;
            if (!confirm(`Are you sure you want to drop this ${player.players.name}?`)) {
                cancel();
            }
            return async ({ result, update }) => {
                if (result.type === 'success') {
                    console.log(result);
                    invalidateAll();
                } else if (result.type === 'error') {
                    alert('internal error');
                } else {
                    alert(`Player drop failed; ${result.data.error_message}`);
                }
            };
        }}
    >
        <input type="hidden" name="player_id" value={player.players.id} />
        {#if loading}
            <div
                class="btn btn-sm my-auto btn-error btn-outline btn-circle loading loading-spinner loading-lg"
            />
        {:else}
            <button class="btn-sm btn my-auto btn-error btn-outline btn-circle">-</button>{/if}
    </form>
    
</div>