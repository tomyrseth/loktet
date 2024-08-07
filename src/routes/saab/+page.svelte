<script lang='ts'>
	import Calendar from "../../components/Calendar.svelte"
	import Modal from '../../components/Modal.svelte';
	let showModal = false;
	let dateSelected = '';
	let calorieGoal = 0;
	let cbm = '';
	let dialog;
	let plan = ['Cutting', 'Bulking', 'Maintenance']

	export let data;
	
	const daysTable = data.daysResponse?.data;
	const bwTable = data.bwResponse?.data;
	const caloriesTable = data.caloriesResponse?.data;
	const dietPlanTable = data.dietPlanResponse?.data;


	const uid = 2; //Saab

	async function submitData() {
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
<div class="main-container">
  <div class="calendar">
		<Calendar {daysTable} {bwTable} {caloriesTable} {uid} {dietPlanTable} {data}/>
  </div>

	<Modal bind:dialog>
		<div class="modal">
			<label for="">Date: </label>
			<input type="date">

			<label for="">Cutting/Bulking/Maintenance: </label>
			<select bind:value={cbm} name="" id="">
				{#each plan as p}
					<option value={p}>{p}</option>
				{/each}
			</select>

			<label for="">Weekly calorie goal: </label>
			<input type='number' name='calorieGoal'>
			<button type='submit'>Submit</button>
		</div>
	</Modal>
</div>
<button on:click={() => dialog.showModal()} class='dietPlan'>Add Diet Plan</button>

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
	.dietPlan {
		margin-top: 5em;
		max-width: 100px;
		background-color: rgb(26, 26, 26);
		color: rgb(255, 89, 33);
		border: solid 2px transparent;
		border-radius: 1em;
		padding: 1em;
		transition: 0.3s;
}

	.dietPlan:hover {
		border: solid 2px rgb(255, 89, 33);
		transform: scale(1.05);
		cursor: pointer;
	}

	label {
		color: white;
	}
</style>
