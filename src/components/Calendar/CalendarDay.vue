<script setup lang="ts">
// defineProps<{
//   msg: string
// }>()
import { reactive, computed } from "vue";

const monthNames = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
];
const dayNames = [
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
  "Niedziela",
];

let Calendar = reactive({
  today: new Date(),
  table: [[new Date()]],
});
Calendar.table.pop();
console.log(Calendar.today);
const actualMonth = computed(() => {
  return Calendar.today.getMonth();
});
const actualYear = computed(() => {
  return Calendar.today.getFullYear();
});
const firstDayOfMonth = computed(() => {
  let date: Date = new Date();
  date.setDate(1);
  date.setMonth(actualMonth.value);
  date.setFullYear(actualYear.value);
  date.setHours(0, 0, 0, 0);
  return date;
});
const lastDayOfMonth = computed(() => {
  let date = new Date(
    Calendar.today.getFullYear(),
    Calendar.today.getMonth() + 1,
    0
  );
  return date;
});

function howManyDaysBefore() {
  if (Calendar.today.getDay() == 0) return 6;
  else return Calendar.today.getDay() - 1;
}
function howManyDaysAfter() {
  if (Calendar.today.getDay() == 0) return 0;
  else return 7 - Calendar.today.getDay();
}

function getDateXDaysAway(numOfDays: number) {
  const daysAgo = new Date(firstDayOfMonth.value.getTime());
  daysAgo.setDate(firstDayOfMonth.value.getDate() + numOfDays);
  return daysAgo;
}

for (
  let i = Calendar.today.getDate() - howManyDaysBefore() - 1;
  i < Calendar.today.getDate() + howManyDaysAfter();
  i += 7
) {
  let array = [];
  for (let j = i; j < i + 7; j++) {
    array.push(getDateXDaysAway(j));
  }
  Calendar.table.push(array);
}
</script>

<template>
  <div class="calendar-header">
    <button>
      <font-awesome-icon icon="fa-solid fa-chevron-left" />
    </button>
    <div class="header-text">
      <p style="color: #0c9ed5">DZIEŃ</p>
      <h2>
        {{
          Calendar.today.getDate() +
          " " +
          monthNames[actualMonth] +
          " " +
          actualYear
        }}
      </h2>
      <h3>{{ dayNames[Calendar.today.getDay() - 1] }}</h3>
    </div>
    <button>
      <font-awesome-icon icon="fa-solid fa-chevron-right" />
    </button>
  </div>
  <div class="calendar">
    <div class="holiday">
      <p class="holiday-text">Dzień Pieroga</p>
    </div>
    <div class="weather">
      <font-awesome-icon class="weather-icon" icon="fa-solid fa-sun" />
      <p class="temp">10°/<span style="color: #0c9ed5">-2°</span></p>
    </div>
    <div class="task">
      <p class="task-name">Nazwa zadania</p>
      <p class="task-time">16:23 jedna z lepszych godzin</p>
    </div>
  </div>

  <div class="add-button"><p class="plus">+</p></div>
</template>

<style scoped>
.calendar-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgb(84, 84, 84);

  background: rgba(255, 255, 255, 0.15);
}
.header-text {
  text-align: center;
}
button {
  background: rgba(255, 255, 255, 0.15);
  border: none;
}
.calendar {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
}

.holiday {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}
.holiday-text {
  font-size: 22px;
  color: #0c9ed5;
  font-weight: bold;
  margin-bottom: 10px;
}
.weather {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  padding: 5px 30px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 5px;
  border: 2px rgba(255, 255, 255, 0.15) solid;
  margin-bottom: 10px;
}
.weather-icon {
  transform: scale(2.5);
}
.temp {
  font-size: 2rem;
}
.task {
  display: flex;
  flex-direction: column;
  width: 95%;
  padding: 5px;
  background: rgba(255, 255, 255, 0.15);
  border: 2px #0c9ed5 solid;
  border-radius: 5px;
  margin-bottom: 10px;
}
.task-name {
  font-size: 22px;
  font-weight: bold;
}
.task-time {
  font-style: italic;
}
.add-button {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  height: 50px;
  width: 50px;
  left: 80%;
  right: 7%;
  top: 90%;
  background: #0c9ed5;
  border-radius: 8px;
  cursor: pointer;
}
.plus {
  font-weight: bold;
  position: relative;
  font-size: 3rem;
  color: black;
  bottom: 7%;
}
</style>
