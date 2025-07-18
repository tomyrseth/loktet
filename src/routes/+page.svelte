<script lang='ts'>
	export let data;
	console.log(data);
</script>

<svelte:head>
	<title>loktet</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div class="backdrop">
		<h1>
			loktet
		</h1>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	.backdrop {
		display: flex;
		width: 100vw;
		height: 40em;
		margin: 0;
		border: none;
		border-radius: 0%;
	}

	h1 {
		font-size: 12rem;
		font-kerning: auto;
		text-shadow: 7px 7px 1px rgba(0, 0, 0, 0.9);
		letter-spacing: 3px;
		font-weight: bold;
		width: 100%;
		color:rgb(255, 89, 33);
	}

	p {
	color: white;
	font-size: 20px;
 }
</style>