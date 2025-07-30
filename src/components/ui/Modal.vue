<script setup lang="ts">
import { DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger } from 'radix-vue'

interface Props {
  /**
   * 模态框标题
   */
  title?: string
  /**
   * 模态框描述
   */
  description?: string
  /**
   * 是否显示模态框
   */
  open?: boolean
  /**
   * 是否默认打开
   */
  defaultOpen?: boolean
  /**
   * 模态框打开时的回调
   */
  onOpenChange?: (open: boolean) => void
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 模态框大小
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /**
   * 是否显示关闭按钮
   */
  showCloseButton?: boolean
  /**
   * 是否可以通过点击遮罩层关闭
   */
  closeOnOverlayClick?: boolean
  /**
   * 是否可以通过按ESC键关闭
   */
  closeOnEscape?: boolean
  /**
   * 内容类名
   */
  contentClass?: string

  /**
   * 是否显示模态框
   */
  modal?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  defaultOpen: false,
  disabled: false,
  size: 'md',
  showCloseButton: true,
  closeOnOverlayClick: true,
  closeOnEscape: true,
  contentClass: '',
  modal: true,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

function handleOpenChange(open: boolean) {
  emit('update:open', open)
  props.onOpenChange?.(open)
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4',
}
</script>

<template>
  <DialogRoot :default-open="defaultOpen" :open="open" :disabled="disabled" @update:open="handleOpenChange">
    <DialogTrigger as-child>
      <slot name="trigger" />
    </DialogTrigger>

    <DialogPortal>
      <DialogOverlay
        v-if="modal"
        class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        :class="{ 'pointer-events-none': !closeOnOverlayClick }"
      />
      <DialogContent
        class="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg"
        :class="[sizeClasses[size], contentClass]" :on-escape-key-down="closeOnEscape ? undefined : (e) => e.preventDefault()"
        :aria-describedby="undefined"
      >
        <div v-if="title || description">
          <DialogTitle v-if="title" class="text-lg font-semibold leading-none tracking-tight">
            {{ title }}
          </DialogTitle>
          <DialogDescription v-if="description" class="text-muted-foreground text-sm">
            {{ description }}
          </DialogDescription>
        </div>

        <div class="relative">
          <slot />
        </div>

        <button
          v-if="showCloseButton"
          class="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-4 rounded-sm opacity-70 transition-opacity disabled:pointer-events-none hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
          @click="handleOpenChange(false)"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span class="sr-only">关闭</span>
        </button>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
