import { createApp, computed } from 'vue'
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

library.add(faSun, faArrowLeftLong, faArrowRightLong, faChevronLeft, faChevronRight, faSquare, faPlusCircle)
app.component('font-awesome-icon', FontAwesomeIcon)


const LoggedIn = useLoggedStore(pinia);
if(isLocalStorageAvailable()){
    if(localStorage.getItem('APIKey') !== null){
        LoggedIn.APIKey = localStorage.getItem('APIKey')
        LoggedIn.isLoggedIn = true;
    } 
}



router.beforeEach((to, from, next) => {
    const Logged = useLoggedStore(pinia);
    const isLoggedIn  = computed(() => Logged.isLoggedIn);
    console.log('dziala');
    if(isLoggedIn.value && to.matched.some(record => record.path == '/login')){
        console.log('tu');
        next('/');
    }
    else{
        console.log('tutaj');
        console.log(isLoggedIn.value);
        if (to.matched.some(record => record.meta.requiresAuth)) {
            if (!isLoggedIn.value) {
                console.log('tutaj2');
                next({ name: 'Login' })
            } else {
                console.log('tutaj3');
                next();
            }
        } else {
            console.log('tutaj4');
            next()
        }
    }

})



app.mount('#app')



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