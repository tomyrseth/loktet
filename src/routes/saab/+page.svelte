<script lang='ts'>
	import Calendar from "../../components/Calendar.svelte"
	import Modal from '../../components/Modal.svelte';
	export let data;
	let showModal = false;
	let dateSelected = '';
	let calorieGoal = 0;
	let cbm = '';

	$: console.log("🚀 ~ cbm:", cbm)

	let plan = ['Cutting', 'Bulking', 'Maintenance']
	const daysData = data.daysRes.data;
	const bwData = data.bwRes.data;
	const caloriesData = data.caloriesRes.data;
  
	const uid = 2; //SAAB

	async function submitData() {
		console.log(cbm);
    const response = await fetch('/api/addDietPlan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, calorieGoal, dateSelected, cbm})
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Calories Submission successful', result);
    } else {
      console.error('Calories Submission failed');
    }
  }

</script>

<svelte:head>
	<title>Saab</title>
	<meta name="description" content="About this app" />
</svelte:head>
<button on:click={() => (showModal = true)}>Add Diet Plan</button>
<div class="main-container">
  <div class="calendar">
    <Calendar {daysData} {bwData} {uid} {caloriesData}/>
  </div>

	<Modal bind:showModal>
		<div class="modal">
			<label for="">Date: </label>
			<input type="date" bind:value={dateSelected}>

			<label for="">Cutting/Bulking/Maintenance: </label>
			<select bind:value={cbm} name="" id="">
				{#each plan as p}
					<option value={p}>{p}</option>
				{/each}
			</select>

			<label for="">Weekly calorie goal: </label>
			<input type="text" bind:value={calorieGoal}>
			<button on:click="{submitData}">Submit</button>
		</div>
	</Modal>
</div>

<style>

  .main-container {
		display: flex;
		justify-content: center;
	}

  .calendar {
		display: flex;
	}

	.modal {
    display: flex;
    flex-direction: column;
  }
</style>
