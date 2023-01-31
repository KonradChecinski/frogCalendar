import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/LoginView.vue'
import ProjectView from '@/views/ProjectView.vue'
import RegisterView from '@/views/RegisterView.vue'

import Calendar1View from '@/views/Calendar1View.vue'
import Calendar7View from '@/views/Calendar7View.vue'
import Calendar30View from '@/views/Calendar30View.vue'
import WeatherDetails from '@/components/Modal/WeatherDetails.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => ProjectView,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/cal30',
            name: 'Kalendarz30',
            component: () => Calendar30View,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/cal7',
            name: 'Kalendarz7',
            component: () => Calendar7View,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/cal1',
            name: 'Kalendarz1',
            component: () => WeatherDetails,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/login',
            name: 'Login',
            component: LoginView,
            meta: {
                requiresAuth: false,
            }
        },
        {
            path: '/register',
            name: 'Register',
            component: RegisterView,
            meta: {
                requiresAuth: false,
            }
        },

    ]
})


export default router
