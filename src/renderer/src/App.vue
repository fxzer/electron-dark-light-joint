<!-- Home.vue -->
<script setup>
import { ref } from 'vue'
import domtoimage from 'dom-to-image'
const leftImage = ref('')
const rightImage = ref('')
const position = ref('left')
const ratio = ref(192 / 108)
const width = ref(360)
const height = ref(width.value / ratio.value)
async function getRatio(src) {
  const img = new Image()
  img.src = src
  img.onload = function () {
    ratio.value = img.width / img.height
  }
}
async function handleCutScreen(pos) {
  position.value = pos
  await electron.ipcRenderer.send('OPEN_CUT_SCREEN')
  // 接受主进程传来的截图
  electron.ipcRenderer.on('captureScreenBack', (event, source) => {
    if (position.value === 'left') {
      leftImage.value = source
      getRatio(source)
      height.value = (width.value / ratio.value).toFixed(2) * 1
    } else {
      rightImage.value = source
    }
  })
}
const conbimeImageRef = ref()

function handleSave() {
  domtoimage
    .toSvg(conbimeImageRef.value)
    .then(function (dataUrl) {
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = '测试图片.svg'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
    .catch(function (error) {
      console.error('oops, something went wrong!', error)
    })
}
</script>

<template>
  <div class="container">
    <div
      class="left"
      :style="{ backgroundImage: `url(${leftImage})` }"
      @click="handleCutScreen('left')"
    >
      <span class="icon">📷</span>
    </div>
    <div class="op">+</div>
    <div
      class="right"
      :style="{ backgroundImage: `url(${rightImage})` }"
      @click="handleCutScreen('right')"
    >
      <span class="icon">📷</span>
    </div>
    <div class="op">=</div>
    <div class="wrap">
      <span class="icon download-btn" @click="handleSave">⬇️</span>
      <div ref="conbimeImageRef" class="conbine-box" @click="handleSave">
        <div class="left-part" :style="{ backgroundImage: `url(${leftImage})` }"></div>
        <div class="right-part" :style="{ backgroundImage: `url(${rightImage})` }"></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
* {
  margin: 0;
  padding: 0;
  padding: 0;
  box-sizing: border-box;
}
.container {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left,
.right,
.wrap {
  border: 1px solid #cccccc90;
  overflow: hidden;
  position: relative;
}
.left,
.right,
.conbine-box {
  width: v-bind(width + 'px');
  height: v-bind(height + 'px');
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  color: #ccc;
  font-size: 40px;
  background-size: 100%;
  background-repeat: no-repeat;
}
.left-part,
.right-part {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  background-size: 100%;
  background-repeat: no-repeat;
}

.left-part {
  clip-path: polygon(0 0, 100% 0, 0 100%, 0 0);
}

.right-part {
  clip-path: polygon(100% 0, 100% 100%, 0 100%, 100% 0);
}
.icon {
  display: none;
  z-index: 99;
}
.op {
  color: #c1c1c1;
  font-size: 40px;
}
div:hover > .icon {
  display: inline;
}
.download-btn {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 36px;
  cursor: pointer;
}
</style>
