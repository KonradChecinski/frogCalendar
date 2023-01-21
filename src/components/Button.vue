<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <button class="button" role="button">{{ title }}</button>
</template>

<style scoped src="@/assets/css/button.css"></style>
