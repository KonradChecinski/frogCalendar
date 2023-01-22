import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useLoggedStore = defineStore('counter', () => {
  const isLoggedIn = true;

  return { isLoggedIn }
})
