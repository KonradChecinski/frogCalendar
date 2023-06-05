<script setup lang="ts">
import { reactive, watch } from "vue";
import { useFetchStore } from "@/stores/fetch";
const FetchStore = useFetchStore();

const emit = defineEmits(["closeClick"]);

const props = defineProps<{
  date: Date;
  edit: Boolean;
  calendarEvent: any;
}>();
const loading = reactive({
  loading: false,
});
const state = reactive({
  edit: props.edit,

  taskId: 0,
  taskName: "",
  taskDescription: "",
  taskDate: "",
  taskTimeFrom: "",
  taskTimeTo: "",
  taskColor: "",
  fullDay: false,
});
if (props.calendarEvent) {
  state.taskId = props.calendarEvent.id;
  state.taskName = props.calendarEvent.name;
  state.taskDescription = props.calendarEvent.description;
  state.taskDate = props.calendarEvent.date;
  state.taskTimeFrom = props.calendarEvent.startTime?.slice(0, -3);
  state.taskTimeTo = props.calendarEvent.endTime?.slice(0, -3);
  state.taskColor = "#" + props.calendarEvent.color;

  state.fullDay =
    !props.calendarEvent.endTime && !props.calendarEvent.startTime;
} else {
  state.taskDate =
    props.date.getFullYear() +
    "-" +
    ("0" + (props.date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + props.date.getDate()).slice(-2);
}

function getTaskHours() {
  if (!state.fullDay) return `${state.taskTimeFrom} - ${state.taskTimeTo}`;
  return `cały dzień`;
}

// FETCH

function deleteEvent(eventId: number) {
  FetchStore.fetchDataFromFrogAPI(`/event/${eventId}`, "DELETE").then(
    (value: any) => {
      loading.loading = true;
      FetchStore.getEventsWithoutHesitate().then((result: any) => {
        emit("closeClick");
      });
    },
    (error) => {
      let result: any = error;
      result.then((res: any) => {
        console.log(res);
      });
    }
  );
}

function addOrEditEvent() {
  let body: any = {
    name: state.taskName,
    description: state.taskDescription,
    color: state.taskColor.slice(1),
    date: state.taskDate,
  };

  if (!state.fullDay) {
    body["startTime"] = state.taskTimeFrom;
    body["endTime"] = state.taskTimeTo;
  }

  if (state.taskId == 0) {
    FetchStore.fetchDataFromFrogAPI(`/event`, "POST", body).then(
      (value: any) => {
        loading.loading = true;
        FetchStore.getEventsWithoutHesitate().then((result: any) => {
          emit("closeClick");
        });
      },
      (error) => {
        let result: any = error;
        result.then((res: any) => {
          console.log(res);
        });
      }
    );
  } else {
    FetchStore.fetchDataFromFrogAPI(`/event/${state.taskId}`, "PUT", body).then(
      (value: any) => {
        loading.loading = true;
        FetchStore.getEventsWithoutHesitate().then((result: any) => {
          emit("closeClick");
        });
      },
      (error) => {
        let result: any = error;
        result.then((res: any) => {
          console.log(res);
        });
      }
    );
  }
}
</script>

<template>
  <div class="lds-dual-ring loading" v-if="loading.loading"></div>
  <div class="task-container">
    <div class="header">
      <img
        class="x-icon"
        alt="exit icon"
        src="@/assets/icons/x_icon.png"
        @click="$emit('closeClick')"
      />
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
          @click="deleteEvent(state.taskId)"
        />
      </div>
      <button
        class="save-button"
        @click="
          () => {
            state.edit = false;
            addOrEditEvent();
          }
        "
        v-else
      >
        <p style="color: black; font-weight: bold">Zapisz</p>
      </button>
    </div>

    <div class="task-info" v-if="!state.edit">
      <div
        class="task-rectangle"
        :style="{ backgroundColor: state.taskColor }"
      ></div>
      <div class="task-info-text-container">
        <p class="task-info-text">{{ state.taskName }}</p>
        <p>{{ state.taskDate }}</p>
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
        <p v-if="!state.edit">{{ getTaskHours() }}</p>
        <div v-else class="switch-container">
          <p>cały dzień</p>
          <input
            type="checkbox"
            id="switch1"
            style="display: none"
            v-model="state.fullDay"
          />

          <div
            for="switch1"
            class="toggle switch"
            tabindex="5"
            :class="{ checked: state.fullDay }"
            @click="state.fullDay = !state.fullDay"
          >
            Toggle
          </div>
        </div>
      </div>
    </div>
    <div v-if="state.edit && !state.fullDay" class="time-info-range">
      <div class="time-from">
        <p>od</p>
        <input
          class="time-input-from"
          type="time"
          name="taskTime"
          required
          v-model="state.taskTimeFrom"
        />
      </div>
      <div class="time-to">
        <p>do</p>
        <input
          class="time-input-to"
          type="time"
          name="taskTime"
          required
          v-model="state.taskTimeTo"
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
