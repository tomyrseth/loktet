<script lang='ts'>
	import Header from '../components/Header.svelte';
	import './styles.css';
	import { SvelteToast } from '@zerodevx/svelte-toast'

</script>

<div class="app">
	<Header />
	<SvelteToast/>

	<main>
		<slot />
	</main>
</div>

<style>

	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
