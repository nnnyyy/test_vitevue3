import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router";
import {MenuMan} from '../menu'

const routes = [    
    {path: '/', redirect: '/home'},
    ...MenuMan.makeRoutes()
]

const router = createRouter({
    history: createWebHistory(), routes
})

export default router;