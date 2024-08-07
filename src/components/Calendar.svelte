<script lang='ts'>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { toast } from '@zerodevx/svelte-toast'
  import Modal from '../components/Modal.svelte';
  import type { Database, Tables } from '$lib/db/database.types';


  export let daysTable: Tables<'days'>[] | undefined;
  export let bwTable: Tables<'bodyweight'>[] | undefined;
  export let caloriesTable: userCaloriesExtended[];
  export let dietPlanTable: Tables<'diet_plan'>[] | undefined;
  export let uid = 0;

  type userCaloriesExtended = {
    calories: number,
    carbs: number,
    created_at: string,
    fats: number,
    id: number,
    protein: number,
    uid: number,
    //extended
    calorieTot: number,
    proteinTot: number,
    carbsTot: number,
    fatsTot: number,
    daysCompleted: number,
  }

  let dialog; // ANY type, TODO make a type for this
  let dayName = '', name = '', type = '';
  let dayId = 0;
  let trainingName: string|null = ''
  let calories: number|null = 0
  let protein: number|null = 0
  let carbs: number|null = 0
  let fats: number|null = 0
  let bw: number|null = 0
  let calorieGoal: number|null = 0
  let calorieTot = 0, proteinTot = 0, carbsTot = 0, fatsTot = 0, daysCompleted = 0;

  //TODO: rename these, f.ex dailyBw
  let userDays: Tables<'days'> | undefined;
  let userCalories: userCaloriesExtended | undefined;
  let userBw: Tables<'bodyweight'> | undefined;
  let userDietPlan: Tables<'diet_plan'>[] | undefined;

  let currentClickedDay:object;

  let now = new Date();
  let currentMonth = now.getMonth();

  let calendarDate = new Date();
  let calendarMonth = calendarDate.getMonth(); 
  let calendarYear = calendarDate.getFullYear();
  let daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  let firstDayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay();

  
  $: adjustedFirstDayOfMonth = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;
  $: monthName = calendarDate.toLocaleString('se', { month: 'long' });
  $: monthnameCapitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  $: emptyStartDays = Array.from({ length: adjustedFirstDayOfMonth });

  // Highlight today
  $: isToday = (date:string) => {
    return (date === formatDate(new Date(calendarYear, currentMonth, now.getDate())))
  };

  /*
  daysArray: largest datapoint in the application, it's a reactive (declared by $:) array of objects, each individual day on the calendar is a object of daysArray.
  This creates an array of objects from all the days in the month, and assigns each day its full date, ex: '2024-01-01' along with all the info needed to be displayed.
  */ 
  $: daysArray = Array.from({ length: daysInMonth }, (_, i) => {

    calories = 0, 
    protein = 0, 
    carbs = 0, 
    fats = 0;
    calorieTot = 0, 
    proteinTot = 0, 
    carbsTot = 0, 
    fatsTot = 0
    calorieGoal = 0;
    daysCompleted = 0;
    bw = 0;

    let date = formatDate(new Date(calendarYear, calendarMonth, i+1));
    
    //Diet plan is only needed on Monday objects, because monday is weekly recap
    if (isMonday(date)) doesDayHaveDietPlan(dietPlanTable, date); 

    filterTodaysData(date);
    doesDayHaveCalories(userCalories);
    doesDayHaveBw(userBw);
    doesDayHaveTraining(userDays);

    return {
      uid,
      name,
      date,
      hasTraining: !!userDays,
      dayName: trainingName,
      dayId,
      calories,
      protein,
      carbs,
      fats,
      bw,
      type, //Bulking, Cutting or Maintaining.
      calorieGoal,
      calorieTot,
      proteinTot,
      carbsTot,
      fatsTot,
      daysCompleted, //How many days in a week are completed, completed is defined as tracking calories for a day.
    }
  });

  function filterTodaysData(date:string) {
    //filter tables for this specific day
    userDays = daysTable?.find(item => item.created_at === date);
    userCalories = caloriesTable?.find(item => item.created_at === date);
    userBw = bwTable?.find(item => item.created_at === date);
  }
  
  function doesDayHaveCalories (userCalories:userCaloriesExtended | undefined) {
    if (userCalories) defineCalories(userCalories);
  }

  function defineCalories(userCalories:userCaloriesExtended) {
    calories = userCalories.calories;
    protein = userCalories.protein;
    carbs = userCalories.carbs;
    fats = userCalories.fats;

    // Below variables extend current calorie table from supabase
    calorieTot = userCalories.calorieTot;
    proteinTot = userCalories.proteinTot;
    carbsTot = userCalories.carbsTot;
    fatsTot = userCalories.fatsTot;
    daysCompleted = userCalories.daysCompleted;
  }

  function doesDayHaveBw(userBw:Tables<'bodyweight'> | undefined) {
    if (userBw) bw = userBw.bodyweight;
  }

  function doesDayHaveDietPlan(dietPlanTable:Tables<'diet_plan'>[] = [], date:string) {
    if (dietPlanTable) determineCurrentDietPlan(dietPlanTable, date);
  }

  function determineCurrentDietPlan (dietPlanTable:Tables<'diet_plan'>[] = [], date:string) {
    // Sort objects by id in descending order
    dietPlanTable.sort((first, second) => second.id - first.id);
    // Find the first upcoming date
    const result = dietPlanTable.find(item => new Date(item.created_at) < new Date(date));
    // Handle the case where no future date is found
    if (result){
      type = result.type;
      calorieGoal = result.calorieGoal;
    }
  }

  function doesDayHaveTraining(userDays:Tables<'days'> | undefined) {
    if (userDays) determineUsername(userDays);
  }

  function determineUsername(userDays:Tables<'days'> | undefined) {
    trainingName = userDays.name;
    dayId = userDays.id;
    switch (userDays.uid) {
      case 1:
        name = 'Tom'
        break;
      case 2:
        name = 'Saab'
        break;
      case 3:
        name = 'Caj'
        break;
      default:
        console.log(`Sorry, we are out of UID ${userDays.uid}.`);
      }
  }


  
  // function finalizeRecap(mondayArray) {
  //   mondayArray.forEach(element => {      
  //     let recap = weeklyRecap(element.created_at);
  //     element.calorieTot = recap.calories;
  //     element.proteinTot = recap.protein;
  //     element.carbsTot = recap.carbs;
  //     element.fatsTot = recap.fats;
  //     element.daysCompleted = recap.daysCompleted;
  //   });
  // }


  function getInfoFromMatchedDates(matchingDates:userCaloriesExtended[]){
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fats = 0;
    let daysCompleted = 0;

    daysCompleted = matchingDates.length;
    //extract calories, protein, carbs, fats from them
    matchingDates.forEach(object => {
      calories += object.calories;
      protein += object.protein;
      carbs += object.carbs;
      fats += object.fats;
    });
      return {calories, protein, carbs, fats, daysCompleted};
    }


  weeklyRecapFunctionCaller();

  function weeklyRecapFunctionCaller() {

    let mondayArray = getMondayCalorieDays();
    let mondayWeeks = generateWeeksFromMondays(mondayArray);

    mondayWeeks.forEach((week) => {
      let matchingDates = getMatchingUserDates(week)
      console.log("🚀 ~ mondayWeeks.forEach ~ matchingDates:", matchingDates)
      
      getInfoFromMatchedDates(matchingDates);

    });
    //let matchingDates = getMatchingUserDates(mondayWeeks);
    //getInfoFromMatchedDates(matchingDates)
    //finalizeRecap(mondayArray)
  }

  function getMondayCalorieDays () {
    //Get every object that is a monday
    let mondayArray = caloriesTable?.filter(date => isMonday(date.created_at));
    //!array.length returns true if array is empty, false else
    if (!mondayArray.length) {
      console.log('function getMondayCalorieDays, parameter array is empty!', arr);
      return [];
    }
    return mondayArray;
  }

  function generateWeeksFromMondays(mondayArray:userCaloriesExtended[]){
    let weekArray:String[][] = []
    mondayArray.forEach((element) => {
      let week = createWeek(element.created_at);
      weekArray.push(week);
    });
    return weekArray;
  }

  function createWeek(mondayDate:String){
    //Put this weeks dates in an array
    const week: Date[] = [];
    let weekFormatted:String[] = [];
    const weekLength = 7;
    let today = new Date(mondayDate);
    let weekDayIterator = 0; //Monday when this is 0
    
    for (let i = 0; i < weekLength; i++) {
      let iteratedDate = today.setDate(today.getDate() +weekDayIterator);
      week.push(new Date(iteratedDate));
      if (weekDayIterator === 0) weekDayIterator += 1;
    }
    if (week.length !== 7) new Error('Week length is not 7');
    week.forEach(date => weekFormatted.push(formatDate(date)));
    return weekFormatted;
  }

  function getMatchingUserDates(mondayWeeks:String[]) {
    let matchingDates: userCaloriesExtended[] = [];
    matchingDates = caloriesTable.filter(item => mondayWeeks.includes(item.created_at)); //Coercion
    //!array.length returns true if array is empty, false else
    if (!matchingDates.length){
      return [];
    }
    return matchingDates;
  }


  function weeklyRecap(mondayDate:String) {
 
    const weekFormatted: Date[] = [];
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fats = 0;
    let daysCompleted = 0;


    let week = createWeek(mondayDate);

    //filter all 7 days into correct format
    week.forEach(element => {
      weekFormatted.push(formatDate(element));
    });

    //get all the dates from caloriesTable(supabase) that match the 7 days
    const matchingDates = caloriesTable.filter(item => weekFormatted.includes(item.created_at)); //Coercion

    //define daysCompleted for calculations
    daysCompleted = matchingDates.length;
    
    //extract calories, protein, carbs, fats from them
    matchingDates.forEach(element => {
      calories += element.calories;
      protein += element.protein;
      carbs += element.carbs;
      fats += element.fats;
    });
    return {calories, protein, carbs, fats, daysCompleted};
  }

  //Navigate calendar
  function navigateMonths(step:number) {
    calendarDate = new Date(calendarYear, calendarMonth + step, 1);
    calendarMonth = calendarDate.getMonth();
    calendarYear = calendarDate.getFullYear();
    daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    firstDayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay();
  }

  //Format to 2024-01-01 format
  function formatDate(date:Date) {    
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() returns 0-11, add 1 for 1-12
    const day = date.getDate();

    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;

    return `${year}-${formattedMonth}-${formattedDay}`;
  }

  function openDayPage(dayId:number, uid:number, hasTraining:boolean, day){
    if (hasTraining) {
      goto(`/day/?dayId=${dayId}&uid=${uid}`);
	  }
    else if (!hasTraining) {
      dialog.showModal()
      currentClickedDay = day;
    }
  }

  function isMonday(date) {
    let temp = new Date(date);    
    return temp.getDay() === 1;
  }

  //BACKEND
  async function submitData() {
    if (dayName.length > 13) {
      alert('Day name too long! Max 13 chars.')
      return 0;
    }
    const response = await fetch('/api/addDay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, dayName , currentClickedDay})
    });

    if (response.ok) {
      //const result = await response.json();
      console.log('Day Submission successful'); // (' Day... ', result);
      toast.push('Day submitted successfully!')
      location.reload();
      
    } else {
      console.error('Day Submission failed');
      toast.push('Day submission failed.')
    }
  }
  
  onMount(async () => {
    //console.log('daysTable: ', daysArray);
	});
  
</script>

<div class="calendar">
  <div class="header">
    <div></div>
    <span class='monthName'>{monthnameCapitalized} {calendarYear}</span>
    <div>
      <button on:click={() => navigateMonths(-1)} class="calendarNav">&lt;</button>
      <button on:click={() => navigateMonths(1)} class="calendarNav">&gt;</button>
    </div>
  </div>
  <div class='weekDayName'>Mán</div> 
  <div class='weekDayName'>Dis</div>
  <div class='weekDayName'>Gas</div>
  <div class='weekDayName'>Duo</div>
  <div class='weekDayName'>Bea</div>
  <div class='weekDayName'>Láv</div>
  <div class='weekDayName'>Sot</div>

  {#each emptyStartDays as _, i}
    <button class="dayContainer non-clickable"></button>
  {/each}

  {#each daysArray as day}
  <button class= 'dayContainer' class:currentDayContainer={isToday(day.date)} 
    on:click={() => openDayPage(day.dayId, day.uid, day.hasTraining, day)}
  >
    <span class="weekDay">
      <span class="dayNumber">{day.date.slice(-2)}</span>
      {#if day.hasTraining}
        <span class='dayName'>{day.dayName}</span>
      {:else}
        <span class='plusButton'>+</span>
      {/if}
  
      <span class='mainInfo'>
        {#if day.bw}
          <span class='bodyweight'>{day.bw} <abbr style='color: rgb(80, 80, 80)'>kg</abbr> </span>
        {/if}
  
        {#if day.calories}
          <span class='bodyweight'>{day.calories} <abbr style='color: rgb(80, 80, 80)'>kcal</abbr></span>
        {/if}
      </span>
    </span>
    
    {#if isMonday(day.date)}   
      {#if day.calorieTot && day.type}
        <span class='test'>
          <span class='bodyweight'>{day.type}</span>
          <span class='bodyweight'>{day.calorieTot} / {day.calorieGoal} <abbr style='color: rgb(80, 80, 80)'>kcal</abbr></span>
          <span class='bodyweight'> {Math.trunc(day.calorieTot/day.daysCompleted)} / {Math.trunc(day.calorieGoal/day.daysCompleted)} <abbr style='color: rgb(80, 80, 80)'>kcal</abbr></span>
          <span class='recap-text'>  Protein: {day.proteinTot} / {Math.trunc(day.proteinTot/day.daysCompleted)}  <abbr style='color: rgb(80, 80, 80)'>g</abbr> </span>
          <span class='recap-text'> Carbs: {day.carbsTot} / {Math.trunc(day.carbsTot/day.daysCompleted)}  <abbr style='color: rgb(80, 80, 80)'>g</abbr> </span>
          <span class='recap-text'> Fats: {day.fatsTot} / {Math.trunc(day.fatsTot/day.daysCompleted)}  <abbr style='color: rgb(80, 80, 80)'>g</abbr> </span>
        </span>

        {#if day.daysCompleted != 7 && day.calorieTot}
          <span class='test2'>
            <span class='bodyweight'> {(day.calorieGoal-day.calorieTot)/(7-day.daysCompleted)} per day to reach calorie goal</span>
          </span>
        {/if}
          
      {/if}
    {/if}

  </button>

  {/each}
</div>

<Modal bind:dialog>

  <div class='modal'>
    <h1 style='color: white'>Day log</h1>

    <label for="" style='color: white; padding-bottom: 1em'>Name your day</label>
    <input type="text" bind:value={dayName}>

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
    background: radial-gradient(circle, rgba(26, 26, 26), rgba(26, 26, 26, 0) 60%);
    border-radius: 50px;
  }

  .test {
    position: absolute;
    top: -2px;
    left: -12em;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: black;
    background-color: rgb(26, 26, 26);
    border: solid 2px rgba(0, 0, 0, 0);
    border-radius: 5px;
  }

  .test2 {
    position: absolute;
    top: -2px;
    left: 80em;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: black;
    background-color: rgb(26, 26, 26);
    border: solid 2px rgba(0, 0, 0, 0);
    border-radius: 5px;
  }

  .dayContainer {
    display: flex;
    flex-direction: column;
    position: relative;
    color: rgb(255, 89, 33);
    height: 150px;
    width: 180px;
    padding: 0px;
    border: solid 2px rgba(0, 0, 0, 0);
    border-radius: 5px;
    background-color: rgb(26, 26, 26);
    margin: 0px 1px 2px 1px;
    transition: 0.3s;
    cursor: pointer;
  }

  .dayContainer:hover {
    background-color: rgba(26, 26, 26, 0.825);
    transform: scale(1.1);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    border: solid 2px rgba(255, 88, 33, 0.616);
    z-index: 10;
  }

  .dayContainer:active {
    transform: scale(1.05);
    background-color: black;
    opacity: 0.8;
  }

  .currentDayContainer {
    z-index: 1;
    border: solid 2px rgb(255, 89, 33);
  }

  .weekDay {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.41em 0em 0em 0em;
  }

  .dayName {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    max-width: 6em;
    font-size: 1.15rem;
    color: rgb(223, 223, 223);
  }

  .mainInfo {
    display: flex;
    flex-direction: column;
    padding: 1.5em 0em 0em 0em;

  }

  .dayNumber {
    font-size: 1.15rem;
    display: inline-block;
    position: absolute;
    top: 6px;
    left: 0;
    color: rgb(255, 89, 33);
    margin: 0px;
    width: 40px;
    height: 30px;
    background-color: transparent;
  }

  .plusButton {
    display: inline-block;
    position: absolute;
    background-color: transparent;
    border: dashed 2px rgba(255, 88, 33, 0.303);
    border-radius: 5px;
    color: rgba(255, 255, 255, 0.452);
    transition: 0.5s;
    top: 3em;
    left: 3.7em;
    padding: 1em 1.2em 1em 1.2em;
  }

  .plusButton:hover {
    cursor: pointer;
    border: solid 2px;
    border-color: rgb(255, 89, 33);
    color: white;
    transform: scale(1.5);
  }

  .modal {
    display: flex;
    flex-direction: column;
  }

  .non-clickable {
    pointer-events: none;
    cursor: default;
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

  .bodyweight {
    color: rgb(0, 211, 84);
    margin-bottom: 0.5em;
  }

  .monthName {
    font-weight: bold;
    margin-right: -8.5em;
    font-size: 1.5rem;
    color: rgb(255, 89, 33);
  }

  .weekDayName {
    font-weight: bold;
    font-size: 1rem;
    color: rgb(255, 89, 33);
    margin: 0.5em 0em 0.5em 0em;
  }

</style>
