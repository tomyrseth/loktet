<script lang='ts'>
  import { page } from '$app/stores';
  import Modal from '../../components/Modal.svelte';
  import { onMount } from 'svelte';

  type ex_table = {
    id: number;
    name: string;
  }

  const url = $page.url;
  const user_id = url.searchParams.get('user_id');
  const day_id = url.searchParams.get('day_id');
  let showModal = false;
  let exerciseSelect: object;
  let sets = 0;
  let reps = 0;
  let weight = 0;
  let notes = '';
  let user_name = '';
  let ex_id = 0;
  let exerciseTable :object;

  
  export let data;
  
  let exerciseData = data.exerciseRes.data;
  let daysData = data.daysRes.data;
  let currentDay = daysData.find(o => o.id.toString() === day_id);

  //Find exercise name based on id
  function findExName (id:number){
    let ex_name = exerciseData.find(o => o.id === id);
    return ex_name.name;
  }

  //Submit new lift today
  async function submitData() {
    //Finds correct row if exercise already exists
    let ex_obj = exerciseData.find(o => o.name === exerciseSelect);

    //If exercise already exists
    if (ex_obj){
      console.log('it exists', ex_obj);
      ex_id = ex_obj.id;
      console.log(ex_id,'ex_id');

      const liftResponse = await fetch('/api/addLift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day_id, ex_id, sets, reps, weight, notes })
      });

      if (liftResponse.ok) {
        const result = await liftResponse.json();
        console.log('Submission successful', result);
      } else {
        console.error('Submission failed');
      }
    }

    //If exercise doesnt already exist, POST it and then get its ID.
    else {
      const exResponse = await fetch('/api/addEx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseSelect })
      });

      if (exResponse.ok) {
        const result = await exResponse.json();
        console.log('Exercise Submission successful', result);

        //GET updated exercise table
        const exerciseResponse = await fetch('/api/getExId', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!exerciseResponse.ok) {
          console.error("Error fetching data:", exerciseResponse.statusText);
        } else {
          exerciseTable = await exerciseResponse.json(); // This parses the JSON body of the response to get table from DB
        }

        //Find the newly made exercise and get its id.
        let newExercise = exerciseTable.data.find(ex => ex.name === exerciseSelect);
        ex_id = newExercise.id;

        //POST to lift table
        const liftResponse = await fetch('/api/addLift', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ day_id, ex_id, sets, reps, weight, notes })
        });

        if (liftResponse.ok) {
          const result = await liftResponse.json();
          console.log('Submission successful', result);
        } else {
          console.error('Submission failed');
        }
      }

      else {
        console.error('Exercise Submission failed, aborting...');
      }
    }
  }

  switch (user_id) {
          case '1':
            user_name = 'Tom'
            break;
          case '2':
            user_name = 'Saab'
            break;
          case '3':
            user_name = 'TESTING'
            break;
          default:
            console.log(`Sorry, we are out of ${user_id}.`);
        }

</script>

<div>
  <h1>Training log for {user_name} on {currentDay.created_at}</h1>


  <button class='plusButton' on:click={() => (showModal = true)}>+</button>
  <p>Current lifts today:</p>
  <div class="movement-container">
    {#each data.data as data}
      <div class="movement">
        <h2>{findExName(data.exercise_id)}</h2>
        <p>Weight: {data.weight}kg</p>
        <p>Sets: {data.sets}</p>
        <p>Reps: {data.reps}</p>
        <p>Notes: {data.notes}</p>
      </div>
    {/each}
  </div>


  <Modal bind:showModal>

    <div class='modal'>
      <h1>Training log</h1>

      <input bind:value={exerciseSelect} type="text" list='exercises' />
      <datalist id='exercises'>
        {#each exerciseData as exercise}
          <option>{exercise.name}</option>
        {/each}
      </datalist>
  
      <label for="">Sets: </label>
      <input type="text" bind:value={sets}>

      <label for="">Reps: </label>
      <input type="text" bind:value={reps}>

      <label for="">Weight: </label>
      <input type="text" bind:value={weight}>

      <label for="">Notes: </label>
      <input type="text" bind:value={notes}>
  
      <button on:click="{submitData}">Submit</button>
    </div>
  </Modal>

</div>


<style>
  .movement-container {
    display: flex;
  }

  .movement {
    display: flex;
    flex-direction: column;
    margin: 10px;
    border: solid rgba(255, 255, 255, 0.676) 1px;
    border-radius: 10px;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.495);
  }

  h1, p {
    color: white;
  }
  h2 {
    color: rgb(255, 89, 33);
    font-size: 40;
  }

  .modal {
    display: flex;
    flex-direction: column;
  }

  .plusButton {
    background-color: rgba(0, 0, 0, 0.396);
    display: flex;
    border: solid 1px rgb(255, 88, 33);
    border-radius: 40px;
    color: rgb(255, 255, 255);
    transition: 0.4s;
    padding: 20px;
    margin: 3px;
  }

  .plusButton:hover {
    cursor: pointer;
    background-color: black;

  }
</style>