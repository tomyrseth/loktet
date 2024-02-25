<script>
	export let data;
	const infos = data.info
	const keys = Object.keys(infos[0]);
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

<table>
	<tr>
		{#each keys as key}
			<th>{key}</th>
		{/each}
	</tr>
	{#each infos as info}
		<tr>
			{#each Object.entries(info) as [a, b]}
				<td>{b}</td>
			{/each}
		</tr>
	{/each}

<!-- 

	<tr>
		{#each Object.entries(data.info[0]) as [a, b]}				
			<th>{a}</th>
		{/each}
	</tr>
	<tr>
		{#each Object.entries(data.info[0]) as [a, b]}
			<td>{b}</td>
		{/each}
	</tr>


	<tr>
		{#each Object.entries(data.users[0]) as [a, b]}
			<th>{a}</th>
		{/each}
	</tr>
	<tr>
		{#each Object.entries(data.users[0]) as [a, b], i}
			<td>{b}</td>
		{/each}
	</tr>
-->
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

	table {
		color: white;
	}

	th {
		border-bottom: solid white 2px;
		padding: 10px;
	}

	td {
		padding-bottom: 50px;
		padding-top: 10px;
		text-align: center;
		border-bottom: solid white 2px;
	}

</style>
