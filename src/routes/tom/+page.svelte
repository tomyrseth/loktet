<script>
		import Calendar from "../../components/Calendar.svelte"
		let calendarOpen = false;
		let statsOpen = false;

		export let data;
		console.log(data);


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
	
	<div class="calendar">
			<Calendar/>
	</div>
</div>


<style>

	.mainContainer {
		display: flex;
		justify-content: center;
	}

	.calendar {
		display: flex;
	}

</style>