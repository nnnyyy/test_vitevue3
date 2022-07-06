<script setup lang="ts">
import {onMounted, reactive} from 'vue'
import {useRoute} from 'vue-router'
import {MenuMan, IMenuItemD3, IMenuItemD4} from '../menu'
import {useEmitter} from '../plugins/emitter'
const emitter = useEmitter()

const state = reactive({menuLv3: [] as (IMenuItemD3[] | undefined), menuLv4: [] as (IMenuItemD4[] | undefined)})
onMounted(() => {
    const route = useRoute()
    state.menuLv3 = MenuMan.getLv3(route.path)
    state.menuLv4 = MenuMan.getLv4(route.path)
    emitter.on('menu-refresh', ()=> {
        console.log('menu-refresh', route.path)
        state.menuLv3 = MenuMan.getLv3(route.path)
        state.menuLv4 = MenuMan.getLv4(route.path)        
    })
})
</script>

<template>
<div class="d-flex" style="height: 100%;">
    <div v-if="state.menuLv3" style="width: 180px; padding: 10px 20px;border-right: 1px solid #CCCCCC;">
    <nav>
        <div v-for="it in state.menuLv3" style="height: 46px;">{{it.name}}</div>
    </nav>
    </div>
    <div style="width: 180px; padding: 10px 20px;border-right: 1px solid #CCCCCC;">
    <nav>
        <div v-for="it in state.menuLv4" style="height: 46px;">{{it.name}}</div>     
    </nav>
    </div>
    <div style="padding: 20px;"><router-view/></div>
</div>
</template>

<style>
</style>
