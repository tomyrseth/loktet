<script lang='ts'>
	import Calendar from "../../../components/Calendar.svelte"
	import LiftDay from '../../../components/LiftDay.svelte'
  import { type Database } from "$lib/db/database.types";
  import type { PageData } from "../../$types";
	import { showCalendar } from '$lib/stores'
	import { showDay } from '$lib/stores'
	import { day_id } from '$lib/stores'
  import dayjs from "dayjs";

	export let data;

	$:daysTable = data.userResponse?.data[0].days;
	$:bwTable = data.userResponse?.data[0].bodyweight;
	$:caloriesTable = data.userResponse?.data[0].calories;
	$:dietPlanTable = data.userResponse?.data[0].diet_plan;
	
	$:uid = data.uid;

	//$: console.log(uid);

	//console.log(uid);

	//$:console.log($showDay);
	//$:console.log($day_id);


	function switchComponent() {
		$showCalendar = !$showCalendar;
		$showDay = !$showDay;
	}


</script>

<svelte:head>
	<title>Tom</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="mainContainer">

	<button on:click={() => switchComponent()}>Gay</button>
	
	<div class="calendar">
		{#if $showCalendar}
			<Calendar {daysTable} {bwTable} {caloriesTable} {dietPlanTable} {uid}/>
		{/if}

		{#if $showDay}
			<LiftDay {daysTable} {uid}/>
		{/if}
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