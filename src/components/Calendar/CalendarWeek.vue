<script setup lang="ts">
// defineProps<{
//   msg: string
// }>()
import { reactive, computed } from 'vue';


const monthNames = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
];

let Calendar = reactive({
  'today': new Date(),
  'table' : [[new Date]]
})
Calendar.table.pop()
console.log(Calendar.today);
const actualMonth = computed(() => {
    return Calendar.today.getMonth();
})
const actualYear = computed(() => {
    return Calendar.today.getFullYear();
})
const firstDayOfMonth = computed(() => {
    let date: Date = new Date();
    date.setDate(1);
    date.setMonth(actualMonth.value);
    date.setFullYear(actualYear.value);
    date.setHours(0,0,0,0);
    return date;
})
const lastDayOfMonth = computed(() => {
    let date = new Date(Calendar.today.getFullYear(), Calendar.today.getMonth()+1, 0);
    return date;
})


function howManyDaysBefore(){
  if(Calendar.today.getDay()==0) return 6;
  else return Calendar.today.getDay()-1;
}
function howManyDaysAfter(){
  if(Calendar.today.getDay()==0) return 0;
  else return 7 - Calendar.today.getDay();
}

function getDateXDaysAway(numOfDays: number) {
  const daysAgo = new Date(firstDayOfMonth.value.getTime());
  daysAgo.setDate(firstDayOfMonth.value.getDate() + numOfDays);
  return daysAgo;
}

for (let i = Calendar.today.getDate()-howManyDaysBefore() - 1; i < Calendar.today.getDate() + howManyDaysAfter(); i+=7) {
    let array = []
    for(let j=i; j<i+7; j++){
        array.push(getDateXDaysAway(j))
    }
    Calendar.table.push(array)
}

</script>

<template>
    <h1 class="green"><slot /></h1>
    <div class="calenda-header green">
      <h2>{{ monthNames[actualMonth] }}</h2>
    </div>
    <div class="calendar">
        <div class="row" v-for="array in Calendar.table">
          <div class="day" :class="{'out-of-month': day.getMonth() != Calendar.today.getMonth(),
        'current-day': day.getDate() == Calendar.today.getDate()}" v-for="day in array">
            <div class="date" >{{ day.getDate() }}</div>
            <div class="info"></div>
            <div class="weather"><font-awesome-icon icon="fa-solid fa-sun" /></div>
          </div>
        </div>
    </div>

</template>

<style scoped>
.calendar{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.row{
    display: flex;
    flex-direction: row;
    flex: 1;
}
.day{
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    text-align: center;
    flex-direction: column;
    flex: 1;

    border: 1px white solid;
}
.date{
  font-size: 12px;
  text-align: left;
  padding-left: 5px;

}
.info{
  height: 100%;
}
.weather{
  margin-bottom: 5px;
}
.out-of-month{
  background-color: rgba(255, 255, 255, 0.3);
}
.current-day{
  background-color: rgba(59, 179, 254, 0.641);
}
</style>
