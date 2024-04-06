<script lang='ts'>
  import { page } from '$app/stores';
  import Modal from '../../components/Modal.svelte';
  import { onMount } from 'svelte';

  type lifts = {
    id: number;
    day_id: number;
    exercise_id: number;
    notes: string;
    reps: number;
    sets: number;
    weight: number;
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
  let exercise_id_list = [];
  let arr = [];

  export let data;
  
  let liftsData :lifts[] = data.data;
  let exerciseData = data.exerciseRes.data;
  let daysData = data.daysRes.data;
  let currentDay = daysData.find(o => o.id.toString() === day_id);

  for (let i = 0; i < liftsData.length; i++) {
    arr.push(liftsData[i].exercise_id);
    exercise_id_list = [...new Set(arr)];
  }

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
  <div class="outer-movement-container">
    {#each exercise_id_list as ex}
      <div class="inner-movement-container">
        <h2 class='ex-name'>{findExName(ex)}</h2>
            {#each liftsData as lift}
              {#if lift.exercise_id === ex}
                <div class='movement'>
                  <p>Weight: {lift.weight}</p>
                  <p>Sets: {lift.sets}</p>
                  <p>Reps: {lift.reps}</p>
                  <p>Notes: {lift.notes}</p>
                </div>
              {/if}
            {/each}
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
  .outer-movement-container {
    display: flex;
    flex-direction: column;
    border-radius: 15px;
  }

  .inner-movement-container {
    background-color: rgba(0, 0, 0, 0.472);
    display: flex;
    flex-direction: row;
    border-radius: 15px;
    border-bottom: solid rgb(255, 89, 33) 2px;
    border-left: solid rgb(255, 89, 33) 2px;
    padding: 0px;
    margin: 0px 0px 5px 0px;
  }

  .movement {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    text-wrap: wrap;
    margin: 5px 0px 5px 10px;
    padding: 5px 20px 3px 20px;
    border-radius: 12px;
    border-right: dashed rgba(255, 255, 255, 0.574) 2px;
  }

  .ex-name {
    font-weight: bold;
    color: rgb(255, 89, 33);
    width: 150px;
    padding: 5px 0px 0px 5px;
    margin: 0px 0px px 0px;
    border-radius: 0px;
    border-right: solid rgba(255, 255, 255, 0.455) 2px;
  }

  h1, p {
    color: white;
  }

  p {
    margin: 0px;
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

  label {
    color: white;
  }
</style>