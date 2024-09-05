<script lang='ts'>
	import Calendar from "../../../components/Calendar.svelte"
  import { type Database } from "$lib/db/database.types";
  import type { PageData } from "../../$types";
	import { userData } from "../../../stores";

	export let data;
	
	const uid = 1; //Tom

	//$userData = data;

	//console.log($userData);
	console.log(data);

</script>

<svelte:head>
	<title>Tom</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="mainContainer">
	
	<div class="calendar">
			<!-- <Calendar {daysTable} {bwTable} {caloriesTable} {dietPlanTable} {uid}/> -->
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