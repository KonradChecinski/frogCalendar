import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useLoggedStore = defineStore('loggedIn', () => {
  const isLoggedIn = ref(false);
  const APIKey = ref();

  watch(APIKey, ()=>{
    if (isLocalStorageAvailable()) {
      localStorage.setItem('APIKey', APIKey.value)
    }
    console.log('change');
  })

  return { isLoggedIn, APIKey }
})



function isLocalStorageAvailable(){
  var test = 'test';
  try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
  } catch(e) {
      return false;
  }
}