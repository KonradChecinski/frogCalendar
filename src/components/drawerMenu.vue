<script setup lang="ts">
import router from "@/router";
import { useFetchStore } from "@/stores/fetch";
import { useLoggedStore } from "@/stores/LoggedIn";
import { useOptionsStore } from "@/stores/Options";
import Button from "./Button.vue";

const LoggedStore = useLoggedStore();
const FetchStore = useFetchStore();
const OptionsStore = useOptionsStore();

if (isLocalStorageAvailable()) {
  console.log(localStorage.getItem('option.weather'));
OptionsStore.Weather = localStorage.getItem('option.weather') == 'true' ? true : false;
OptionsStore.Holidays = localStorage.getItem('option.holidays') == 'true' ? true : false;
}

function logout(e: any) {
  e.preventDefault();
  
      LoggedStore.username = null;
      LoggedStore.email = null;
      LoggedStore.isLoggedIn = false;

      localStorage.removeItem('APIKey');

      router.replace('/login');
}



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
</script>

<template>
  <input type="checkbox" id="drawer-toggle" name="drawer-toggle" />
  <label for="drawer-toggle" id="drawer-toggle-label"></label>
  <header></header>
  <nav id="drawer">
    <div class="user-info">
      <p class="uname">{{ LoggedStore.username }}</p>
      <p class="email">{{ LoggedStore.email }}</p>
    </div>

    <div class="navigation">
      <p class="label-text">Widok</p>
      <div class="row">
        <RouterLink to="/cal1">
          <img src="@/assets/icons/day_icon.png" />
          <p>Dzień</p>
        </RouterLink>
      </div>
      <div class="row">
        <RouterLink to="/cal7">
          <img src="@/assets/icons/week_icon.png" />
          <p>Tydzień</p>
        </RouterLink>
      </div>
      <div class="row">
        <RouterLink to="/cal30">
        <img src="@/assets/icons/month_icon.png" />
        <p>Miesiąc</p>
      </RouterLink>
      </div>
    </div>

    <div class="switches">
      <p class="label-text">Wyświetl w kalendarzu</p>
      <div class="row">
        <input type="checkbox" id="switch1" style="display: none" :checked="OptionsStore.Weather" @click="() => {OptionsStore.Weather = !OptionsStore.Weather}"/><label
          for="switch1"
          class="toggle"
          >Toggle</label
        >
        <p>Pogoda</p>
      </div>
      <div class="row">
        <input type="checkbox" id="switch2" style="display: none" :checked="OptionsStore.Holidays" @click="() => {OptionsStore.Holidays = !OptionsStore.Holidays}"/><label
          for="switch2"
          class="toggle"
          >Toggle</label
        >
        <p>Święta</p>
      </div>
    </div>

    <div class="logout">
      <Button title="Wyloguj się" @click="logout"/>
    </div>

    <!-- <div id="rectangle1"></div>
    <div id="rectangle2"></div> -->
  </nav>
</template>

<style scoped src="@/assets/css/drawerMenu.css"></style>
