<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Props {
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message?: string
  duration?: number
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 3000,
  show: false,
})

const emit = defineEmits<{
  close: []
}>()

const isVisible = ref(props.show)
const isAnimating = ref(false)

// 根据类型获取样式类
const toastClasses = computed(() => {
  const baseClasses = 'z-50 max-w-sm max-w-full p-4 rounded-lg shadow-lg border transition-all duration-300'

  switch (props.type) {
    case 'success':
      return `${baseClasses} bg-green-50 border-green-200 text-green-800`
    case 'error':
      return `${baseClasses} bg-red-50 border-red-200 text-red-800`
    case 'warning':
      return `${baseClasses} bg-yellow-50 border-yellow-200 text-yellow-800`
    case 'info':
    default:
      return `${baseClasses} bg-blue-50 border-blue-200 text-blue-800`
  }
})

// 根据类型获取图标
const iconClasses = computed(() => {
  const baseClasses = 'h-5 w-5 flex-shrink-0'

  switch (props.type) {
    case 'success':
      return `${baseClasses} text-green-600`
    case 'error':
      return `${baseClasses} text-red-600`
    case 'warning':
      return `${baseClasses} text-yellow-600`
    case 'info':
    default:
      return `${baseClasses} text-blue-600`
  }
})

// 获取图标SVG
const iconSvg = computed(() => {
  switch (props.type) {
    case 'success':
      return `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>`
    case 'error':
      return `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>`
    case 'warning':
      return `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>`
    case 'info':
    default:
      return `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>`
  }
})

let timeoutId: NodeJS.Timeout | null = null

// 显示toast
function show() {
  isVisible.value = true
  isAnimating.value = true

  // 自动隐藏
  if (props.duration > 0) {
    timeoutId = setTimeout(() => {
      hide()
    }, props.duration)
  }
}

// 隐藏toast
function hide() {
  isAnimating.value = false
  setTimeout(() => {
    isVisible.value = false
    emit('close')
  }, 300) // 等待动画完成

  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

// 监听show属性变化
watch(() => props.show, (newValue) => {
  if (newValue) {
    show()
  }
  else {
    hide()
  }
})

// 组件挂载时如果show为true则显示
onMounted(() => {
  if (props.show) {
    show()
  }
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})

// 暴露方法给父组件
defineExpose({
  show,
  hide,
})
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="transform translate-x-full opacity-0"
    enter-to-class="transform translate-x-0 opacity-100"
    leave-active-class="transition ease-in duration-300"
    leave-from-class="transform translate-x-0 opacity-100"
    leave-to-class="transform translate-x-full opacity-0"
  >
    <div
      v-if="isVisible"
      :class="toastClasses"
      role="alert"
      aria-live="assertive"
    >
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0" :class="iconClasses" v-html="iconSvg" />
        <div class="min-w-0 flex-1">
          <h3 v-if="title" class="text-sm font-medium">
            {{ title }}
          </h3>
          <p v-if="message" class="mt-1 text-sm">
            {{ message }}
          </p>
        </div>
        <button
          class="flex-shrink-0 rounded-md p-1.5 transition-colors hover:bg-black/10"
          @click="hide"
        >
          <span class="sr-only">关闭</span>
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>
