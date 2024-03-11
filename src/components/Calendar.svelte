<!-- src/Calendar.svelte -->
<script>
  import { onMount } from 'svelte';

  let now = new Date();
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  let firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  $: monthName = currentDate.toLocaleString('default', { month: 'long' });
  $: daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  $: emptyStartDays = Array.from({ length: firstDayOfMonth });

  $: isToday = (day) => {
    return day === now.getUTCDate() && currentMonth === now.getUTCMonth() && currentYear === now.getFullYear();
  };

  function navigateMonths(step) {
    currentDate = new Date(currentYear, currentMonth + step, 1);
    currentMonth = currentDate.getMonth();
    currentYear = currentDate.getFullYear();
    daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  }
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
    {#if isToday(day)}
      <div class="currentDayContainer">
        <button class="dayButton">{day}</button>
        <button class="activityButtonTom">Tom: Upper</button>
      </div>
    {:else}
      <div class="dayContainer">
        <button class="dayButton">{day}</button>
        <button class="activityButtonTom">Tom: Upper</button>
        <button class="activityButtonSaab">Saab: Lower</button>
      </div>
    {/if}
  {/each}
</div>

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

  .activityButtonTom {
    display: flex;
    background-color: transparent;
    border: solid 1px rgb(255, 89, 33);
    border-radius: 40px;
    color: white;
    transition: 0s;
    padding: 5px;
    margin: 3px;
  }

  .activityButtonSaab {
    display: flex;
    background-color: transparent;
    border: solid 1px rgb(44, 255, 33);
    border-radius: 40px;
    color: white;
    transition: 0s;
    padding: 5px;
    margin: 3px;
  }

  .activityButtonTom:hover, .activityButtonSaab:hover {
    cursor: pointer
  }

  .activityButtonTom:active, .activityButtonSaab:active {
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
