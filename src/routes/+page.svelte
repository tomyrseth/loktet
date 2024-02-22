<script>
	export let data;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		progressive web app
	</h1>
</section>

<pre>
	<code>{JSON.stringify(data, null, 2)}</code>
</pre>

<table>
	
</table>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
		color:rgb(255, 89, 33);
	}
</style>
