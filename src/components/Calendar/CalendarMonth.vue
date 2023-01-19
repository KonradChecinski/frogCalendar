<script setup lang="ts">
// defineProps<{
//   msg: string
// }>()
import { reactive, computed, watch } from 'vue';

class Day{
    id: string;
    date: Date;
    showWeather: Boolean;
    outOfMonth: Boolean;
    currentDay: Boolean;
    chooseDay: Boolean;

    constructor(id: string, date: Date, showWeather: boolean, outOfMonth: Boolean, currentDay: Boolean, chooseDay: Boolean){
        this.id = id;
        this.date = date;
        this.showWeather = showWeather;
        this.outOfMonth = outOfMonth;
        this.currentDay = currentDay;
        this.chooseDay=chooseDay;
    }
}


const monthNames = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
    "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
];
const dayNames = ["Pn", "Wt", "Śr", "Czw", "Pi", "So", "Nd"];

let Calendar = reactive({
    'today': new Date(),
    'chooseDate': new Date(),
    'chooseDateDay': new Day('0',new Date(), false, false, false,false),
    'table': [[new Day('0',new Date(), false, false, false,false)]],
    'update': { count: 0 }
})


watch(Calendar.update, async () => {
    Calendar.table.length = 0;
    setCalendarTable();
})
Calendar.table.pop()
Calendar.update.count++;


const actualMonth = computed(() => {
    return Calendar.chooseDate.getMonth();
})
const actualYear = computed(() => {
    return Calendar.chooseDate.getFullYear();
})
const firstDayOfMonth = computed(() => {
    let date: Date = new Date();
    date.setDate(1);
    date.setMonth(actualMonth.value);
    date.setFullYear(actualYear.value);
    date.setHours(0, 0, 0, 0);
    return date;
})
const lastDayOfMonth = computed(() => {
    let date = new Date(Calendar.chooseDate.getFullYear(), Calendar.chooseDate.getMonth() + 1, 0);
    return date;
})


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
    for (let i = 0 - howManyDaysBefore(); i < lastDayOfMonth.value.getDate() + howManyDaysAfter(); i += 7) {
        let array = []
        for (let j = i; j < i + 7; j++) {
            let date = getDateXDaysAway(j);
            Calendar.today.setHours(0,0,0,0);

            let id = date.getFullYear() + '' + date.getMonth() + date.getDate();

            let showWeather = (date >= Calendar.today && date < new Date(Calendar.today.getFullYear(),Calendar.today.getMonth(), Calendar.today.getDate() +14)); //getWeekOfYear(date) == getWeekOfYear(Calendar.today)
            let outOfMonth = date.getMonth() != Calendar.chooseDate.getMonth();
            let currentDay = date.toDateString() == Calendar.today.toDateString();
            let chooseDay = date.toDateString() == Calendar.today.toDateString();//date.getDate() == Calendar.chooseDate.getDate();




            let resultDate = new Day(id,date,showWeather,outOfMonth,currentDay,chooseDay);
            array.push(resultDate)
            if(chooseDay) Calendar.chooseDateDay = resultDate;
        }
        Calendar.table.push(array)
    }
}


function setMonthEarlier() {
    Calendar.chooseDate = new Date(Calendar.chooseDate.getFullYear(), Calendar.chooseDate.getMonth() - 1, Calendar.chooseDate.getDate())
    Calendar.update.count++;
}
function setMonthLater() {
    Calendar.chooseDate = new Date(Calendar.chooseDate.getFullYear(), Calendar.chooseDate.getMonth() + 1, Calendar.chooseDate.getDate())
    Calendar.update.count++;
}

function changeSelection(day: Day){
    day.chooseDay=true;
    if(day != Calendar.chooseDateDay) Calendar.chooseDateDay.chooseDay = false;
    if(('' + day.date.getFullYear() + ('0' + day.date.getMonth()).slice(-2)) != ('' + Calendar.chooseDate.getFullYear() + ('0' + Calendar.chooseDate.getMonth()).slice(-2))){
        if(('' + day.date.getFullYear() + ('0' + day.date.getMonth()).slice(-2)) < ('' + Calendar.chooseDate.getFullYear() + ('0' + Calendar.chooseDate.getMonth()).slice(-2))) setMonthEarlier();
        else setMonthLater();
    }

    Calendar.chooseDateDay = day;
}


const getWeekOfYear = function(date: Date) {
        var target = new Date(date.valueOf()),
            dayNumber = (date.getUTCDay() + 7) % 7,
            firstThursday;

        target.setUTCDate(target.getUTCDate() - dayNumber + 3);
        firstThursday = target.valueOf();
        target.setUTCMonth(0, 1);

        if (target.getUTCDay() !== 4) {
            target.setUTCMonth(0, 1 + ((4 - target.getUTCDay()) + 7) % 7);
        }

        return Math.ceil((firstThursday - target.valueOf()) /  (7 * 24 * 3600 * 1000)) + 1;
    }
</script>

<template>
    <h1 class="green">
        <slot />
    </h1>
    <div class="calenda-header green">
        <h2>{{ monthNames[actualMonth] + ' ' + actualYear }}</h2>
    </div>
    <div class="calendar">
        <div class="row row-info">
            <button @click="setMonthEarlier"><font-awesome-icon icon="fa-solid fa-arrow-left-long" /></button>
            <button @click="setMonthLater"><font-awesome-icon icon="fa-solid fa-arrow-right-long" /></button>
        </div>
        <div class="row row-info">
            <div class="day day-name" v-for="item in dayNames">{{ item }}</div>
        </div>
        <div class="row" v-for="array in Calendar.table">
            <div @click="changeSelection(day)"
            class="day" :class="{
                'out-of-month': day.outOfMonth,
                'current-day': day.currentDay,
                'choose-day': day.chooseDay,
            }" 
            v-for="day in array">
                <div class="date"><span>{{ day.date.getDate() }}</span></div>
                <div class="info"></div>
                    <div class="weather" v-if="day.showWeather"><font-awesome-icon icon="fa-solid fa-sun" /></div>
                    <div class="weather" v-else></div>
            </div>
        </div>
    </div>

</template>

<style scoped>
.calendar {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.row {
    display: flex;
    flex-direction: row;
    flex: 3;
    border-bottom: 1px solid rgb(84, 84, 84);
}

.day {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    text-align: center;
    flex-direction: column;
    flex: 3;

    border: 1px solid transparent;
}

.day-name,
.row-info {
    flex: 1;
}

.date > span {
    font-size: 12px;
    text-align: center;
    color: white;
    font-weight: bold;
}

.info {
    height: 100%;
}

.weather {
    margin-bottom: 5px;
}



.out-of-month {
    /* background-color: rgba(255, 255, 255, 0.3); */
    opacity: 0.3;
}
.choose-day{
    border-radius: 5px;
    border: 1px solid gray;
}
.current-day {
    
}
.day.current-day > .date > span{
    background-color: rgb(189, 189, 189);
    padding: 5px;
    border-radius: 8px;
    color: rgb(44, 44, 44);
}
</style>