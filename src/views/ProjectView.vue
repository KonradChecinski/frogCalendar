<script setup lang="ts">
import CalendarMonth from '@/components/Calendar/CalendarMonth.vue';
import CalendarWeek from '@/components/Calendar/CalendarWeek.vue';
</script>

<template>
  <div class="calendar30">
    <CalendarMonth>
      Kalendarz30
    </CalendarMonth>
    <!-- <CalendarWeek>
      Kalendarz2tyg
    </CalendarWeek> -->
  </div>
</template>


<style scoped>
.calendar30{
  display: flex;
  flex-direction: column;
  flex:1
}

</style>