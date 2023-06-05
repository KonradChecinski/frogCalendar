<script setup lang="ts">
import router from "@/router";
import { useFetchStore } from "@/stores/fetch";
import useModal from "@/stores/modal";
import { useOptionsStore } from "@/stores/Options";
import { reactive, computed, watch } from "vue";
import Task from "../Modal/Task.vue";

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
  outOfMonth: Boolean;
  currentDay: Boolean;
  chooseDay: Boolean;

  constructor(
    id: string,
    date: Date,
    showWeather: boolean,
    weather: object,
    showEvent: boolean,
    outOfMonth: Boolean,
    currentDay: Boolean,
    chooseDay: Boolean
  ) {
    this.id = id;
    this.date = date;
    this.showWeather = showWeather;
    this.weather = weather;
    this.showEvent = showEvent;
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
const dayNames = ["Pn", "Wt", "Śr", "Czw", "Pt", "So", "Nd"];

let Calendar = reactive({
  today: new Date(),
  chooseDate: new Date(),
  chooseDateDay: new Day(
    "0",
    new Date(),
    false,
    {},
    false,
    false,
    false,
    false
  ),
  table: [[new Day("0", new Date(), false, {}, false, false, false, false)]],
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
  if (firstDayOfMonth.value.getDay() == 0) return 6;
  else return firstDayOfMonth.value.getDay() - 1;
}
function howManyDaysAfter() {
  if (lastDayOfMonth.value.getDay() == 0) return 0;
  else return 7 - lastDayOfMonth.value.getDay();
}

function getDateXDaysAway(numOfDays: number) {
  const daysAgo = new Date(firstDayOfMonth.value.getTime());
  daysAgo.setDate(firstDayOfMonth.value.getDate() + numOfDays);
  return daysAgo;
}

function setCalendarTable() {
  for (
    let i = 0 - howManyDaysBefore();
    i < lastDayOfMonth.value.getDate() + howManyDaysAfter();
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

      let showEvent =
        OptionsStore.Events &&
        FetchStore.Events.find((obj: any) => {
          return (
            obj.date ===
            date.getFullYear() +
              "-" +
              ("0" + (date.getMonth() + 1)).slice(-2) +
              "-" +
              ("0" + date.getDate()).slice(-2)
          );
        });

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
    Calendar.chooseDate.getMonth() - 1,
    1
  );
  Calendar.update.count++;
}
function setMonthLater() {
  Calendar.chooseDate = new Date(
    Calendar.chooseDate.getFullYear(),
    Calendar.chooseDate.getMonth() + 1,
    1
  );
  Calendar.update.count++;
}

function changeSelection(day: Day) {
  day.chooseDay = true;
  if (day != Calendar.chooseDateDay) Calendar.chooseDateDay.chooseDay = false;
  if (
    "" + day.date.getFullYear() + ("0" + day.date.getMonth()).slice(-2) !=
    "" +
      Calendar.chooseDate.getFullYear() +
      ("0" + Calendar.chooseDate.getMonth()).slice(-2)
  ) {
    if (
      "" + day.date.getFullYear() + ("0" + day.date.getMonth()).slice(-2) <
      "" +
        Calendar.chooseDate.getFullYear() +
        ("0" + Calendar.chooseDate.getMonth()).slice(-2)
    )
      setMonthEarlier();
    else setMonthLater();
  }

  if (Calendar.chooseDateDay == day)
    router.push({ path: "/cal1", query: { date: JSON.stringify(day.date) } });
  Calendar.chooseDateDay = day;
}

function getWeatherIcon(weather: any) {
  if (weather.day)
    return `/src/assets/icons/weather/${weather.day.condition.code}.svg`;

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
  modal.open(Task, Calendar.chooseDateDay.date, true, [
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
  <!-- <div class="top-nav-bar">
    <div class="menu-icon-container">
      <img id="menu-icon" src="@/assets/icons/menu_icon.png" />
    </div>
  </div> -->

  <div class="calendar-header">
    <button @click="setMonthEarlier">
      <font-awesome-icon icon="fa-solid fa-chevron-left" />
    </button>
    <div class="header-text">
      <p style="color: #0c9ed5">MIESIĄC</p>
      <h2>{{ monthNames[actualMonth] + " " + actualYear }}</h2>
    </div>
    <button @click="setMonthLater">
      <font-awesome-icon icon="fa-solid fa-chevron-right" />
    </button>
  </div>
  <div class="calendar">
    <!-- <div class="row row-info"></div> -->
    <div class="row row-info">
      <div class="day day-name" v-for="item in dayNames">{{ item }}</div>
    </div>
    <div class="row" v-for="array in Calendar.table">
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
        <div class="date">
          <span>{{ day.date.getDate() }}</span>
        </div>

        <div class="weather">
          <img
            v-if="day.showWeather"
            :src="getWeatherIcon(day.weather)"
            alt="Pogoda"
            class="weather-icon"
          />
        </div>
        <div class="event">
          <div v-if="day.showEvent"></div>
        </div>

        <!-- <div class="info"></div> -->
      </div>
    </div>
  </div>

  <div class="add-button" @click="handleOnClickOpenModal">
    <font-awesome-icon icon="fa-solid fa-plus" class="plus" />
  </div>
</template>

<style scoped src="@/assets/css/calendarMonth.css"></style>
