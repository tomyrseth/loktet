<script>
		import Calendar from './Calendar.svelte';
	
		const today = new Date;
		let calendarOpen = false;
		let dates = 0;
		function openCalendar() {
			calendarOpen = !calendarOpen;
		}

</script>

<svelte:head>
	<title>Tom</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="mainContainer">
	<div class="Menu">
		<div class = "container">
			<button class="programs" on:click={openCalendar}>
				Calendar
			</button>
			<button class="stats">
				Stats
			</button>
		</div>
	</div>
	{#if calendarOpen}
		<div class="calendar">
			{#each {length: 29} as date, i}
				<button>{i+1}</button>
			{/each}
		</div>
	{/if}

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