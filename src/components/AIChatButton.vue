<script setup lang="ts">
interface Position {
  x: number
  y: number
}

const emit = defineEmits<{
  click: []
}>()

const buttonRef = ref<HTMLElement>()
const position = ref<Position>({ x: 10, y: 40 })
const isDragging = ref(false)
const dragStart = ref<Position>({ x: 0, y: 0 })
const windowSize = ref({ width: 0, height: 0 })
const hasMoved = ref(false) // 添加移动状态标记
const dragThreshold = 5 // 拖拽阈值，小于此距离认为是点击

const buttonStyle = computed(() => ({
  // transform: `translate(${position.value.x}px, ${position.value.y}px)`,
  top: `${position.value.y}px`,
  left: `${position.value.x}px`,
}))

function updateWindowSize() {
  windowSize.value = {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

function handleTouchStart(e: TouchEvent) {
  const touch = e.touches[0]
  dragStart.value = {
    x: touch.clientX - position.value.x,
    y: touch.clientY - position.value.y,
  }
  isDragging.value = true
  hasMoved.value = false
}

function handleTouchMove(e: TouchEvent) {
  if (!isDragging.value)
    return
  e.preventDefault()
  const touch = e.touches[0]
  const newX = touch.clientX - dragStart.value.x
  const newY = touch.clientY - dragStart.value.y

  // 检查是否移动超过阈值
  const moveDistance = Math.sqrt(
    (touch.clientX - (dragStart.value.x + position.value.x)) ** 2
    + (touch.clientY - (dragStart.value.y + position.value.y)) ** 2,
  )

  if (moveDistance > dragThreshold) {
    hasMoved.value = true
  }

  position.value = {
    x: Math.max(0, Math.min(newX, windowSize.value.width - 60)),
    y: Math.max(0, Math.min(newY, windowSize.value.height - 60)),
  }
}

function handleTouchEnd() {
  if (isDragging.value && !hasMoved.value) {
    // 如果没有移动，触发点击事件
    handleClick()
  }
  isDragging.value = false
  hasMoved.value = false
}

function handleMouseDown(e: MouseEvent) {
  dragStart.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y,
  }
  isDragging.value = true
  hasMoved.value = false
}

function handleMouseMove(e: MouseEvent) {
  if (!isDragging.value)
    return
  e.preventDefault()
  const newX = e.clientX - dragStart.value.x
  const newY = e.clientY - dragStart.value.y

  // 检查是否移动超过阈值
  const moveDistance = Math.sqrt(
    (e.clientX - (dragStart.value.x + position.value.x)) ** 2
    + (e.clientY - (dragStart.value.y + position.value.y)) ** 2,
  )

  if (moveDistance > dragThreshold) {
    hasMoved.value = true
  }

  position.value = {
    x: Math.max(0, Math.min(newX, windowSize.value.width - 60)),
    y: Math.max(0, Math.min(newY, windowSize.value.height - 60)),
  }
}

function handleMouseUp() {
  if (isDragging.value && !hasMoved.value) {
    // 如果没有移动，触发点击事件
    handleClick()
  }
  isDragging.value = false
  hasMoved.value = false
}

function handleClick() {
  emit('click')
}

onMounted(() => {
  updateWindowSize()
  window.addEventListener('resize', updateWindowSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowSize)
})
</script>

<template>
  <div
    ref="buttonRef"
    class="ai-chat-button opacity-60 focus:opacity-100 hover:opacity-100"
    :style="buttonStyle"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
  >
    <div class="ai-chat-button-inner">
      <i class="i-carbon:ibm-consulting-advantage-assistant" />
    </div>
  </div>
</template>

<style scoped>
.ai-chat-button {
  position: fixed;
  z-index: 1000;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.ai-chat-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
}

.ai-chat-button:active {
  transform: scale(0.95);
}

.ai-chat-button-inner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.ai-chat-button-inner svg {
  width: 20px;
  height: 20px;
}
</style>
