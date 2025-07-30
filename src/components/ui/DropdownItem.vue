<script setup lang="ts">
import { DropdownMenuCheckboxItem, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from 'radix-vue'

interface Props {
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 点击时的回调
   */
  onSelect?: (event: Event) => void
  /**
   * 是否为分隔符
   */
  separator?: boolean
  /**
   * 是否为标签
   */
  label?: boolean
  /**
   * 是否为分组
   */
  group?: boolean
  /**
   * 是否为复选框项
   */
  checkbox?: boolean
  /**
   * 复选框是否选中
   */
  checked?: boolean
  /**
   * 是否为单选框组
   */
  radioGroup?: boolean
  /**
   * 单选框的值
   */
  value?: string
  /**
   * 是否为子菜单
   */
  sub?: boolean
  /**
   * 子菜单的触发器
   */
  subTrigger?: boolean
  /**
   * 子菜单的内容
   */
  subContent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  separator: false,
  label: false,
  group: false,
  checkbox: false,
  checked: false,
  radioGroup: false,
  sub: false,
  subTrigger: false,
  subContent: false,
})

const emit = defineEmits<{
  'update:checked': [value: boolean]
  'select': [event: Event]
}>()

function handleSelect(event: Event) {
  emit('select', event)
  props.onSelect?.(event)
}

function handleCheckedChange(checked: boolean) {
  emit('update:checked', checked)
}
</script>

<template>
  <!-- 分隔符 -->
  <DropdownMenuSeparator
    v-if="separator"
    class="bg-muted my-1 h-px"
  />

  <!-- 标签 -->
  <DropdownMenuLabel
    v-else-if="label"
    class="px-2 py-1.5 text-sm font-semibold"
  >
    <slot />
  </DropdownMenuLabel>

  <!-- 分组 -->
  <DropdownMenuGroup
    v-else-if="group"
  >
    <slot />
  </DropdownMenuGroup>

  <!-- 复选框项 -->
  <DropdownMenuCheckboxItem
    v-else-if="checkbox"
    :checked="checked"
    :disabled="disabled"
    class="focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    @update:checked="handleCheckedChange"
    @select="handleSelect"
  >
    <slot />
  </DropdownMenuCheckboxItem>

  <!-- 单选框组 -->
  <DropdownMenuRadioGroup
    v-else-if="radioGroup"
    :value="value"
  >
    <slot />
  </DropdownMenuRadioGroup>

  <!-- 子菜单 -->
  <DropdownMenuSub
    v-else-if="sub"
  >
    <slot />
  </DropdownMenuSub>

  <!-- 子菜单触发器 -->
  <DropdownMenuSubTrigger
    v-else-if="subTrigger"
    :disabled="disabled"
    class="focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    @select="handleSelect"
  >
    <slot />
  </DropdownMenuSubTrigger>

  <!-- 子菜单内容 -->
  <DropdownMenuSubContent
    v-else-if="subContent"
    class="bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden border rounded-md p-1 shadow-lg"
  >
    <slot />
  </DropdownMenuSubContent>

  <!-- 普通菜单项 -->
  <DropdownMenuItem
    v-else
    :disabled="disabled"
    class="focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    @select="handleSelect"
  >
    <slot />
  </DropdownMenuItem>
</template>
