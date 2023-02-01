import { markRaw } from "vue";
import { defineStore } from "pinia";

export type Modal = {
  isOpen: boolean,
  view: object,
  actions?: ModalAction[],
  date?: Date,
  edit?: Boolean,
  calendarEvent?: any
};

export type ModalAction = {
//   label: string,
//   callback: (props?: any) => void,
};

export const useModal = defineStore("modal", {
  state: (): Modal => ({
    isOpen: false,
    view: {},
    actions: [],
  }),
  actions: {
    open(view: object, date: Date, edit: Boolean, event?: any, actions?: ModalAction[],) {
      this.isOpen = true;
      this.actions = actions;
      // using markRaw to avoid over performance as reactive is not required
      this.view = markRaw(view);
      this.date = date;
      this.edit = edit;
      this.calendarEvent = event;
    },
    close() {
      this.isOpen = false;
      this.view = {};
      this.actions = [];
    },
  },
});

export default useModal;