import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/LoginView.vue'
import ProjectView from '@/views/ProjectView.vue'
import RegisterView from '@/views/RegisterView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => ProjectView,
            meta: {
                requiresAuth: true
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




        // {
        //   path: '/',
        //   name: 'home',
        //   component: HomeView
        // },
        // {
        //   path: '/about',
        //   name: 'about',
        //   // route level code-splitting
        //   // this generates a separate chunk (About.[hash].js) for this route
        //   // which is lazy-loaded when the route is visited.
        //   component: () => import('../views/AboutView.vue')
        // }
    ]
})


export default router
