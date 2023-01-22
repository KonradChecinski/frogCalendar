<script setup lang="ts">
import CalendarMonth from "@/components/Calendar/CalendarMonth.vue";
import CalendarWeek from "@/components/Calendar/CalendarWeek.vue";
</script>

<template>
  <div class="app-views-container">
    <CalendarMonth />
    <!-- <CalendarWeek>
      Kalendarz2tyg
    </CalendarWeek> -->
  </div>
</template>

<style scoped>
.app-views-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
