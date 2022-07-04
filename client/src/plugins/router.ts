import {createWebHistory, createRouter} from 'vue-router'
import {MenuMan} from '../menu'

const routes = [    
    ...MenuMan.makeRoutes()
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;