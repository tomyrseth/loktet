<script lang='ts'>
	export let data;
	console.log(data);
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		loktet
	</h1>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		font-size: 12rem;
		font-weight: bold;
		width: 100%;
		color:rgb(255, 89, 33);
	}

	p {
	color: white;
	font-size: 20px;
 }
</style>