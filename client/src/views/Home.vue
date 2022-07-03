<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import {ref, reactive, computed, onBeforeMount} from 'vue'
import HelloWorld from '../components/HelloWorld.vue'
import axios from '../plugins/axios'
const count = ref(0)
let resources = reactive({itemlist: []})
const isProcessing = ref(false)
const plusOne = computed(()=>count.value * 2)
const emitTest = (arg:any)=> {
  console.log(arg)
}

onBeforeMount(async () => {
  try {
    isProcessing.value = true
    const ret = await axios.post('/api/test')
    resources.itemlist = ret.data.list
  }catch(e) {
    console.log(e)
  }finally {
    isProcessing.value = false
  }
})

</script>

<template>
  <HelloWorld msg="test" v-on:emit-test="emitTest" />
  <div v-for="it in resources.itemlist">{{it}}</div>
  <button @click="count++">{{count}} => {{plusOne}}</button>
</template>

<style>
</style>
