import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Editor from '../views/Editor.vue'
import Share from '../views/Share.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/editor',
            name: 'editor',
            component: Editor
        },
        {
            path: '/share/:id',
            name: 'share',
            component: Share
        },
        {
            path: '/editor/:id?',
            name: 'Editor',
            component: () => import('../views/Editor.vue')
        }
    ]
})

export default router 