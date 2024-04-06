<template>
  <div ref="container" class="container" >cut</div>
</template>
<script setup>
// import { ipcRenderer } from 'electron'
// import { ref, onMounted } from 'vue'
// const container = ref(null)
// const bg = ref('')

// onMounted(() => {
//   ipcRenderer.send('SHOW_CUT_SCREEN')
//   ipcRenderer.off('GET_SCREEN_IMAGE', getSource)
//   ipcRenderer.on('GET_SCREEN_IMAGE', getSource)
// })

// async function getSource(event, source) {
//   const { thumbnail } = source
//   bg.value = await thumbnail.toDataURL()
//   render() // 绘制渲染canvas舞台等任务
// }
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: transparent;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
