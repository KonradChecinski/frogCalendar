<script setup lang="ts">
import { useFetchStore } from "@/stores/fetch";
import { useOptionsStore } from "@/stores/Options";

const props = defineProps<{
      date: Date
      edit: Boolean
    }>()

    
  const OptionsStore = useOptionsStore();
  const FetchStore = useFetchStore();

  const weather:any = FetchStore.Weather.find((obj: any) => {
          return obj.date === props.date.getFullYear() + '-' + ("0" + (props.date.getMonth()+1)).slice(-2) + '-' + ("0" + (props.date.getDate())).slice(-2)
        })
  console.log(weather);
  

  function getNameOfMoon(name: string){
    switch (name) {
      case "New Moon":
        return "Nów";
        break;
      case "Waxing Crescent":
        return "Przybywający sierp";
        break;
      case "First Quarter":
        return "Pierwsza kwadra";
        break;
      case "Waxing Gibbous":
        return "Księżyc przybywający garbaty";
        break;
      case "Full Moon":
        return "Pełnia";
        break;
      case "Waning Gibbous":
        return "Księżyc ubywający garbaty";
        break;
      case "Last Quarter":
        return "Trzecia kwadra";
        break;
      case "Waning Crescent":
        return "Księżyc balsamiczny";
        break;

      default:
        break;
    }
    return ''
  }

  function getWeatherIcon( weather: any){
  if(weather.day) return `/src/assets/icons/weather/${weather.day.condition.code}.svg`

  return '';
}


  function get24Time(timeString: string) {
    const [time, modifier] = timeString.split(' ');

  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'PM') {
    hours = (parseInt(hours, 10) + 12).toString();
  }

  return `${hours}:${minutes}`;
  }
</script>

<template>
  <div class="weather-details-container">
    <div class="header"><img class="x-icon" alt="exit icon" src="@/assets/icons/x_icon.png" @click="$emit('closeClick')"/></div>
    

    <div class="info-header">
      <p class="weather-details-text">Szczegóły pogody</p>
      <p class="date">{{ ("0" + (props.date.getDate())).slice(-2) + '.' + ("0" + (props.date.getMonth()+1)).slice(-2)  + '.' + props.date.getFullYear()}}</p>
    </div>

    <div class="info-weather-container">
      <img
            :src="getWeatherIcon(weather)"
            alt="Pogoda"
            class="weather-icon"
          />
      <div class="info-weather">
        <p class="weather-info-text">WILGOTNOŚĆ</p>
        <p>{{ weather.day.avghumidity }}%</p>
        <p class="weather-info-text">OPADY DESZCZU</p>
        <p>{{ weather.day.daily_chance_of_rain }}%</p>
        <p class="weather-info-text">OPADY ŚNIEGU</p>
        <p>{{ weather.day.daily_chance_of_snow }}%</p>
        <p class="weather-info-text">TEMPERATURA</p>
        <p class="temp">{{ weather.day.maxtemp_c }}°/<span style="color: #0c9ed5">{{ weather.day.mintemp_c }}°</span></p>
      </div>
    </div>

    <div class="sun-info-container">
      <div class="sunrise-container">
        <img
          src="@/assets/icons/sunrise_icon.png"
          alt="sunrise"
          class="sunrise-icon"
        />
        <div class="sunrise-info">
          <p class="weather-info-text">WSCHÓD SŁOŃCA</p>
          <p>{{ get24Time(weather.astro.sunrise) }}</p>
        </div>
      </div>
      <div class="sunset-container">
        <img
          src="@/assets/icons/sunset_icon.png"
          alt="sunset"
          class="sunset-icon"
        />
        <div class="sunset-info">
          <p class="weather-info-text">ZACHÓD SŁOŃCA</p>
          <p>{{ get24Time(weather.astro.sunset) }}</p>
        </div>
      </div>
    </div>

    <div class="moon-phase-container">
      <img src="@/assets/icons/moon.png" alt="moon" class="moon-icon" />
      <div class="sunrise-info">
        <p class="weather-info-text">FAZA KSIĘŻYCA</p>
        <p>{{ getNameOfMoon(weather.astro.moon_phase) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped src="@/assets/css/weatherDetails.css"></style>
