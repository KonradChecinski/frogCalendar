<script setup lang="ts">
import router from "@/router";
import { useFetchStore } from "@/stores/fetch";
import useModal from "@/stores/modal";
import { useOptionsStore } from "@/stores/Options";
import { reactive, computed, watch } from "vue";
import Task from "../Modal/Task.vue";
import WelcomeItem from "../WelcomeItem.vue";

const OptionsStore = useOptionsStore();
const FetchStore = useFetchStore();

// defineProps<{
//   menuOpen: boolean;
// }>();

class Day {
  id: string;
  date: Date;
  showWeather: Boolean;
  weather: object;
  showEvent: Boolean;
  events: any;
  showHoliday: Boolean;
  holidays: any;
  outOfMonth: Boolean;
  currentDay: Boolean;
  chooseDay: Boolean;

  constructor(
    id: string,
    date: Date,
    showWeather: boolean,
    weather: object,
    showEvent: boolean,
    events: object,
    showHoliday: Boolean,
    holidays: any,
    outOfMonth: Boolean,
    currentDay: Boolean,
    chooseDay: Boolean
  ) {
    this.id = id;
    this.date = date;
    this.showWeather = showWeather;
    this.weather = weather;
    this.showEvent = showEvent;
    this.events = events;
    this.showHoliday = showHoliday;
    this.holidays = holidays;
    this.outOfMonth = outOfMonth;
    this.currentDay = currentDay;
    this.chooseDay = chooseDay;
  }
}

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
const dayNames = ["Nd", "Pn", "Wt", "Śr", "Czw", "Pt", "So", "Nd"];

let Calendar = reactive({
  today: new Date(),
  chooseDate: new Date(),
  chooseDateDay: new Day(
    "0",
    new Date(),
    false,
    {},
    false,
    {},
    false,
    {},
    false,
    false,
    false
  ),
  table: [
    [
      new Day(
        "0",
        new Date(),
        false,
        {},
        false,
        {},
        false,
        {},
        false,
        false,
        false
      ),
    ],
  ],
  update: { count: 0 },
});

watch(Calendar.update, async () => {
  Calendar.table.length = 0;
  setCalendarTable();
});

watch(OptionsStore.WeatherUpdate, () => {
  Calendar.update.count++;
});
watch(OptionsStore.HolidaysUpdate, () => {
  Calendar.update.count++;
});
watch(OptionsStore.EventsUpdate, () => {
  Calendar.update.count++;
});
Calendar.table.pop();
Calendar.update.count++;

const actualMonth = computed(() => {
  return Calendar.chooseDate.getMonth();
});
const actualYear = computed(() => {
  return Calendar.chooseDate.getFullYear();
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
    Calendar.chooseDate.getFullYear(),
    Calendar.chooseDate.getMonth() + 1,
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

function setCalendarTable() {
  for (
    let i = Calendar.chooseDate.getDate() - howManyDaysBefore() - 1;
    i < Calendar.chooseDate.getDate() + howManyDaysAfter();
    i += 7
  ) {
    let array = [];
    for (let j = i; j < i + 7; j++) {
      let date = getDateXDaysAway(j);
      Calendar.today.setHours(0, 0, 0, 0);

      let id = date.getFullYear() + "" + date.getMonth() + date.getDate();

      let showWeather =
        OptionsStore.Weather &&
        date >= Calendar.today &&
        date <
          new Date(
            Calendar.today.getFullYear(),
            Calendar.today.getMonth(),
            Calendar.today.getDate() + 13
          ); //getWeekOfYear(date) == getWeekOfYear(Calendar.today)

      let weather: any = FetchStore.Weather.find((obj: any) => {
        return (
          obj.date ===
          date.getFullYear() +
            "-" +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + date.getDate()).slice(-2)
        );
      });
      showWeather = showWeather && weather;

      let events: any = FetchStore.Events.filter((obj: any) => {
        return (
          obj.date ===
          date.getFullYear() +
            "-" +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + date.getDate()).slice(-2)
        );
      });
      if (events.length == 0) events = undefined;
      let showEvent = OptionsStore.Events && events;

      let holidays: any = FetchStore.SpecialEvents.filter((obj: any) => {
        return (
          obj.id ===
          "" +
            ("0" + date.getDate()).slice(-2) +
            ("0" + (date.getMonth() + 1)).slice(-2)
        );
      });

      if (holidays.length == 0) holidays = undefined;
      let showHolidays = OptionsStore.Holidays && holidays;

      let outOfMonth = date.getMonth() != Calendar.chooseDate.getMonth();
      let currentDay = date.toDateString() == Calendar.today.toDateString();
      let chooseDay =
        date.toDateString() == Calendar.chooseDateDay.date.toDateString(); //date.getDate() == Calendar.chooseDate.getDate();

      let resultDate = new Day(
        id,
        date,
        showWeather,
        weather ?? {},
        showEvent,
        events ?? {},
        showHolidays,
        holidays ?? {},
        outOfMonth,
        currentDay,
        chooseDay
      );
      array.push(resultDate);
      if (chooseDay) Calendar.chooseDateDay = resultDate;
    }
    Calendar.table.push(array);
  }
}

function setMonthEarlier() {
  Calendar.chooseDate = new Date(
    Calendar.chooseDate.getFullYear(),
    Calendar.chooseDate.getMonth(),
    Calendar.chooseDate.getDate() - 7
  );
  Calendar.update.count++;
}
function setMonthLater() {
  Calendar.chooseDate = new Date(
    Calendar.chooseDate.getFullYear(),
    Calendar.chooseDate.getMonth(),
    Calendar.chooseDate.getDate() + 7
  );
  Calendar.update.count++;
}

function changeSelection(day: Day) {
  day.chooseDay = true;
  if (day != Calendar.chooseDateDay) Calendar.chooseDateDay.chooseDay = false;
  // if (
  //   "" + day.date.getFullYear() + ("0" + day.date.getMonth()).slice(-2) !=
  //   "" +
  //     Calendar.chooseDate.getFullYear() +
  //     ("0" + Calendar.chooseDate.getMonth()).slice(-2)
  // ) {
  //   if (
  //     "" + day.date.getFullYear() + ("0" + day.date.getMonth()).slice(-2) <
  //     "" +
  //       Calendar.chooseDate.getFullYear() +
  //       ("0" + Calendar.chooseDate.getMonth()).slice(-2)
  //   )
  //     setMonthEarlier();
  //   else setMonthLater();
  // }

  if (Calendar.chooseDateDay == day)
    router.push({ path: "/cal1", query: { date: JSON.stringify(day.date) } });
  Calendar.chooseDateDay = day;
}

function getWeatherIcon(weather: any) {
  if (weather.day)
    return `/src/assets/icons/weather/${weather.day.condition.code}.svg`;

  return "";
}
function getWeatherMaxTemp(weather: any) {
  if (weather.day) return weather.day.maxtemp_c;

  return "";
}
function getWeatherMinTemp(weather: any) {
  if (weather.day) return weather.day.mintemp_c;

  return "";
}
const getWeekOfYear = function (date: Date) {
  var target = new Date(date.valueOf()),
    dayNumber = (date.getUTCDay() + 7) % 7,
    firstThursday;

  target.setUTCDate(target.getUTCDate() - dayNumber + 3);
  firstThursday = target.valueOf();
  target.setUTCMonth(0, 1);

  if (target.getUTCDay() !== 4) {
    target.setUTCMonth(0, 1 + ((4 - target.getUTCDay() + 7) % 7));
  }

  return (
    Math.ceil((firstThursday - target.valueOf()) / (7 * 24 * 3600 * 1000)) + 1
  );
};

// no need to import defineEmits
const emit = defineEmits(["update:modelValue"]);

// // when someVar changes, it will update the reference passed via v-model
// watch(someVar, (value) => {
//   emit("update:modelValue", value);
// });

const modal = useModal();
  function handleOnClickOpenModal() {
    modal.open(Task,
    Calendar.chooseDateDay.date,
    true,
     [
      // {
      //   label: "Save",
      //   callback: (dataFromView) => {
      //     console.log(dataFromView);
      //     modal.close();
      //   },
      // }
    ]);
  }
</script>

<template>
  <div class="calendar-header">
    <button @click="setMonthEarlier">
      <font-awesome-icon icon="fa-solid fa-chevron-left" />
    </button>
    <div class="header-text">
      <p style="color: #0c9ed5">TYDZIEŃ</p>
      <h2>{{ monthNames[actualMonth] + " " + actualYear }}</h2>
    </div>
    <button @click="setMonthLater">
      <font-awesome-icon icon="fa-solid fa-chevron-right" />
    </button>
  </div>
  <div class="calendar">
    <div class="column" v-for="array in Calendar.table">
      <div
        @click="changeSelection(day)"
        class="day"
        :class="{
          'out-of-month': day.outOfMonth,
          'current-day': day.currentDay,
          'choose-day': day.chooseDay,
        }"
        v-for="day in array"
      >
        <div class="day-container">
          <div class="day-name">{{ dayNames[day.date.getDay()] }}</div>

          <div class="date">{{ day.date.getDate() }}</div>
        </div>
        <div class="info-container">
          <div class="weather" v-if="day.showWeather">
            <img
              v-if="day.showWeather"
              :src="getWeatherIcon(day.weather)"
              alt="Pogoda"
              class="weather-icon"
            />
            <p class="temp">
              {{ getWeatherMaxTemp(day.weather) }}°/<span style="color: #0c9ed5"
                >{{ getWeatherMinTemp(day.weather) }}°</span
              >
            </p>
          </div>
          <div
            class="holiday"
            v-if="day.showHoliday"
            v-for="holiday in day.holidays"
          >
            <p class="holiday-text">{{ holiday.name }}</p>
          </div>
          <div
            class="task"
            v-if="day.showEvent"
            v-for="event in day.events"
            :style="{ backgroundColor: '#' + event.color }"
          >
            <p class="task-name">{{ event.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="add-button" @click="handleOnClickOpenModal">
    <p class="plus">+</p>
  </div>
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
}
.column {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.day {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  text-align: center;
  flex: 1;
  border-bottom: 2px rgba(255, 255, 255, 0.15) solid;
}
.day-container {
  display: flex;
  flex-direction: column;
  width: 40px;
  min-width: 40px;
}
.date {
  font-size: 18px;
  text-align: center;
  padding-left: 5px;
}
.day-name {
  text-align: center;
  padding-left: 5px;
  color: #0c9ed5;
}
.info-container {
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  align-items: center;
  margin-left: 10px;
  overflow-x: auto;
  overflow-y: hidden;
}
.holiday {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 5px;
  border: 2px rgba(255, 255, 255, 0.15) solid;
  padding: 6px;
  height: 80%;
  /* max-width: 200px; */
  max-height: 70px;
}
.holiday-text {
  font-size: 15px;
  color: #0c9ed5;
  font-weight: bold;
  white-space: nowrap;
}
.weather {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 5px;
  border: 2px rgba(255, 255, 255, 0.15) solid;
  padding: 10px 5px 0px 5px;
  height: 80%;
  max-height: 70px;
  width: 100px;
  min-width: 100px;
}
.weather-icon {
  width: 60%;
  margin: -15px;
  aspect-ratio: 1/1;
}
.weather .temp {
  font-size: 1rem;
}
.task {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4px;
  background: rgba(255, 255, 255, 0.15);
  border: 2px #0c9ed5 solid;
  border-radius: 5px;
  height: 80%;
  max-height: 70px;
}
.task-name {
  font-size: 16px;
  font-weight: bold;
}
.out-of-month {
  background-color: rgba(255, 255, 255, 0.087);
}
.current-day .date {
  background-color: rgb(189, 189, 189);
  padding: 5px;
  border-radius: 8px;
  color: rgb(44, 44, 44);
}
.choose-day {
  box-sizing: border-box;
  border: 2px #0c9ed5 solid;
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
