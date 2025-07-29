<script setup lang="ts">
import { ref, provide } from 'vue'
import Toast from './Toast.vue'

interface ToastItem {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
}

const toasts = ref<ToastItem[]>([])

// 生成唯一ID
function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// 添加toast
function addToast(toast: Omit<ToastItem, 'id'>): string {
  const id = generateId()
  const newToast: ToastItem = {
    id,
    ...toast,
  }
  
  toasts.value.push(newToast)
  
  // 自动移除
  if (newToast.duration !== 0) {
    setTimeout(() => {
      removeToast(id)
    }, newToast.duration || 3000)
  }
  
  return id
}

// 移除toast
function removeToast(id: string) {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// 清空所有toast
function clearToasts() {
  toasts.value = []
}

// 提供toast API给子组件
provide('toast', {
  success: (message: string, title?: string, duration?: number) => 
    addToast({ type: 'success', message, title, duration }),
  error: (message: string, title?: string, duration?: number) => 
    addToast({ type: 'error', message, title, duration }),
  warning: (message: string, title?: string, duration?: number) => 
    addToast({ type: 'warning', message, title, duration }),
  info: (message: string, title?: string, duration?: number) => 
    addToast({ type: 'info', message, title, duration }),
  remove: removeToast,
  clear: clearToasts,
})

// 暴露方法给父组件
defineExpose({
  success: (message: string, title?: string, duration?: number) => 
    addToast({ type: 'success', message, title, duration }),
  error: (message: string, title?: string, duration?: number) => 
    addToast({ type: 'error', message, title, duration }),
  warning: (message: string, title?: string, duration?: number) => 
    addToast({ type: 'warning', message, title, duration }),
  info: (message: string, title?: string, duration?: number) => 
    addToast({ type: 'info', message, title, duration }),
  remove: removeToast,
  clear: clearToasts,
})
</script>

<template>
  <div class="toast-container">
    <slot />
    
    <!-- Toast列表 -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <TransitionGroup
        enter-active-class="transition ease-out duration-300"
        enter-from-class="transform translate-x-full opacity-0"
        enter-to-class="transform translate-x-0 opacity-100"
        leave-active-class="transition ease-in duration-300"
        leave-from-class="transform translate-x-0 opacity-100"
        leave-to-class="transform translate-x-full opacity-0"
      >
        <Toast
          v-for="toast in toasts"
          :key="toast.id"
          :type="toast.type"
          :title="toast.title"
          :message="toast.message"
          :duration="0"
          :show="true"
          @close="removeToast(toast.id)"
        />
      </TransitionGroup>
    </div>
  </div>
</template> 