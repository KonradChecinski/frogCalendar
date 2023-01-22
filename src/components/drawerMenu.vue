<script setup lang="ts">
import Button from "./Button.vue";
</script>

<template>
  <input type="checkbox" id="drawer-toggle" name="drawer-toggle" />
  <label for="drawer-toggle" id="drawer-toggle-label"></label>
  <header></header>
  <nav id="drawer">
    <div class="user-info">
      <p class="uname">Nazwa użytkownika</p>
      <p class="email">email@gmail.com</p>
    </div>

    <div class="navigation">
      <p class="label-text">Widok</p>
      <div class="row">
        <img src="@/assets/icons/day_icon.png" />
        <p>Dzień</p>
      </div>
      <div class="row">
        <img src="@/assets/icons/week_icon.png" />
        <p>Tydzień</p>
      </div>
      <div class="row">
        <img src="@/assets/icons/month_icon.png" />
        <p>Miesiąc</p>
      </div>
    </div>

    <div class="switches">
      <p class="label-text">Wyświetl w kalendarzu</p>
      <div class="row">
        <input type="checkbox" id="switch1" style="display: none" /><label
          for="switch1"
          class="toggle"
          >Toggle</label
        >
        <p>Pogoda</p>
      </div>
      <div class="row">
        <input type="checkbox" id="switch2" style="display: none" /><label
          for="switch2"
          class="toggle"
          >Toggle</label
        >
        <p>Święta</p>
      </div>
    </div>

    <div class="logout">
      <Button title="Wyloguj się" />
    </div>

    <!-- <div id="rectangle1"></div>
    <div id="rectangle2"></div> -->
  </nav>
</template>

<style scoped src="@/assets/css/drawerMenu.css"></style>
