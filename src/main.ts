import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSun, faArrowLeftLong, faArrowRightLong, faChevronLeft, faChevronRight, faSquare, faPlusCircle, faPlus } from '@fortawesome/free-solid-svg-icons'


import App from './App.vue'
import router from './router'

import { useLoggedStore } from './stores/LoggedIn'
import { useFetchStore } from './stores/fetch'

import './assets/css/main.css'

const app = createApp(App)

const pinia = createPinia();
const getDate = useFetchStore(pinia);
const LoggedIn = useLoggedStore(pinia);


app.use(pinia)
app.use(router)
app.provide('axios', app.config.globalProperties.axios)

library.add(faSun, faArrowLeftLong, faArrowRightLong, faChevronLeft, faChevronRight, faSquare, faPlusCircle, faPlus)
app.component('font-awesome-icon', FontAwesomeIcon)



app.mount('#app')


