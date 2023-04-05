<script>
	export let isLoading = false;
</script>

{#if isLoading}
	<div class="spinner">
		<div class="bounce1 bg-primary" />
		<div class="bounce2 bg-primary" />
		<div class="bounce3 bg-primary" />
	</div>
{/if}

<style>
	.spinner {
		width: 70px;
		text-align: center;
	}

	.spinner > div {
		width: 18px;
		height: 18px;
		border-radius: 100%;
		display: inline-block;
		animation: sk-bounce 2s infinite ease-in-out;
	}

	.spinner .bounce1 {
		animation-delay: -0.32s;
	}

	.spinner .bounce2 {
		animation-delay: -0.16s;
	}

	@keyframes sk-bounce {
		0%,
		80%,
		100% {
			transform: scale(0);
		}
		40% {
			transform: scale(1);
		}
	}
</style>
