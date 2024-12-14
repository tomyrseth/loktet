<script lang='ts'>
	import Calendar from "../../../components/Calendar.svelte"
	import LiftDay from '../../../components/LiftDay.svelte'
  import { type Database } from "$lib/db/database.types";
  import type { PageData } from "../../$types";
	import { showCalendar } from '$lib/stores'
	import { showDay } from '$lib/stores'
	import { day_id } from '$lib/stores'
  import dayjs from "dayjs";
  import { get } from "svelte/store";

	//Backend data
	export let data;

	console.log('All data: ',data); //all data from backend

	let allLifts = data.allLiftsResponse?.data;

	console.log('All days with lifts: ', allLifts); //All lifts for a specific user

	// $ means reactive variable, if data changes in variable it is updates on page instantly
	
	$:daysTable = data.userResponse?.data[0].days;
	$:bwTable = data.userResponse?.data[0].bodyweight;
	$:caloriesTable = data.userResponse?.data[0].calories;
	$:dietPlanTable = data.userResponse?.data[0].diet_plan;
	
	$:exerciseTable = data.exerciseResponse?.data;
	
	$:uid = data.uid;

	//$: console.log(uid);

	//console.log(uid);

	//$:console.log($showDay);
	//$:console.log($day_id);


	function switchComponent() {
		$showCalendar = !$showCalendar;
		$showDay = !$showDay;
	}

	// INSERT JAVASCRIPT for graph below

	


</script>

<svelte:head>
	<title>Tom</title>
	<meta name="description" content="About this app" />
</svelte:head>

<!-- 
comment out div mainContainer if you want like this (removes calendar)
-->

<div class="mainContainer">

	<button on:click={() => switchComponent()}>Gay</button>
	
	<div class="calendar">
		{#if $showCalendar}
			<Calendar {daysTable} {bwTable} {caloriesTable} {dietPlanTable} {uid}/>
		{/if}

		{#if $showDay}
			<LiftDay {daysTable} {bwTable} {caloriesTable} {uid} {exerciseTable}/>
		{/if}
	</div>
</div>


<!-- INSERT GRAPH TESTING STUFF BELOW IN DIVS OR WHAtEVER THE FUCK YOU WANT -->

<div>
	<h2>TeSt graph</h2>
</div>


<!-- CSS BELOW: -->
<style>

	.mainContainer {
		display: flex;
		justify-content: center;
	}

	.calendar {
		display: flex;
	}

</style>