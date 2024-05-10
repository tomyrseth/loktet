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

  export let daysData :daysTable[];
  export let bwData;
  export let caloriesData;
  export let dietPlanData;


  export let uid = 0;
  
  let showModal = false;
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
  $: adjustedFirstDayOfMonth = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

  $: monthName = currentDate.toLocaleString('default', { month: 'long' });
  
  $: emptyStartDays = Array.from({ length: adjustedFirstDayOfMonth });
    
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

  function openDayPage(day_id:number, user_id:number, hasTraining:boolean, day){
    if (hasTraining) {
      goto(`/day/?day_id=${day_id}&user_id=${user_id}`);
    }
    else if (!hasTraining) {
      showModal = true;
      currentClickedDay = day;
    }
  }

  function isDateInCurrentOrFuture(dpd, day){
    const dataDate = new Date(dpd.created_at);
    const dataYear = dataDate.getFullYear();
    const dataMonth = dataDate.getMonth();
    const dataDay = dataDate.getDate();

    const dayDate = new Date(day.date);
    const dayYear = dayDate.getFullYear();
    const dayMonth = dayDate.getMonth();
    const dayDay = dayDate.getDate();


    if (dayYear < dataYear) return false;
    if (dataYear === dayYear) {
      if (dayMonth < dataMonth) return false;
      if (dataMonth === dayMonth && dayDay < dataDay) return false;
    }
    return true;
  }

  function isSunday(date) {
    let temp = new Date(date);
    return temp.getDay() === 0;
  }

  function addRecapToCalories() {
    let sundayList = [];
    //First filter calories table for uid
    const filteredUID = caloriesData.filter(item => item.uid === uid);

    //Then get every object that is a sunday
    for (let i = 0; i < filteredUID.length; i++) {
      if(isSunday(filteredUID[i].created_at)){
        sundayList.push(filteredUID[i]);
      }
    }
    //start with first sunday and go back 6 days to calculcate average
    for (let i = 0; i < sundayList.length; i++) {
      let recap = weeklyRecap(sundayList[i].created_at);
      sundayList[i].calorieTot = recap.calories;
      sundayList[i].proteinTot = recap.protein;
      sundayList[i].carbsTot = recap.carbs;
      sundayList[i].fatsTot = recap.fats;
    }

    //when you have total for that week, merge with original calorie table
    const additionalDataMap = new Map(sundayList.map(item => [`${item.id}-${item.created_at}`, item]));
    caloriesData.forEach(item => {

      const key = `${item.id}-${item.created_at}`;
      if (additionalDataMap.has(key)) {
        Object.assign(item, additionalDataMap.get(key));
      }
    });
  }
  addRecapToCalories();

  // Because currentMonth variable starts from 0, january is counted as 0, therefore +1 has to be added to every mention of currentMonth.
  // Can't assign currentMonth+1 either because it wouldnt be reactive, and '$: currentMonth = ...+1' doesn't work properly.
  // This creates an array of objects from all the days in the month, and assigns each day its full date, ex: '2024-01-01' along with all the info needed to be displayed.
  $: daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    let trainingUser = '', trainingName = ''
    let day_id = 0;
    let calories = undefined, protein = undefined, carbs = undefined, fats = undefined, bw = undefined, calorieTot = undefined, proteinTot = undefined, carbsTot = undefined, fatsTot = undefined, type = undefined, amount = undefined;


    let date = currentYear.toString()+'-'+ (((currentMonth+1).toString().length<2) ? (currentMonth+1).toString().padStart(2, '0') : (currentMonth+1).toString())+'-'+(((i+1).toString().length<2) ? (i+1).toString().padStart(2, '0') : (i+1).toString());

    //Get all the data from supabase for the specific user
    let trainingArr = daysData.find(item => item.created_at === date && item.uid === uid);
    let caloriesArr = caloriesData.find(item => item.created_at === date && item.uid === uid);
    let bwArr = bwData.find(item => item.created_at === date && item.uid === uid);
    let dietPlanArr = dietPlanData.filter(item => item.uid === uid);

    if (caloriesArr){
      calories = caloriesArr.calories;
      protein = caloriesArr.protein;
      carbs = caloriesArr.carbs;
      fats = caloriesArr.fats;
      calorieTot = caloriesArr.calorieTot;
      proteinTot = caloriesArr.proteinTot;
      carbsTot = caloriesArr.carbsTot;
      fatsTot = caloriesArr.fatsTot;
    }
    if (bwArr){
      bw = bwArr.bodyweight;
    }
    if (dietPlanArr){
      // Step 1: Sort objects by id in descending order
      dietPlanArr.sort((a, b) => b.id - a.id);
      // Step 3: Find the first upcoming date
      const result = dietPlanArr.find(item => new Date(item.created_at) < new Date(date));
      // Handle the case where no future date is found
      if (result){
        type = result.type;
        amount = result.amount;
      }

    }
      
    if (trainingArr){
      trainingName = trainingArr.name;
      day_id = trainingArr.id;
      switch (trainingArr.uid) {
        case 1:
          trainingUser = 'Tom'
          break;
        case 2:
          trainingUser = 'Saab'
          break;
        case 3:
          trainingUser = 'Caj'
          break;
        default:
          console.log(`Sorry, we are out of ${trainingArr.uid}.`);
      }
    }
    return {
      user_id: uid,
      name: trainingUser,
      date: date,
      hasTraining: !!trainingArr,
      dayName: trainingName,
      day_id : day_id,
      calories: calories,
      protein: protein,
      carbs: carbs,
      fats: fats,
      bw: bw,
      type: type, //Bulking, Cutting or Maintaining.
      amount: amount,
      calorieTot: calorieTot,
      proteinTot: proteinTot,
      carbsTot: carbsTot,
      fatsTot: fatsTot,
    }
  });

  function weeklyRecap(date) {

    let today = new Date(date);
    const week = [];
    const weekFormatted = [];
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fats = 0;

    //put all previous 7 days in an array
    let k = 0;
    for (let i = 0; i < 7; i++) {
      let temp = today.setDate(today.getDate() -k);
      week.push(new Date(temp));
      if (k === 0){
        k = k+1;
      }
    }
    //filter all 7 days into correct format
    for (let i = 0; i < week.length; i++) {
      weekFormatted.push(formatDate(week[i]));
    }

    //get all the dates from caloriesData(supabase) that match the 7 days
    const filteredUID = caloriesData.filter(item => item.uid === uid);
    const matchingDates = filteredUID.filter(item => weekFormatted.includes(item.created_at));
    if(matchingDates.length < 7){
      return 0;
    }
    
    //extract calories, protein, carbs, fats from them
    for (let i = 0; i < matchingDates.length; i++) {
      calories += matchingDates[i].calories;
      protein += matchingDates[i].protein;
      carbs += matchingDates[i].carbs;
      fats += matchingDates[i].fats;
    }
    return {calories, protein, carbs, fats};
  }

  function formatDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() returns 0-11, add 1 for 1-12
    const day = date.getDate();

    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;

    return `${year}-${formattedMonth}-${formattedDay}`;
}

  async function submitData() {

    console.log(user_id, day_name,'POST DATA');
    if (day_name.length > 13) {
      alert('Day name too long! Max 13 chars.')
      return 0;
    }
    const response = await fetch('/api/addDay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, day_name , currentClickedDay})
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Day Submission successful', result);
    } else {
      console.error('Day Submission failed');
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
  <div class="dayName">Mon</div>
  <div class="dayName">Tue</div>
  <div class="dayName">Wed</div>
  <div class="dayName">Thu</div>
  <div class="dayName">Fri</div>
  <div class="dayName">Sat</div>
  <div class="dayName">Sun</div>

  {#each emptyStartDays as _, i}
    <button class="dayContainer non-clickable"></button>
  {/each}

  {#each daysArray as day}
  <button class={isSunday(day.date) ? 'sundayContainer' : 'dayContainer'} 
    on:click={() => openDayPage(day.day_id, day.user_id, day.hasTraining, day)}
  >

    <span class="dayButton">{day.date.slice(-2)}</span>
    <span class='mainInfo'>
      {#if day.hasTraining}
        <span>
          {day.dayName}
        </span>
      {:else}
        <span class='plusButton'>+</span>
      {/if}

      {#if day.bw}
        <span class='bodyweight'>{day.bw} kg</span>
      {/if}

      {#if day.calories}
        <span class='bodyweight'>{day.calories} kcal</span>
      {/if}
    </span>

    {#if isSunday(day.date)}   
      {#if day.calorieTot && day.type}
        <span class='recap'>

          <span class='bodyweight'>{day.type}</span>
          <span class='bodyweight'>{day.calorieTot} / {day.amount} kcal</span>
          <span class='bodyweight'> {Math.trunc(day.calorieTot/7)} / {Math.trunc(day.amount/7)} kcal</span>
          <span class='recap-text'>  P: {day.proteinTot} / {Math.trunc(day.proteinTot/7)}  g </span>
          <span class='recap-text'> C: {day.carbsTot} / {Math.trunc(day.carbsTot/7)}  g </span>
          <span class='recap-text'> F: {day.fatsTot} / {Math.trunc(day.fatsTot/7)}  g </span>

        </span>
      {/if}
    {/if}
    </button>
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
  p {
    margin: 0;
  }

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

  .currentDayContainer:hover , .dayContainer:hover {
    background-color: rgba(26, 26, 26, 0.726);
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
    cursor: pointer;
  }

  .sundayContainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    color: rgb(255, 89, 33);
    height: 150px;
    width: 300px;
    padding: 0px;
    border: solid 2px transparent;
    border-radius: 5px;
    background-color: rgb(26, 26, 26);
    margin: 1px;
    transition: 0.3s;
    cursor: pointer;
  }

  .sundayContainer:hover {
    background-color: rgba(26, 26, 26, 0.726);
  }

  .mainInfo {
    display: flex;
    flex-direction: column;
  }

  .recap {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    padding: 0;
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
  }
</style>
