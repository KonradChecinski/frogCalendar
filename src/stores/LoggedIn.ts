import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useLoggedStore = defineStore('loggedIn', () => {
  const isLoggedIn = ref(false);
  const APIKey = ref();

  const username = ref();
  const email = ref();

  watch(APIKey, ()=>{
    if (isLocalStorageAvailable()) {
      localStorage.setItem('APIKey', APIKey.value)
    }
  })
  watch(username, ()=>{
    if (isLocalStorageAvailable()) {
      localStorage.setItem('username', username.value)
    }
  })
  watch(email, ()=>{
    if (isLocalStorageAvailable()) {
      localStorage.setItem('email', email.value)
    }
  })
  return { isLoggedIn, APIKey, username, email }
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