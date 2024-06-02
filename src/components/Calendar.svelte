<script lang='ts'>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { toast } from '@zerodevx/svelte-toast'
  import Modal from '../components/Modal.svelte';
  let dialog;


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

  $: monthName = currentDate.toLocaleString('se', { month: 'long' });
  $: monthnameCapitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  $: emptyStartDays = Array.from({ length: adjustedFirstDayOfMonth });
    
  // Highlight today
  $: isToday = (date:string) => {
    return (date === currentYear.toString()+'-'+ (((nowMonth).toString().length<2) ? (nowMonth).toString().padStart(2, '0') : (nowMonth).toString())+'-'+((now.getDate().toString().length<2) ? now.getDate().toString().padStart(2, '0') : now.getDate().toString()));
  };

  function openDayPage(day_id:number, user_id:number, hasTraining:boolean, day){
    if (hasTraining) {
      goto(`/day/?day_id=${day_id}&user_id=${user_id}`);
    }
    else if (!hasTraining) {
      dialog.showModal()
      currentClickedDay = day;
    }
  }

  function isSunday(date) {
    let temp = new Date(date);
    return temp.getDay() === 0;
  }
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
      // Sort objects by id in descending order
      dietPlanArr.sort((a, b) => b.id - a.id);
      // Find the first upcoming date
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
      console.log('Not enough days to make recap! Days now: ', matchingDates.length, 'user: ', user_id);
      console.log(matchingDates);
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

  //Format to 2024-01-01 format
  function formatDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() returns 0-11, add 1 for 1-12
    const day = date.getDate();

    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;

    return `${year}-${formattedMonth}-${formattedDay}`;
  }

  //Navigate calendar
  function navigateMonths(step:number) {
    currentDate = new Date(currentYear, currentMonth + step, 1);
    currentMonth = currentDate.getMonth();
    currentYear = currentDate.getFullYear();
    daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  }

  //BACKEND
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
		//console.log('DAYS ARRAY',daysArray);
	});
  
</script>

<div class="calendar">
  <div class="header">
    <div></div>
    <span class='monthName'>{monthnameCapitalized} {currentYear}</span>
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
    on:click={() => openDayPage(day.day_id, day.user_id, day.hasTraining, day)}
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
    
    {#if isSunday(day.date)}   
      {#if day.calorieTot && day.type}
        <span class='test'>
          <span class='bodyweight'>{day.type}</span>
          <span class='bodyweight'>{day.calorieTot} / {day.amount} <abbr style='color: rgb(80, 80, 80)'>kcal</abbr></span>
          <span class='bodyweight'> {Math.trunc(day.calorieTot/7)} / {Math.trunc(day.amount/7)} <abbr style='color: rgb(80, 80, 80)'>kcal</abbr></span>
          <span class='recap-text'>  Protein: {day.proteinTot} / {Math.trunc(day.proteinTot/7)}  <abbr style='color: rgb(80, 80, 80)'>g</abbr> </span>
          <span class='recap-text'> Carbs: {day.carbsTot} / {Math.trunc(day.carbsTot/7)}  <abbr style='color: rgb(80, 80, 80)'>g</abbr> </span>
          <span class='recap-text'> Fats: {day.fatsTot} / {Math.trunc(day.fatsTot/7)}  <abbr style='color: rgb(80, 80, 80)'>g</abbr> </span>
        </span>
      {/if}
    {/if}

  </button>

  {/each}
</div>

<Modal bind:dialog>

  <div class='modal'>
    <h1 style='color: white'>Day log</h1>

    <label for="" style='color: white; padding-bottom: 1em'>Name your day</label>
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
    background: radial-gradient(circle, rgba(26, 26, 26), rgba(26, 26, 26, 0) 60%);
    border-radius: 50px;
  }

  .test {
    position: absolute;
    top: -2px;
    left: 11em;
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
