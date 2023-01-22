import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import VueAxios from 'vue-axios'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSun, faArrowLeftLong, faArrowRightLong, faChevronLeft, faChevronRight, faSquare, faPlusCircle } from '@fortawesome/free-solid-svg-icons'


import App from './App.vue'
import router from './router'
import { useLoggedStore } from './stores/LoggedIn'

import './assets/css/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.use(VueAxios, axios)
app.provide('axios', app.config.globalProperties.axios)


library.add(faSun, faArrowLeftLong, faArrowRightLong, faChevronLeft, faChevronRight)

app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')




router.beforeEach((to, from, next) => {
    const logged = useLoggedStore(pinia)

    if(logged.isLoggedIn && to.matched.some(record => record.path == '/login')){
        next('/');
    }
    else{
        if (to.matched.some(record => record.meta.requiresAuth)) {
            if (!logged.isLoggedIn) {
                next({ name: 'Login' })
            } else {
                next();
            }
        } else {
            next()
        }
    }

})