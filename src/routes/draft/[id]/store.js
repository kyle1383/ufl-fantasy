//Store.js

import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';
const DraftStore = writable([
  
]);

const picks_channel = supabase
.channel('custom-all-channel')
.on('postgres_changes', { event: '*', schema: 'public', table: 'picks' }, (payload) => {
    {DraftStore.update((currentData) => {
        return [payload, ...currentData];
      });}
})
.subscribe();

export default DraftStore;
