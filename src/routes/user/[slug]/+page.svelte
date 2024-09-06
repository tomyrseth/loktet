<script lang='ts'>
	import Calendar from "../../../components/Calendar.svelte"
  import { type Database } from "$lib/db/database.types";
  import type { PageData } from "../../$types";
	import { userData } from "../../../stores";
  import dayjs from "dayjs";

	export let data;

	const daysTable = data.userResponse?.data[0].days;
	const bwTable = data.userResponse?.data[0].bodyweight;
	const caloriesTable = data.userResponse?.data[0].calories;
	const dietPlanTable = data.userResponse?.data[0].diet_plan;
	
	const uid = data.uid; //Tom

	console.log(uid);

</script>

<svelte:head>
	<title>Tom</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="mainContainer">
	
	<div class="calendar">
			<Calendar {daysTable} {bwTable} {caloriesTable} {dietPlanTable} {uid}/>
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