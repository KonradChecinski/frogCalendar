import { ref, computed, watch, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useOptionsStore = defineStore('Options', () => {
  const Weather = ref();
  const Holidays = ref();
  const Events = ref();


  const WeatherUpdate = reactive({count: 0});
  const HolidaysUpdate = reactive({count: 0});
  const EventsUpdate = reactive({count: 0});

  watch(Weather, ()=>{
    if (isLocalStorageAvailable()) {
      let str = '';
      Weather.value == true ? str='true' : str='false';
      localStorage.setItem('option.weather', str);
    }
    WeatherUpdate.count++;
  })
  watch(Holidays, ()=>{
    if (isLocalStorageAvailable()) {
      let str = '';
      Holidays.value == true ? str='true' : str='false';
      localStorage.setItem('option.holidays', str);
    }
    HolidaysUpdate.count++;
  })
  watch(Events, ()=>{
    if (isLocalStorageAvailable()) {
      let str = '';
      Events.value == true ? str='true' : str='false';
      localStorage.setItem('option.events', str);
    }
    EventsUpdate.count++;
  })

  return { Weather, WeatherUpdate, Holidays, HolidaysUpdate, Events, EventsUpdate }
})




function isLocalStorageAvailable(){
  var test = 'test';
  try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
  } catch(e) {
      return false;
  }
}