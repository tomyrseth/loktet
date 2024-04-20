<script lang='ts'>
	import Calendar from "../../components/Calendar.svelte"
  import { type Database } from "$lib/types/supabase";
	export let data:Database;


	const daysData = data.daysRes.data;
	const bwData = data.bwRes.data;
	const caloriesData = data.caloriesRes.data;
	const dietPlanData = data.dietPlanRes.data;

	const uid = 3; //Caj

</script>

<svelte:head>
	<title>Caj</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="mainContainer">
	
	<div class="calendar">
			<Calendar {daysData} {bwData} {caloriesData} {uid} {dietPlanData}/>
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