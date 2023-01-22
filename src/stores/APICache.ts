import { ref, computed, watch, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useAPICacheStore = defineStore('APICache', () => {
  const Weather = {};
  const Holidays = {};

  return { Weather, Holidays }
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