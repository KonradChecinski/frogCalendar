<script setup lang="ts">
import router from "@/router";
import { useFetchStore } from "@/stores/fetch";
import useModal from "@/stores/modal";
import { useOptionsStore } from "@/stores/Options";
import { reactive, computed, watch } from "vue";
import Task from "../Modal/Task.vue";
import WeatherDetails from "../Modal/WeatherDetails.vue";
import WelcomeItem from "../WelcomeItem.vue";

const OptionsStore = useOptionsStore();
const FetchStore = useFetchStore();

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

let startDate = new Date();
if (router.currentRoute.value.query.date != undefined) {
  let query: any = router.currentRoute.value.query.date;
  startDate = new Date(JSON.parse(query));
}

let Calendar = reactive({
  today: new Date(),
  chooseDate: startDate,
  chooseDateDay: new Day(
    "0",
    startDate,
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
    let i = Calendar.chooseDate.getDate() - 1;
    i < Calendar.chooseDate.getDate();
    i += 7
  ) {
    let array = [];
    for (let j = i; j < i + 1; j++) {
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
    Calendar.chooseDate.getDate() - 1
  );
  Calendar.update.count++;
}
function setMonthLater() {
  Calendar.chooseDate = new Date(
    Calendar.chooseDate.getFullYear(),
    Calendar.chooseDate.getMonth(),
    Calendar.chooseDate.getDate() + 1
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

function getTaskHours(event: any) {
  if (event.startTime) return `${event.startTime} - ${event.endTime}`;
  return `cały dzień`;
}
// no need to import defineEmits
const emit = defineEmits(["update:modelValue"]);

// // when someVar changes, it will update the reference passed via v-model
// watch(someVar, (value) => {
//   emit("update:modelValue", value);
// });

const modal = useModal();
function handleOnClickOpenModal(event: any) {
  modal.open(Task, Calendar.chooseDate, false, event, [
    // {
    //   label: "Save",
    //   callback: (dataFromView) => {
    //     console.log(dataFromView);
    //     modal.close();
    //   },
    // }
  ]);
}

function handleOnClickOpenModalEdit(event: any) {
  modal.open(Task, Calendar.chooseDate, true, event, [
    // {
    //   label: "Save",
    //   callback: (dataFromView) => {
    //     console.log(dataFromView);
    //     modal.close();
    //   },
    // }
  ]);
}

function handleOnClickOpenModalWeather() {
  modal.open(WeatherDetails, Calendar.chooseDate, false, [
    // {
    //   label: "Save",
    //   callback: (dataFromView) => {
    //     console.log(dataFromView);
    //     modal.close();
    //   },
    // }
  ]);
}

function getContrastYIQ(hexcolor: any){
    var r = parseInt(hexcolor.substring(1,3),16);
    var g = parseInt(hexcolor.substring(3,5),16);
    var b = parseInt(hexcolor.substring(5,7),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
}
</script>

<template>
  <div class="calendar-header">
    <button @click="setMonthEarlier">
      <font-awesome-icon icon="fa-solid fa-chevron-left" />
    </button>
    <div class="header-text">
      <p style="color: #0c9ed5">DZIEŃ</p>
      <h2>
        {{
          Calendar.chooseDate.getDate() +
          " " +
          monthNames[actualMonth] +
          " " +
          actualYear
        }}
      </h2>
      <h3>{{ dayNames[Calendar.today.getDay()] }}</h3>
    </div>
    <button @click="setMonthLater">
      <font-awesome-icon icon="fa-solid fa-chevron-right" />
    </button>
  </div>
  <div class="calendar" v-for="day in Calendar.table[0]">
    <div class="holiday" v-if="day.showHoliday">
      <p class="holiday-text" v-for="holiday in day.holidays">
        {{ holiday.name }}
      </p>
    </div>
    <div
      class="weather"
      v-if="day.showWeather"
      @click="handleOnClickOpenModalWeather"
    >
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
      class="task"
      @click="handleOnClickOpenModal(event)"
      v-if="day.showEvent"
      v-for="event in day.events"
      :style="{ 
        backgroundColor: '#' + event.color,
        color: getContrastYIQ('#' + event.color)
    }"
    >
      <p class="task-name">{{ event.name }}</p>
      <p class="task-description">{{ event.description }}</p>
      <p class="task-time">{{ getTaskHours(event) }}</p>
    </div>
  </div>

  <div class="add-button" @click="handleOnClickOpenModalEdit(undefined)">
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
  align-items: center;
  overflow-y: auto;
}

.holiday {
  margin-top: 15px;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 15px;
}
.holiday-text {
  font-size: 22px;
  color: #0c9ed5;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
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
  margin-bottom: 5px;
  margin-top: 5px;
}
.weather-icon {
  transform: scale(1.5);
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
  margin-bottom: 5px;
  margin-top: 5px;
  cursor: pointer;
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
