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
<div>사이드 바</div>
</template>

<style lang="scss" scoped></style>
