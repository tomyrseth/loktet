<script lang='ts'>
    import { browser } from '$app/environment';
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
  let liftShow = false;
  let bwShow = false;
  let caloriesShow = false;
  let exerciseSelect: object;
  let protein = 0, carbs = 0, fats = 0, sets = 0, reps = 0, weight = 0, bodyweight = 0, calories = 0;
  let notes = '';
  let user_name = '';
  let ex_id = 0;
  let exerciseTable :object;
  let exercise_id_list = [];
  let arr = [];

  export let data;
  
  let liftsData = data.data;
  let exerciseData = data.exerciseRes?.data;
  let daysData = data.daysRes?.data;
  let bwData = data.bwRes?.data;
  let caloriesData = data.caloriesRes?.data;
  let currentDay = daysData.find(o => o.id.toString() === day_id);
  let today = currentDay.created_at;

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
  async function submitLiftData() {
    //Finds correct row if exercise already exists
    let ex_obj = exerciseData.find(o => o.name === exerciseSelect);

    //If exercise already exists
    if (ex_obj){
      ex_id = ex_obj.id;

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
          console.log('Lifts Submission successful', result);
        } else {
          console.error('Lifts Submission failed');
        }
      }

      else {
        console.error('Exercise Submission failed, aborting...');
      }
    }
  }

  async function submitBwData() {
    console.log(bodyweight, 'POST DATA');
    const response = await fetch('/api/addBw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, today, bodyweight})
    });

    if (response.ok) {
      const result = await response.json();
      console.log('BW Submission successful', result);
    } else {
      console.error('BW Submission failed');
    }

  }

  async function submitCaloriesData() {
    console.log(calories,'POST DATA');
    const response = await fetch('/api/addCalories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, calories , today, protein, carbs, fats })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Calories Submission successful', result);
    } else {
      console.error('Calories Submission failed');
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

<div class='main'>

  <h1>{user_name}'s workout, {currentDay.created_at}.</h1>
  <div class="above">

    <div class="above-left">
      <button class='plusButton' on:click={() => (showModal = true, liftShow = true, bwShow = false, caloriesShow = false)}>Add Lift</button>
      <button class='plusButton' on:click={() => (showModal = true, liftShow = false, bwShow = true, caloriesShow = false)}>Add BW</button>
      <button class='plusButton' on:click={() => (showModal = true, liftShow = false, bwShow = false, caloriesShow = true)}>Add Calories</button>
    </div>

    <div class="above-right">
      {#each bwData as bw}
        <!-- 
          VERY SCUFFED USING ONLY == NOT ===
        -->
        {#if bw.created_at === today && bw.uid == user_id}
          <p>{user_name}'s weight today is <span style='color: rgb(255, 89, 33)'>{bw.bodyweight}</span> kg</p>
        {/if}
      {/each}

      {#each caloriesData as cal}
      <!-- 
        VERY SCUFFED USING ONLY == NOT ===
      -->
      {#if cal.created_at === today && cal.uid == user_id}
        <p>{user_name}'s calories today is <span style='color: rgb(255, 89, 33)'>{cal.calories}</span> kcal, {cal.protein}g protein, {cal.carbs}g carbs and {cal.fats}g fats</p>
      {/if}
    {/each}
    </div>




  </div>


  <div class="outer-movement-container">
    {#each exercise_id_list as ex}
      <div class="inner-movement-container">
        <h2 class='ex-name'>{findExName(ex)}</h2>
            {#each liftsData as lift}
              {#if lift.exercise_id === ex}
                <div class='movement'>
                  {#if lift.weight !== 0}
                    <p>Weight: <span style='color: rgb(255, 89, 33)'>{lift.weight}</span></p>
                  {/if}
                  <p>Sets: <span style='color: rgb(255, 89, 33)'>{lift.sets}</span></p>
                  {#if lift.reps === 0}
                    <p><span style='color: rgb(255, 0, 0)'>Reps: {lift.reps}</span></p>
                  {:else}
                    <p>Reps: <span style='color: rgb(255, 89, 33)'>{lift.reps}</span></p>
                  {/if}
                  {#if lift.notes !== ''}
                    <p>Notes: <span style='color: rgb(120, 120, 120)'>{lift.notes}</span></p>
                  {/if}
                </div>
              {/if}
            {/each}
      </div>
    {/each}
  </div>



  <Modal bind:showModal>
    {#if liftShow === true}
      <div class='modal'>
        <h1>Training log</h1>

        <input bind:value={exerciseSelect} type="text" list='exercises' />
        <datalist id='exercises'>
          {#each exerciseData as exercise}
            <option>{exercise.name}</option>
          {/each}
        </datalist>

        <label for="">Weight: </label>
        <input type="text" bind:value={weight}>
    
        <label for="">Sets: </label>
        <input type="text" bind:value={sets}>

        <label for="">Reps: </label>
        <input type="text" bind:value={reps}>

        <label for="">Notes: </label>
        <input type="text" bind:value={notes}>
    
        <button on:click="{submitLiftData}">Submit</button>
      </div>

    {:else if bwShow === true}
      <h1>Bodyweight log</h1>
      <label for="">Bodyweight: </label>
      <input type="text" bind:value={bodyweight}>
      <button on:click="{submitBwData}">Submit</button>

    {:else if caloriesShow === true}
      <div class='modal'>
        <h1>Calories log</h1>

        <label for="">Calories: </label>
        <input type="text" bind:value={calories}>

        <label for="">Protein: </label>
        <input type="text" bind:value={protein}>

        <label for="">Carbs: </label>
        <input type="text" bind:value={carbs}>

        <label for="">Fats: </label>
        <input type="text" bind:value={fats}>

        <button on:click="{submitCaloriesData}">Submit</button>
      </div>
    {/if}

  </Modal>

  <!--

  <Modal bind:showModal2>

    <div class='modal'>
      <h1>Bodyweight log</h1>

      <label for="">Weight: </label>
      <input type="text" bind:value={bodyweight}>
      
      <button on:click="{submitBwData}">Submit</button>
    </div>
  </Modal>

  <Modal bind:showModal3>

    <div class='modal'>
      <h1>Calorie log</h1>

      <label for="">Weight: </label>
      <input type="text" bind:value={calories}>

      <button on:click="{submitCalorieData}">Submit</button>
    </div>
  </Modal>
  -->

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
    color: rgb(255, 68, 68);
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

  .above {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .above-left {
    display: flex;
    flex-direction: row;
  }

</style>