<template>
    <div @click="modal.close()">
      <div v-if="isOpen" class="modal modal-open">
        <div class="modal-box relative">
          <label
            class="btn btn-sm btn-circle absolute right-2 top-2"
            @click="modal.close()"
            >✕</label
          >
  
          <component :is="view" v-model="model"></component>
          
          <div class="modal-action">
            <button
              v-for="action in actions"
              class="btn"
              @click="action.callback(model)"
            >
              {{ action.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
    import { reactive } from "vue";
    import { storeToRefs } from "pinia";
    import { useModal } from "@/stores/modal";
  
    const modal = useModal();
  
    // reactive container to save the payload returned by the mounted view
    const model = reactive({});
  
    // convert all state properties to reactive references to be used on view
    const { isOpen, view, actions } = storeToRefs(modal);
  </script>

<style>
.modal{
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
}
.modal-box{
    width: 80%;
    height: 80%;
    background-color: #181818;
    border: 1px solid rgba(84,84,84,0.48);
    border-radius: 8px;
}
.modal-box label{
    position: absolute;
    right: 2%;
    top: 2%;
    width: 30px;
    height: 30px;
    background-color: #252525;
    padding: 5px;
    border-radius: 8px;
    border: 1px solid rgba(84,84,84,0.48);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}
/* .item{
    width: 100%;
    height: 100%;
} */

</style>