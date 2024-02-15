<script lang="ts">
	import { Channel, Socket } from 'phoenix';
	import { onMount } from 'svelte';
    let channel: Channel;
    $: channel
	onMount(() => {
		const socket = new Socket('ws://localhost:4000/socket');

		socket.connect();
		channel = socket.channel('chat:lobby', {});

		channel
			.join()
			.receive('ok', (resp) => {
				console.log('Joined successfully', resp);
			})
			.receive('error', (resp) => {
				console.error('Unable to join', resp);
			});

		// Handle messages received on the channel
		channel.on('message', (payload) => {
			console.log('Received message:', payload);
		});
	});
    
    const send = () => {
        // Send a message to the channel
	    channel.push('message', { text: 'Hello, Phoenix WebSocket!' });
    }
	
</script>

<div>hi</div>
<button class="btn" on:click={send}>send</button>
