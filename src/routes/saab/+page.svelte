<script lang='ts'>
	import Calendar from "../../components/Calendar.svelte"
	export let data;

  const daysData = data.daysRes.data; 
  
	const uid = 2; //SAAB

</script>

<svelte:head>
	<title>Saab</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="main-container">
  <div class="calendar">
    <Calendar data={daysData} {uid}/>
  </div>
</div>

<style>

  .main-container {
		display: flex;
		justify-content: center;
	}

  .calendar {
		display: flex;
	}
</style>
