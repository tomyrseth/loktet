<script lang='ts'>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Modal from '../../components/Modal.svelte';
  import { toast } from '@zerodevx/svelte-toast'
  import type { PageData } from '../$types';
  import type { ActionData } from './$types';
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';

onMount(() => {
  //console.log('liftsData ',liftsData);
});

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
  let clickedEditLift;
  let changeExercise = false;
  let addLiftOfSameType = false;

  const url = $page.url;
  const user_id = url.searchParams.get('user_id');
  const day_id = url.searchParams.get('day_id');

  let liftsData = data.data;
  let exerciseData = data.exerciseRes?.data;
  let typesData = data.typesRes?.data;
  let muscleGroupsData = data.muscleGroupsRes?.data;
  let daysData = data.daysRes?.data;
  let bwData = data.bwRes?.data;
  let caloriesData = data.caloriesRes?.data;

  let liftShow = false, bwShow = false, caloriesShow = false, editShow = false;
  let exerciseSelect :string;
  let typeSelect: string;
  let protein = 0, carbs = 0, fats = 0, sets = 0, reps = 0, weight = 0, bodyweight = 0, calories = 0;
  let user_name = '';
  let exercise_id_list = [], arr = [];
  let newExercise = false;

  let currentDay = daysData.find(o => o.id.toString() === day_id);

  let today = currentDay.created_at;

  let exercise_id: number;
  let type_id = 1;
  let filteredExerciseData: typeof exerciseData;
  filteredExerciseData = exerciseData?.filter((ex) => ex.type === type_id);

  $: if (exerciseSelect){
    console.log("🚀 ~ exerciseSelect:", exerciseSelect)
    
    let ex_obj = filteredExerciseData.find(o => o.name === exerciseSelect);
    if (!ex_obj) {
      exerciseSelect = filteredExerciseData[0].name;
      ex_obj = filteredExerciseData.find(o => o.name === exerciseSelect);
    } 
    exercise_id = ex_obj.id;
    console.log("🚀 ~ exercise_id:", exercise_id)
  }

  $: if (typeSelect) {
    
    let type_obj = typesData?.find(o => o.type === typeSelect);
    filteredExerciseData = exerciseData?.filter((ex) => ex.type === type_obj.id);
    //exerciseSelect = filteredExerciseData[0].name;
    
    
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

  function findExTypeName (id:number) {
    let ex = exerciseData.find(o => o.id === id);
    let type = typesData?.find(o => o.id === ex.type);
    return type.type;
  }

  function findExMainGroup(id:number) {
    let ex = exerciseData.find(o => o.id === id);
    let muscleGroup = muscleGroupsData?.find(mgroup => mgroup.id === ex.primary_muscle_group);
    return muscleGroup.name;
  }
  function findExOtherGroup(id:number) {
    let ex = exerciseData.find(o => o.id === id);
    console.log("🚀 ~ findExOtherGroup ~ ex:", ex)
    if (!ex.other_muscle_groups) {
      console.log("🚀 ~ findExOtherGroup ~ NOT TRUE")
      return '';
    }
    let words = '';
    ex.other_muscle_groups.forEach(el => {
      words += el +', ';
    });
    //let muscleGroup = muscleGroupsData?.find(mgroup => mgroup.name === ex.other_muscle_group);
    return words;
  }

  //For edit and delete functions
  function handleEditClick(lift) {
    clickedEditLift = lift;
    editShow = true;
    liftShow = false;
    console.log('Lift clicked (edit): ', lift);
    dialog.showModal()
  }

  async function handleDeleteClick(lift) {
    const formData = new FormData();
    clickedEditLift = lift;
    formData.append('id', lift.id);
    console.log('Lift clicked (delete): ', lift);

    const response = await fetch('?/deleteLift', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    console.log(result)
    console.log(result.success)
    if (result.type === "success") {
      console.log('yay')
      location.reload();
    }
  }

  function handleAdditionalSetClick(lift) {
    clickedEditLift = lift;
    console.log('Lift clicked (add): ', lift);
    liftShow = false;
    bwShow = false;
    caloriesShow = false;
    editShow = false;
    addLiftOfSameType = true;
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
      <button class='plusButton' on:click={() => (dialog.showModal(), liftShow = true,  bwShow = false, caloriesShow = false, editShow = false, addLiftOfSameType = false)}>Add Lift</button>
      <button class='plusButton' on:click={() => (dialog.showModal(), liftShow = false, bwShow = true,  caloriesShow = false, editShow = false, addLiftOfSameType = false)}>Add BW</button>
      <button class='plusButton' on:click={() => (dialog.showModal(), liftShow = false, bwShow = false, caloriesShow = true,  editShow = false, addLiftOfSameType = false)}>Add Calories</button>
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
        
        <div class="exercise-info">
          <h2 class='ex-name'>{findExName(ex)}</h2>
          <h2 class='ex-type'>{findExTypeName(ex)}</h2>
          <h2 class='ex-mgroup'>{findExMainGroup(ex)}</h2>
          <h2 class='ex-ogroup'>{findExOtherGroup(ex)}</h2>
        </div>
          {#each liftsData as lift}
            {#if lift.exercise_id === ex}
              <div class='movement'>

                <div class="numberContainer">
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

                  {#if lift.rir !== null}
                    <p>RIR: <span style='color: rgb(120, 120, 120)'>{lift.rir}</span></p>
                  {/if}
                </div>

                <div class="editButtonsContainer">
                  <button class='editButton addSetButton' on:click={() => handleAdditionalSetClick(lift)}>+</button>
                  <button class='editButton' on:click={() => handleEditClick(lift)}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-pencil" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                      <path d="M13.5 6.5l4 4" />
                    </svg>
                  </button>

                  <button class="editButton" on:click={() => handleDeleteClick(lift)}>
                    X
                  </button>
                </div>

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

          <label for='type'>type: </label>
          <select bind:value={typeSelect} name='type'>
            {#each typesData as type}
              <option value={type.type}>{type.type}</option>
            {/each}
          </select>


          <label for='exercise'>Exercise: </label>
          <select bind:value={exerciseSelect} name='exercise'>
            {#each filteredExerciseData as exercise}
                <option value={exercise.name}>{exercise.name}</option>
            {/each}
          </select>

          <option value={exerciseData}></option>
          {#if form?.missing}
            <p>This field is required</p>
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

          <label for='rir'>RIR: </label>
          <input type='number' name='rir'>
          {#if form?.missing}
            <p>This field is required</p>
          {/if}

          <button type="submit">+ Add lift</button>

          <label for='notes'>Notes: </label>
          <input type="text" name='notes'>
          {#if form?.missing}
            <p>This field is required</p>
          {/if}

          <input type='hidden' name='ex_id' value={exercise_id} />
          <input type='hidden' name='day_id' value={day_id} />

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
          <h1>Lift log (editing)</h1>


          <label for='weight'>Weight: </label>
          <input type='number' step='0.1' name='weight' value={clickedEditLift.weight}>
          {#if form?.missing}
            <p>This field is required</p>
          {/if}

          <label for='sets'>Sets: </label>
          <input type='number' name='sets' value={clickedEditLift.sets}>
          {#if form?.missing}
            <p>This field is required</p>
          {/if}

          <label for='reps'>Reps: </label>
          <input type='number' name='reps' value={clickedEditLift.reps}>
          {#if form?.missing}
            <p>This field is required</p>
          {/if}

          <label for='rir'>RIR: </label>
          <input type='number' name='rir' value={clickedEditLift.rir}>
          {#if form?.missing}
            <p>This field is required</p>
          {/if}

          <label for='notes'>Notes: </label>
          <input type="text" name='notes' value={clickedEditLift.notes}>
          {#if form?.missing}
            <p>This field is required</p>
          {/if}

          <input type='hidden' name='id' value={clickedEditLift.id} />
          <input type='hidden' name='ex_id' value={clickedEditLift.exercise_id} />

          <button type="submit">Edit lift</button>
          <p style="color: lightgrey;">(ESC to close)</p>
        
        </form>
      </div>

    {:else if addLiftOfSameType === true}
      <div class='modal'>
        <form method='POST' class='form' action='?/lift' use:enhance={() => {
          return async ({ result }) => {
            if (result.type === 'success') {
              console.log('lift update success')
              location.reload();
            } else {
              console.log('lift update failed')
            }
          };
        }}>
          <h1>Additional set log</h1>

          <label for='weight'>Weight: </label>
          <input type='number' step='0.1' name='weight' value={clickedEditLift.weight}>
          {#if form?.missing}
            <p>This field is required</p>
          {/if}

          <label for='sets'>Sets: </label>
          <input type='number' name='sets' value={clickedEditLift.sets}>
          {#if form?.missing}
            <p>This field is required</p>
          {/if}

          <label for='reps'>Reps: </label>
          <input type='number' name='reps' value={clickedEditLift.reps}>
          {#if form?.missing}
            <p>This field is required</p>
          {/if}

          <label for='rir'>RIR: </label>
          <input type='number' name='rir' value={clickedEditLift.rir}>
          {#if form?.missing}
            <p>This field is required</p>
          {/if}

          <label for='notes'>Notes: </label>
          <input type="text" name='notes' value={clickedEditLift.notes}>
          {#if form?.missing}
            <p>This field is required</p>
          {/if}

          <input type='hidden' name='id' value={clickedEditLift.id} />
          <input type='hidden' name='ex_id' value={clickedEditLift.exercise_id} />
          <input type='hidden' name='day_id' value={clickedEditLift.day_id} />

          <button type="submit">Add set</button>
          <p style="color: lightgrey;">(ESC to close)</p>
        
        </form>
      </div>
    
    {/if}
  </Modal>
</div>


<style>
  .main {
    display: flex;
    flex-direction: column;
    align-items:center ;
  }

  .outer-movement-container {
    display: flex;
    width: fit-content;
    flex-direction: column;
    border-radius: 15px;
  }

  .inner-movement-container {
    background-color: rgba(0, 0, 0, 0.472);
    display: flex;
    width: auto;
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
    flex-direction: row;
    min-width: 140px;
    flex-wrap: wrap;
    text-wrap: wrap;
    margin: 0em 0em 0em 0em;
    padding: 1em 1em 1em 1em;
    border-radius: 12px;
    border-right: dashed rgba(255, 255, 255, 0.574) 2px;
  }

  .numberContainer, .editButtonsContainer {
    display: flex;
    flex-direction: column;
  }

  .ex-name {
    font-weight: bold;
    display: flex;
    color: rgb(255, 89, 33);
    width: 150px;
    padding: 5px 0px 0px 5px;
    margin: 0px 0px px 0px;
    border-radius: 0px;
    border-right: solid rgba(255, 255, 255, 0.455) 2px;
  }
  .ex-type {
    font-weight: bold;
    display: flex;
    color: rgba(255, 88, 33, 0.502);
    width: 150px;
    padding: 5px 0px 0px 5px;
    margin: 0px 0px px 0px;
    border-radius: 0px;
    border-right: solid rgba(255, 255, 255, 0.455) 2px;
  }

  .ex-mgroup {
    font-weight: bold;
    display: flex;
    color: rgba(195, 195, 195, 0.61);
    width: 150px;
    padding: 5px 0px 0px 5px;
    margin: 0px 0px px 0px;
    border-radius: 0px;
    border-right: solid rgba(255, 255, 255, 0.358) 2px;
  }

  .ex-ogroup {
    font-weight: bold;
    display: flex;
    color: rgba(195, 195, 195, 0.623);
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
    color: white;
    margin-left: 10px;
    margin-bottom: 4px;
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