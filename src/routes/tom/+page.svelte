<script>
		import Calendar from "../../components/Calendar.svelte";
		let programsOpen = false;
		let dates = 
		function openPrograms() {
			programsOpen = true;
		}
</script>

<svelte:head>
	<title>Tom</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="Menu">
	<div class = "container">
		<button class="programs" on:click={openPrograms}>
			Programs
		</button>
		<button class="stats">
			Stats		
		</button>
	</div>

	<div class="calendar">
			{#each {length: 29} as date, i}
				<button>{i+1}</button>
			{/each}
	</div>
</div>

<style>
	button {
		display: flex;
		transition: .2s;
		color:white;
		background-color: rgb(80, 80, 80);
		border: solid black 2px;
		border-radius: 5px;

		height: 150px;
		width: 150px;
		margin: 1px;
		text-align: left;
	}
	button:hover {
		border: solid white 2px;
	}
	button:active {
		background-color: rgb(31, 31, 31);
	}

	.programs {
		display: flex;
	}
	.stats {
		display: flex;
	}

	.container {
		display: flex;
		flex-direction: row;
	}
	.calendar {
		display: flex;
		flex-wrap: wrap;
	}
</style>