<script setup lang="ts">
import {onMounted, ref, reactive} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {MenuMan, IMenuItemD3, IMenuItemD4} from '../menu'
import {useEmitter} from '../plugins/emitter'
const showLv4 = ref(false)
const emitter = useEmitter()
const route = useRoute()
const router = useRouter()

const state = reactive({menuLv3: [] as (IMenuItemD3[] | undefined), menuLv4: [] as (IMenuItemD4[] | undefined) , menuLv4MouseOver: [] as (IMenuItemD4[] | undefined), lv3MouseOver: undefined as (IMenuItemD3 | undefined )})
onMounted(() => {    
    state.menuLv3 = MenuMan.getLv3(route.path)
    state.menuLv4 = MenuMan.getLv4(route.path)
    emitter.on('menu-refresh', ()=> {
        state.menuLv3 = MenuMan.getLv3(route.path)
        state.menuLv4 = MenuMan.getLv4(route.path)        
    })
})

const showLv4List = (key:string)=> {
    const lv3 = MenuMan.getLv3(route.path)
    if( !lv3 ) return []
    const finded = lv3.find(m3=>m3.key==key)
    state.lv3MouseOver = finded
    state.menuLv4MouseOver = finded?.children
    showLv4.value = true
}

const onBtnGoLv3 = () => {
    const p = route.path.split("/");
    p.shift();
    const parent = p.length == 3 ? `/${p[0]}` : `/${p[0]}/${p[1]}`
    const keyLv4 = state.lv3MouseOver?.children[0].key
    router.push(`${parent}/${state.lv3MouseOver?.key}/${keyLv4}`).then(()=>{
        emitter.emit('menu-refresh')
    })

    showLv4.value = false
}

const onBtnGoLv4 = (key:string, isOver:boolean)=>{    
    const p = route.path.split("/");
    p.shift();
    const parent = p.length == 3 ? `/${p[0]}` : `/${p[0]}/${p[1]}`
    const lv3Key = p.length == 3 ? p[1] : p[2]
    const current = state.menuLv3?.find(m3=>m3.key==lv3Key)
    router.push(`${parent}/${isOver ? state.lv3MouseOver?.key : current?.key}/${key}`).then(()=>{
        emitter.emit('menu-refresh')
    })

    showLv4.value = false
}

const isSelected = (key:string, lv:number)=>{
    if( showLv4.value ) return false
    const p = route.path.split("/");
    p.shift();
    const lv3Key = p.length == 3 ? p[1] : p[2]
    const lv4Key = p.length == 3 ? p[2] : p[3]
    if( lv == 3 && lv3Key == key ) return true
    if( lv == 4 && lv4Key == key ) return true
    return false
}
</script>

<template>
<div class="d-flex" style="height: 100%;">
    <div v-if="state.menuLv3" style="width: 180px; padding: 10px 20px;border-right: 1px solid #CCCCCC;">
        <nav>
            <div v-for="it in state.menuLv3" style="height: 46px;" @mouseover="showLv4List(it.key)" @click="onBtnGoLv3" class="menu-item" :class="[isSelected(it.key, 3)?'selected':'', ( showLv4 && state.lv3MouseOver?.key == it.key ) ? 'over' : '']">{{it.name}}</div>
        </nav>
    </div>
    <div style="position:relative; width: 180px; padding: 10px 20px;border-right: 1px solid #CCCCCC;">
        <nav>
            <div v-for="it in state.menuLv4" style="height: 46px;" class="menu-item" :class="[isSelected(it.key, 4)?'selected':'']" @click="onBtnGoLv4(it.key, false)">{{it.name}}</div>     
        </nav>
        <div v-show="showLv4" style="position:absolute; top: 0; left: 0; width: 180px; height: 100%; padding: 10px 20px; border-right: 1px solid #CCCCCC; background-color: gray;" @mouseleave="showLv4=false;">
            <nav>
                <div v-for="it in state.menuLv4MouseOver" style="height: 46px;" @click="onBtnGoLv4(it.key, true)">{{it.name}}</div>     
            </nav>
        </div>
    </div>
    <div style="padding: 20px;"><router-view/></div>
</div>
</template>

<style scoped>
.menu-item.selected { background-color: red; }
.menu-item.over { background-color: blue; }
</style>
