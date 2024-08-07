<script lang='ts'>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Modal from '../../components/Modal.svelte';
  import { toast } from '@zerodevx/svelte-toast'
  import type { PageData } from '../$types';
  import type { ActionData } from './$types';
  import { enhance } from '$app/forms';

  type lifts = {
    id: number;
    day_id: number;
    exercise_id: number;
    notes: string;
    reps: number;
    sets: number;
    weight: number;
  }

  export let data: PageData;
  export let form: ActionData;

  let dialog;

  const url = $page.url;
  const user_id = url.searchParams.get('user_id');
  const day_id = url.searchParams.get('day_id');

  let liftsData = data.data;
  let exerciseData = data.exerciseResponse?.data;
  let daysData = data.daysResponse?.data;
  let bwData = data.bwResponse?.data;
  let caloriesData = data.caloriesResponse?.data;

  let liftShow = false, bwShow = false, caloriesShow = false, editShow = false;
  $: console.log(liftShow);
  let exerciseSelect :string;
  let protein = 0, carbs = 0, fats = 0, sets = 0, reps = 0, weight = 0, bodyweight = 0, calories = 0;
  let user_name = '';
  let exercise_id_list = [], arr = [];
  let newExercise = false;

  let currentDay = daysData.find(o => o.id.toString() === day_id);

  let today = currentDay.created_at;

  let exercise_id: number

  $: if (exerciseSelect){
    let ex_obj = exerciseData.find(o => o.name === exerciseSelect);
    exercise_id = ex_obj.id;
  }

  liftsData.forEach(element =>{
    arr.push(element.exercise_id);
    exercise_id_list = [...new Set(arr)];
  });

  //Find exercise name based on id
  function findExName (id:number){
    let ex_name = exerciseData.find(o => o.id === id);
    return ex_name.name;
  }

  //For edit and delete functions
  function handleEditClick(lift) {
    console.log('Lift clicked: ', lift);
    editShow = true;
    dialog.showModal()
  }

  switch (user_id) {
          case '1':
            user_name = 'Tom'
            break;
          case '2':
            user_name = 'Saab'
            break;
          case '3':
            user_name = 'Caj'
            break;
          default:
            console.log(`Sorry, we are out of ${user_id}.`);
  }

</script>

<div class='main'>
  <h1>{user_name}'s workout, {currentDay.created_at}.</h1>
  <div class="above">

    <div class="above-left">
      <button class='plusButton' on:click={() => (dialog.showModal(), liftShow = true,  bwShow = false, caloriesShow = false, editShow = false)}>Add Lift</button>
      <button class='plusButton' on:click={() => (dialog.showModal(), liftShow = false, bwShow = true,  caloriesShow = false, editShow = false)}>Add BW</button>
      <button class='plusButton' on:click={() => (dialog.showModal(), liftShow = false, bwShow = false, caloriesShow = true,  editShow = false)}>Add Calories</button>
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

                  <button class='editButton' on:click={() => handleEditClick(lift)}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-pencil" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                      <path d="M13.5 6.5l4 4" />
                    </svg>
                  </button>

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



  <Modal bind:dialog>

    {#if liftShow === true}

      <div class='modal'>
        <form method='POST' class='form' action='?/lift' use:enhance={() => {
          return async ({ result }) => {
            if (result.type === 'success') {
              console.log('lift submission success', liftsData);
              location.reload();
            } else {
              console.log('lift submission failed')
            }
          };
        }}>
          <h1>Lift log</h1>
          <label for='exercise'>Exercise: </label>
          <select bind:value={exerciseSelect} name='exercise'>
            {#each exerciseData as exercise}
              <option >{exercise.name}</option>
            {/each}
          </select>
          <option value={exerciseData}></option>
          {#if form?.missing}
            <p>This field is required</p>
          {/if}

          <button type="button" on:click={() => newExercise = !newExercise}>
            Add new exercise
          </button>

          {#if newExercise}
            <label for="newEx">New exercise name:</label>
            <input type="text" name='newEx'>
          {/if}

          <label for='weight'>Weight: </label>
          <input type='number' step='0.1' name='weight'>
          {#if form?.missing}
            <p>This field is required</p>
          {/if}

          <label for='sets'>Sets: </label>
          <input type='number' name='sets'>
          {#if form?.missing}
            <p>This field is required</p>
          {/if}

          <label for='reps'>Reps: </label>
          <input type='number' name='reps'>
          {#if form?.missing}
            <p>This field is required</p>
          {/if}

          <label for='notes'>Notes: </label>
          <input type="text" name='notes'>
          {#if form?.missing}
            <p>This field is required</p>
          {/if}

          <input type='hidden' name='ex_id' value={exercise_id} />
          <input type='hidden' name='day_id' value={day_id} />

          <button type="submit">+ Add lift</button>
          <p style="color: lightgrey;">(ESC to close)</p>
        
        </form>
      </div>

    {:else if bwShow === true}
      <form method='POST' class='form' action='?/bw' use:enhance={() => {
        return async ({ result }) => {
          if (result.type === 'success') {
            console.log('Bodyweight submission success')
            location.reload();
          } else {
            console.log('Bodyweight submission failed', result);
          }
        };
      }}>
        <h1>Bodyweight log</h1>
        <label for="">Bodyweight: </label>
        <input type='number' step='0.1' name='bw'>
        <input type='hidden' name='today' value={today} />
        <button type='submit'>Submit</button>
      </form>

    {:else if caloriesShow === true}
      <form method='POST' class='form' action='?/calories' use:enhance={() => {
        return async ({ result }) => {
          if (result.type === 'success') {
            console.log('Calories submission success')
            location.reload();
          } else {
            console.log('Calories submission failed', result)
          }
        };
      }}>
        <h1>Calories log</h1>

        <label for="">Calories: </label>
        <input type='number' name='calories'>

        <label for="">Protein: </label>
        <input type='number' name='protein'>

        <label for="">Carbs: </label>
        <input type='number' name='carbs'>

        <label for="">Fats: </label>
        <input type='number' name='fats'>

        <input type='hidden' name='today' value={today} />

        <button type='submit'>Submit</button>
      
      </form>

    {:else if editShow === true}
      <div class='modal'>
        <form method='POST' class='form' action='?/editLift' use:enhance={() => {
          return async ({ result }) => {
            if (result.type === 'success') {
              console.log('lift update success')
              location.reload();
            } else {
              console.log('lift update failed')
            }
          };
        }}>
          <h1>Lift log</h1>
          <label for='exercise'>Exercise: </label>
          <select bind:value={exerciseSelect} name='exercise'>
            {#each exerciseData as exercise}
              <option >{exercise.name}</option>
            {/each}
          </select>
          <option value={exerciseData}></option>
          {#if form?.missing}
            <p>This field is required</p>
          {/if}

          <button type="button" on:click={() => newExercise = !newExercise}>
            Add new exercise
          </button>

          {#if newExercise}
            <label for="newEx">New exercise name:</label>
            <input type="text" name='newEx'>
          {/if}

          <label for='weight'>Weight: </label>
          <input type='number' step='0.1' name='weight'>
          {#if form?.missing}
            <p>This field is required</p>
          {/if}

          <label for='sets'>Sets: </label>
          <input type='number' name='sets'>
          {#if form?.missing}
            <p>This field is required</p>
          {/if}

          <label for='reps'>Reps: </label>
          <input type='number' name='reps'>
          {#if form?.missing}
            <p>This field is required</p>
          {/if}

          <label for='notes'>Notes: </label>
          <input type="text" name='notes'>
          {#if form?.missing}
            <p>This field is required</p>
          {/if}

          <input type='hidden' name='ex_id' value={exercise_id} />
          <input type='hidden' name='day_id' value={day_id} />

          <button type="submit">+ Add lift</button>
          <p style="color: lightgrey;">(ESC to close)</p>
        
        </form>
      </div>

    {/if}
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
    color: rgb(255, 68, 68);
  }

  .movement {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    text-wrap: wrap;
    margin: 0em 0em 0em 0em;
    padding: 0em 4em 1em 1em;
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

  .editButton {
    position: relative;
    top: 1.5em;
    left: 5.5em;
    width: 2em;
    height: 2em;
    background-color: transparent;
    border: solid 2px transparent;
    border-radius: 7px;
    transition: 0.2s;
  }

  .editButton:hover {
    border: solid 2px rgb(255, 88, 33);
    cursor: pointer;
    transform: scale(1.05);
  }

  .editButton:active{
    transform: scale(1);
    opacity: 0.3;
  }

  .form {
    display: flex;
    flex-direction: column;
  }

</style>