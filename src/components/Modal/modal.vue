<template>
  <!-- <div class="background" @click="modal.close()"></div> -->
      <div v-if="isOpen" class="modal modal-open" ref="componentRef">
        <div class="modal-box relative">
          <!-- <label
            class="btn btn-sm btn-circle absolute right-2 top-2"
            @click="modal.close()"
            >✕</label> -->
          <!-- <div>{{ modal.date?.getDate() + '.' + modal.date?.getMonth() + '.' + modal.date?.getFullYear() }}</div> -->
          <component :is="view" v-model="model" :date="modal.date" :edit="modal.edit" @closeClick="closeModal"></component>
          
          <!-- <div class="modal-action">
            <button
              v-for="action in actions"
              class="btn"
              @click="action.callback(model)"
            >
              {{ action.label }}
            </button>
          </div> -->
        </div>
      </div>
  </template>
  
  <script lang="ts" setup>
    import { reactive, onBeforeUnmount, onMounted, ref } from "vue";
    import { storeToRefs } from "pinia";
    import { useModal } from "@/stores/modal";


    

    let is=0;
    const modal = useModal();
  
    // reactive container to save the payload returned by the mounted view
    // const model = reactive({});
  
    // convert all state properties to reactive references to be used on view
    const { isOpen, view, actions } = storeToRefs(modal);

    const componentRef = ref();


function useDetectOutsideClick(component:any, callback:any) {
    if (!component) return
    const listener = (event:any) => {
        if (event.target !== component.value && event.composedPath().includes(component.value)) {
            return
        }
        if (typeof callback === 'function') {
            callback()
        }
    }
    onMounted(() => { window.addEventListener('click', listener); is=0 })
    onBeforeUnmount(() => {window.removeEventListener('click', listener); is=0})

    return {listener}
}


useDetectOutsideClick(componentRef, () => { 
  if(isOpen.value){
    if(is>0){
      modal.close();
      is=0;
    }
    else is++;
  } 
})

function closeModal(){
  modal.close();
  is=0;
}
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
  z-index: 999;
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
/* .background{
  z-index: 998;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
} */

</style>