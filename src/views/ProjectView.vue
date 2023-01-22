<script setup lang="ts">
import CalendarMonth from "@/components/Calendar/CalendarMonth.vue";
import CalendarWeek from "@/components/Calendar/CalendarWeek.vue";
import drawerMenu from "@/components/drawerMenu.vue";
import { usefetch } from "@/stores/fetch";
import { createPinia } from "pinia";

const pinia = createPinia();
const getDate = usefetch(pinia);
</script>

<template>
  <div class="app-views-container">
    <CalendarMonth />
    <!-- <CalendarWeek>
      Kalendarz2tyg
    </CalendarWeek> -->
    <drawerMenu />
  </div>
</template>

<style scoped src="@/assets/css/projectView.css"></style>
