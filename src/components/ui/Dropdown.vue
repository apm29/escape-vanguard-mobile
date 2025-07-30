<script setup lang="ts">
import { DropdownMenuContent, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from 'radix-vue'

interface Props {
  /**
   * 是否禁用dropdown
   */
  disabled?: boolean
  /**
   * dropdown打开时的回调
   */
  onOpenChange?: (open: boolean) => void
  /**
   * 是否默认打开
   */
  defaultOpen?: boolean
  /**
   * 是否受控模式
   */
  open?: boolean
  /**
   * dropdown内容的位置
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * dropdown内容的对齐方式
   */
  align?: 'start' | 'center' | 'end'

  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  defaultOpen: false,
  side: 'bottom',
  align: 'center',
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

function handleOpenChange(open: boolean) {
  emit('update:open', open)
  props.onOpenChange?.(open)
}
</script>

<template>
  <DropdownMenuRoot :default-open="defaultOpen" :open="open" :disabled="disabled" @update:open="handleOpenChange">
    <DropdownMenuTrigger class="inline-flex items-center justify-center">
      <slot name="trigger" />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        class="will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-2000 rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] outline-none"
        :class="contentClass" :side="side" :align="align" :side-offset="4"
      >
        <slot />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
