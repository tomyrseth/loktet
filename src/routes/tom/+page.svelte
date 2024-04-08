<script lang='ts'>
	import Calendar from "../../components/Calendar.svelte"
  import { type Database } from "$lib/types/supabase";
	export let data:Database;


	const daysData = data.daysRes.data;
	const bwData = data.bwRes.data;

	const uid = 1; //Tom

</script>

<svelte:head>
	<title>Tom</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="mainContainer">
	
	<div class="calendar">
			<Calendar {daysData} {bwData} {uid}/>
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