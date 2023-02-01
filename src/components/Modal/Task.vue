<script setup lang="ts">
import { reactive } from "vue";

const props = defineProps<{
      date: Date
      edit: Boolean
    }>()
const state = reactive({
  edit: props.edit,

  taskName: "",
  taskDescription: "",
  taskDate: props.date.getFullYear() + '-' + ("0" + (props.date.getMonth()+1)).slice(-2) + '-' + ("0" + (props.date.getDate())).slice(-2),
  
  taskTime: "",
  taskColor: "#333333",
});
</script>

<template>
  <div class="task-container">
    <div class="header">
      <img class="x-icon" alt="exit icon" src="@/assets/icons/x_icon.png" @click="$emit('closeClick')"/>
      <div class="edit-div" v-if="!state.edit">
        <button @click="state.edit = true">
          <img
            src="@/assets/icons/edit_pen.png"
            alt="edit pen"
            class="edit-icon"
          />
        </button>
        <img
          src="@/assets/icons/trash.png"
          alt="trash icon"
          class="trash-icon"
        />
      </div>
      <button class="save-button" @click="state.edit = false" v-else>
        <p style="color: black; font-weight: bold">Zapisz</p>
      </button>
    </div>

    <div class="task-info" v-if="!state.edit">
      <div class="task-rectangle" :class="{ color: state.taskColor }"></div>
      <div class="task-info-text-container">
        <p class="task-info-text">{{ state.taskName }}</p>
        <p>{{ state.taskDate }}</p>
        <!-- <p>{{ date.getDate() }}</p> -->
      </div>
    </div>
    <div class="task-name-edit" v-else>
      <input
        class="name-input"
        type="text"
        placeholder="Dodaj nazwę"
        name="taskName"
        required
        v-model="state.taskName"
      />
    </div>

    <div class="info-container">
      <img src="@/assets/icons/description.png" alt="description icon" />
      <div class="description-info">
        <p class="text">OPIS</p>
        <p v-if="!state.edit">{{ state.taskDescription }}</p>
        <input
          v-else
          class="description-input"
          type="text"
          placeholder="Dodaj opis"
          name="taskDescription"
          required
          v-model="state.taskDescription"
        />
      </div>
    </div>

    <div class="date-container" v-if="state.edit">
      <img src="@/assets/icons/calendar.png" alt="calendar icon" />
      <div class="time-info">
        <p class="text">DATA</p>
        <input
          class="date-input"
          type="date"
          name="taskDate"
          required
          v-model="state.taskDate"
        />
      </div>
    </div>

    <div class="time-container">
      <img src="@/assets/icons/clock.png" alt="clock icon" />
      <div class="time-info">
        <p class="text">CZAS</p>
        <p v-if="!state.edit">{{ state.taskTime }}</p>
        <input
          v-else
          class="time-input"
          type="time"
          placeholder="Dodaj czas"
          name="taskTime"
          required
          v-model="state.taskTime"
        />
      </div>
    </div>

    <div class="color-container" v-if="state.edit">
      <img src="@/assets/icons/color.png" alt="color icon" />
      <div class="time-info">
        <p class="text">KOLOR</p>
        <input
          class="color-input"
          type="color"
          placeholder="Dodaj kolor"
          name="taskColor"
          require
          v-model="state.taskColor"
        />
      </div>
    </div>
  </div>
</template>

<style scoped src="@/assets/css/task.css"></style>
