<script lang='ts'>
  import Modal from '../components/Modal.svelte';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  type daysTable = {
    created_at: string,
    id: number;
    name: string;
    uid: number;
  }

  export let data :daysTable[];

  export let uid = 0;
  
  let showModal = false;
  let trainingDaysArray = data;
  let user_id = 0;
  let day_name = '';
  let currentClickedDay:object;


  let now = new Date();
  let nowMonth = now.getMonth()+1; //+1 because start from 0

  let currentDate = new Date();
  let currentMonth = currentDate.getMonth(); 
  let currentYear = currentDate.getFullYear();
  let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  let firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  $: monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Because currentMonth variable starts from 0, january is counted as 0, therefore +1 has to be added to every mention of currentMonth.
  // Can't assign currentMonth+1 either because it wouldnt be reactive, and '$: currentMonth = ...+1' doesn't work properly.
  // This creates an array from all the days in the month, and assigns each day its full date, ex: '2024-01-01'.
  $: daysArray = Array.from({ length: daysInMonth }, (_, i) => {
      let trainingUser = '';
      let trainingName = '';
      let day_id = 0;
      let date = currentYear.toString()+'-'+ (((currentMonth+1).toString().length<2) ? (currentMonth+1).toString().padStart(2, '0') : (currentMonth+1).toString())+'-'+(((i+1).toString().length<2) ? (i+1).toString().padStart(2, '0') : (i+1).toString());
      let training = trainingDaysArray.find(training => training.created_at === date && training.uid === uid);
      if (training){
        trainingName = training.name;
        day_id = training.id;
        switch (training.uid) {
          case 1:
            trainingUser = 'Tom'
            break;
          case 2:
            trainingUser = 'Saab'
            break;
          case 3:
            trainingUser = 'TESTING'
            break;
          default:
            console.log(`Sorry, we are out of ${training.uid}.`);
        }
      }
      return {
        date: date,
        name: trainingUser,
        hasTraining: !!training,
        dayName: trainingName,
        day_id : day_id,
        user_id: uid,
      }
    });
  
  $: emptyStartDays = Array.from({ length: firstDayOfMonth });
    
  // Highlight today
  $: isToday = (date:string) => {
    return (date === currentYear.toString()+'-'+ (((nowMonth).toString().length<2) ? (nowMonth).toString().padStart(2, '0') : (nowMonth).toString())+'-'+((now.getDate().toString().length<2) ? now.getDate().toString().padStart(2, '0') : now.getDate().toString()));
  };


  function navigateMonths(step:number) {
    currentDate = new Date(currentYear, currentMonth + step, 1);
    currentMonth = currentDate.getMonth();
    currentYear = currentDate.getFullYear();
    daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  }

  function openDayPage(day_id:number, user_id:number){
    goto(`/day/?day_id=${day_id}&user_id=${user_id}`);
  }

  async function submitData() {

    console.log(user_id, day_name,'POST DATA');
    const response = await fetch('/api/addDay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, day_name , currentClickedDay})
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Submission successful', result);
    } else {
      console.error('Submission failed');
    }
  }

  onMount(async () => {
		console.log('DAYS ARRAY',daysArray);
	});
  
</script>


<div class="calendar">
  <div class="header">
    <button on:click={() => navigateMonths(-1)} class="calendarNav">&lt;</button>
    <span>{monthName} {currentYear}</span>
    <button on:click={() => navigateMonths(1)} class="calendarNav">&gt;</button>
  </div>
  <div class="dayName">Sun</div>
  <div class="dayName">Mon</div>
  <div class="dayName">Tue</div>
  <div class="dayName">Wed</div>
  <div class="dayName">Thu</div>
  <div class="dayName">Fri</div>
  <div class="dayName">Sat</div>

  {#each emptyStartDays as _, i}
    <div class="dayContainer"></div>
  {/each}
  
  {#each daysArray as day}
  <div class={isToday(day.date) ? 'currentDayContainer' : 'dayContainer'}>
      <button class="dayButton">{day.date.slice(-2)}</button>
      {#if day.hasTraining}
        <button class = 'activityButton' on:click={() => openDayPage(day.day_id, day.user_id)}>
          {day.name}
          {day.dayName}
        </button>
      {:else}
        <button class='plusButton' on:click={() => (showModal = true, currentClickedDay = day)}>+</button>
      {/if}
    </div>
  {/each}
</div>

<Modal bind:showModal>

  <div class='modal'>
    <h1>Day log</h1>

    <label for="">Name your day</label>
    <input type="text" bind:value={day_name}>

    <button on:click="{submitData}">Submit</button>
  </div>
</Modal>

<style>
  .calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    color: white;
  }
  .header {
    grid-column: span 7;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .currentDayContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    color: rgb(255, 89, 33);
    height: 150px;
    width: 180px;
    padding: 0px;
    border: solid 2px rgb(255, 89, 33);
    background-color: rgb(26, 26, 26);
    margin: 1px;
    transition: 0.3s;
  }

  .dayContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    color: rgb(255, 89, 33);
    height: 150px;
    width: 180px;
    padding: 0px;
    border: solid 2px transparent;
    border-radius: 5px;
    background-color: rgb(26, 26, 26);
    margin: 1px;
    transition: 0.3s;
  }

  .currentDayContainer:hover , .dayContainer:hover {
    background-color: rgba(26, 26, 26, 0.726);
  }

  .dayButton {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    color: rgb(255, 89, 33);
    margin: 0px;
    width: 40px;
    height: 30px;
    background-color: transparent;
    border: solid transparent 2px;
    border-radius: 20px;
    cursor: pointer;
    transition: border 0.4s;
  }

  .dayButton:hover {
    border: solid rgb(255, 89, 33) 2px;
    border-radius: 20px;
  }

  .dayButton:active {
    opacity: 0.5;
  }

  .activityButton {
    display: flex;
    background-color: transparent;
    border: solid 1px rgb(255, 89, 33);
    border-radius: 5px;
    color: white;
    transition: 0.5s;
    padding: 10px;
    margin: 3px;
  }

  .plusButton {
    display: flex;
    background-color: transparent;
    border: solid 1px rgba(255, 88, 33, 0.303);
    border-radius: 40px;
    color: rgba(255, 255, 255, 0.452);
    transition: 0.3s;
    padding: 20px;
    margin: 3px;
  }

  .plusButton:hover {
    cursor: pointer;
    border-color: rgb(255, 89, 33);
    color: white;
  }

  .modal {
    display: flex;
    flex-direction: column;
  }

  .activityButton:hover {
    cursor: pointer;
    color: black;
    background-color: rgb(255, 89, 33);
    border-radius: 25px;
  }

  .activityButton:active {
    opacity: 0.5;
  }

  .calendarNav:hover {
    opacity: 0.8;
  }

  .calendarNav {
    font-size: 40px;
    width: 100px;
    background-color: rgb(26, 26, 26);
    color: rgb(255, 89, 33);
    border: transparent solid 2px;
    transition: 0s;
    margin-bottom: 20px;
  }

  .calendarNav:active {
    border: solid rgb(255, 89, 33) 2px;
    border-radius: 4px;
  }
</style>
