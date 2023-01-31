<script setup lang="ts"></script>

<template>
  <div class="weather-details-container">
    <img class="x-icon" alt="exit icon" src="@/assets/icons/x_icon.png" />

    <div class="info-header">
      <p class="weather-details-text">Szczegóły pogody</p>
      <p class="date">31.01.2023</p>
    </div>

    <div class="info-weather-container">
      <img
        class="weather-icon"
        alt="weather icon"
        src="@/assets/icons/weather/1000.svg"
      />
      <div class="info-weather">
        <p class="weather-info-text">ZACHMURZENIE</p>
        <p>24%</p>
        <p class="weather-info-text">OPADY DESZCZU</p>
        <p>12%</p>
        <p class="weather-info-text">OPADY ŚNIEGU</p>
        <p>54%</p>
        <p class="weather-info-text">TEMPERATURA</p>
        <p class="temp">10°/<span style="color: #0c9ed5">-2°</span></p>
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
          <p>6:14</p>
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
          <p>16:15</p>
        </div>
      </div>
    </div>

    <div class="moon-phase-container">
      <img src="@/assets/icons/moon.png" alt="moon" class="moon-icon" />
      <div class="sunrise-info">
        <p class="weather-info-text">FAZA KSIĘŻYCA</p>
        <p>PEŁNIA</p>
      </div>
    </div>
  </div>
</template>

<style scoped src="@/assets/css/weatherDetails.css"></style>
