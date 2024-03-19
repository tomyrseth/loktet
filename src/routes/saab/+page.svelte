<script lang='ts'>
	import Calendar from "../../components/Calendar.svelte"
	export let data;
	//console.log(data.data);

	let day = "TESTuserData";
	let uid = 2; //SAAB

	async function submitData() {

    const response = await fetch('/api/addDay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, day })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Submission successful', result);
    } else {
      console.error('Submission failed');
    }
  }

</script>

<svelte:head>
	<title>Saab</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="main-container">
	<!-- <Calendar/> -->
  <label for="exercises">Choose an exercise:</label>
  <select id="exercises" name="exercises">
    {#each data.data as exercise}
      <option value="{exercise.name}">{exercise.name}</option>
    {/each}
  </select> 
	<button on:click="{submitData}">Submit Data</button>
</div>

<style>
</style>
