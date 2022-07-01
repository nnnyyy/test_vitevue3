<script setup lang="ts">
defineProps({ msg: String })
const emit = defineEmits<{
  (e:"emitTest", id: string): void
}>()
const action = ()=> {
  emit("emitTest", 'game')
}
</script>

<template>
  <h1>{{ msg }}</h1>
  <button @click="action">테스트 버튼</button>
</template>

<style scoped>
</style>
