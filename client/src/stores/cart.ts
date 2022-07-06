import {ref, computed} from 'vue'
import { defineStore } from 'pinia'

export const useCart = defineStore("cart", ()=> {
    const cartlist = ref([] as any[])

    const addToCart = (item:any)=>{
        cartlist.value.push(item)
    }

    const getList = computed(()=>{ return cartlist.value })

    return { cartlist, addToCart, getList };
})