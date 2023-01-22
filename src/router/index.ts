import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/LoginView.vue'
import ProjectView from '@/views/ProjectView.vue'
import RegisterView from '@/views/RegisterView.vue'

import Calendar1ViewVue from '@/views/Calendar1View.vue'
import Calendar7ViewVue from '@/views/Calendar7View.vue'
import Calendar30ViewVue from '@/views/Calendar30View.vue'

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
            component: () => Calendar30ViewVue,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/cal7',
            name: 'Kalendarz7',
            component: () => Calendar7ViewVue,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/cal1',
            name: 'Kalendarz1',
            component: () => Calendar1ViewVue,
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
