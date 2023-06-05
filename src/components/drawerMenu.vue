<script setup lang="ts">
import router from "@/router";
import { useFetchStore } from "@/stores/fetch";
import { useLoggedStore } from "@/stores/LoggedIn";
import { useOptionsStore } from "@/stores/Options";
import { ref, type Ref } from "vue";
import Button from "./Button.vue";

const drawerToggle: any = ref(null);
const importText: Ref<string> = ref("Wybierz plik .ics");
const showImportButton: Ref<boolean> = ref(false);
const isLoading: Ref<boolean> = ref(false);

let file: any;
let fileName: any = file?.name ?? "Wybierz plik .ics";

const LoggedStore = useLoggedStore();
const FetchStore = useFetchStore();
const OptionsStore = useOptionsStore();

if (isLocalStorageAvailable()) {
  OptionsStore.Weather =
    localStorage.getItem("option.weather") == "true" ? true : false;
  OptionsStore.Holidays =
    localStorage.getItem("option.holidays") == "true" ? true : false;
  OptionsStore.Events =
    localStorage.getItem("option.events") == "true" ? true : false;
}

function logout(e: any) {
  e.preventDefault();

  LoggedStore.username = null;
  LoggedStore.email = null;
  LoggedStore.isLoggedIn = false;

  localStorage.removeItem("APIKey");

  router.replace("/login");
}

function isLocalStorageAvailable() {
  var test = "test";
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

function closeDrawer() {
  drawerToggle.value.checked = false;
}

const handleFileSelect = (event: any) => {
  file = event.target.files[0];
  fileName = file?.name ?? "Wybierz plik .ics";
  importText.value = fileName;
  showImportButton.value = file?.name ? true : false;
};

const handleFileSend = async () => {
  isLoading.value = true;

  const formData = new FormData();
  formData.append("file", file);

  const response = await FetchStore.fetchDataImportFile("/import", formData);

  FetchStore.getEventsWithoutHesitate();
  isLoading.value = false;
  importText.value = "Wybierz plik .ics";
  file = null;
  showImportButton.value = false;
};
</script>

<template>
  <input
    type="checkbox"
    id="drawer-toggle"
    name="drawer-toggle"
    ref="drawerToggle"
  />
  <label for="drawer-toggle" id="drawer-toggle-label"></label>
  <header></header>
  <div class="background" @click="closeDrawer"></div>
  <nav id="drawer">
    <div class="user-info">
      <p class="uname">{{ LoggedStore.username }}</p>
      <p class="email">{{ LoggedStore.email }}</p>
    </div>

    <div class="navigation">
      <p class="label-text">Widok</p>
      <div class="row">
        <RouterLink to="/cal1" @click="closeDrawer()">
          <img src="@/assets/icons/day_icon.png" />
          <p>Dzień</p>
        </RouterLink>
      </div>
      <div class="row">
        <RouterLink to="/cal7" @click="closeDrawer()">
          <img src="@/assets/icons/week_icon.png" />
          <p>Tydzień</p>
        </RouterLink>
      </div>
      <div class="row">
        <RouterLink to="/cal30" @click="closeDrawer()">
          <img src="@/assets/icons/month_icon.png" />
          <p>Miesiąc</p>
        </RouterLink>
      </div>
    </div>

    <div class="switches">
      <p class="label-text">Wyświetl w kalendarzu</p>
      <div class="row">
        <input
          type="checkbox"
          id="switch1"
          style="display: none"
          :checked="OptionsStore.Weather"
          @click="
            () => {
              OptionsStore.Weather = !OptionsStore.Weather;
            }
          "
        /><label for="switch1" class="toggle">Toggle</label>
        <p>Pogoda</p>
      </div>
      <div class="row">
        <input
          type="checkbox"
          id="switch2"
          style="display: none"
          :checked="OptionsStore.Holidays"
          @click="
            () => {
              OptionsStore.Holidays = !OptionsStore.Holidays;
            }
          "
        /><label for="switch2" class="toggle">Toggle</label>
        <p>Święta</p>
      </div>
      <div class="row">
        <input
          type="checkbox"
          id="switch3"
          style="display: none"
          :checked="OptionsStore.Events"
          @click="
            () => {
              OptionsStore.Events = !OptionsStore.Events;
            }
          "
        /><label for="switch3" class="toggle">Toggle</label>
        <p>Wydarzenia</p>
      </div>
    </div>

    <div class="import-container">
      <p class="label-text">Importuj plan zajęć</p>
      <input
        type="file"
        id="file-input"
        @change="handleFileSelect"
        accept=".ics"
        class="hidden"
      />
      <label for="file-input" class="import-button">{{ importText }}</label>

      <button
        v-if="showImportButton"
        class="import-submit"
        @click="handleFileSend"
        v-bind:disabled="isLoading"
      >
        <span v-if="!isLoading">Importuj</span>

        <ul v-else class="wave-menu">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </button>
    </div>

    <div class="logout">
      <Button title="Wyloguj się" @click="logout" />
    </div>

    <!-- <div id="rectangle1"></div>
    <div id="rectangle2"></div> -->
  </nav>
</template>

<style scoped src="@/assets/css/drawerMenu.css"></style>
<style>
.background {
  z-index: 100;
  display: none;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
input:checked ~ .background {
  display: flex;
}
.drawer,
#drawer-toggle,
#drawer-toggle-label,
nav {
  z-index: 102 !important;
}
header {
  z-index: 101 !important;
}
</style>
