<script>
		import Calendar from "../../components/Calendar.svelte"
		let calendarOpen = false;
		let statsOpen = false;


		function openCalendar() {
			calendarOpen = !calendarOpen;
		}

		function openStats() {
			statsOpen = !statsOpen;
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
			<button class="stats" on:click={openStats}>
				Stats
			</button>
		</div>
	</div>
	{#if calendarOpen}
		<div class="calendar">
			<Calendar/>
		</div>
	{/if}

	{#if statsOpen}
		<div class="stats">
			<h1 class="statsText">Stats go here</h1>
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
		margin: 1px;
		color: var(--main-orange);
		font-size: 20px;
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

	.statsText {
		color: var(--main-orange);
	}
</style>