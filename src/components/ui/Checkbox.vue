<script setup lang="ts">
interface Props {
  modelValue?: boolean
  disabled?: boolean
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  indeterminate?: boolean
  name?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  size: 'default',
  variant: 'default',
  indeterminate: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'change': [value: boolean]
}>()

const isChecked = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:modelValue', value)
    emit('change', value)
  },
})

function handleClick() {
  if (!props.disabled) {
    isChecked.value = !isChecked.value
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleClick()
  }
}
</script>

<template>
  <div class="inline-flex items-center">
    <button
      :id="id"
      :name="name"
      type="button"
      role="checkbox"
      :aria-checked="isChecked"
      :aria-disabled="disabled"
      :disabled="disabled"
      class="relative inline-flex items-center justify-center border rounded transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
      :class="[
        // 尺寸样式
        {
          'h-4 w-4': size === 'sm',
          'h-5 w-5': size === 'default',
          'h-6 w-6': size === 'lg',
        },
        // 变体样式
        {
          'border-gray-300 bg-white focus:ring-blue-500': variant === 'default',
          'border-blue-500 bg-blue-500 focus:ring-blue-500': variant === 'primary' && isChecked,
          'border-green-500 bg-green-500 focus:ring-green-500': variant === 'success' && isChecked,
          'border-yellow-500 bg-yellow-500 focus:ring-yellow-500': variant === 'warning' && isChecked,
          'border-red-500 bg-red-500 focus:ring-red-500': variant === 'error' && isChecked,
        },
        // 未选中状态的边框颜色
        {
          'border-gray-300': !isChecked && variant === 'default',
          'border-blue-300': !isChecked && variant === 'primary',
          'border-green-300': !isChecked && variant === 'success',
          'border-yellow-300': !isChecked && variant === 'warning',
          'border-red-300': !isChecked && variant === 'error',
        },
        // 悬停效果
        {
          'hover:border-blue-500': !disabled && variant === 'primary',
          'hover:border-green-500': !disabled && variant === 'success',
          'hover:border-yellow-500': !disabled && variant === 'warning',
          'hover:border-red-500': !disabled && variant === 'error',
        },
      ]"
      @click="handleClick"
      @keydown="handleKeydown"
    >
      <!-- 选中状态的勾选图标 -->
      <svg
        v-if="isChecked && !indeterminate"
        class="text-white"
        :class="[
          {
            'h-2.5 w-2.5': size === 'sm',
            'h-3 w-3': size === 'default',
            'h-4 w-4': size === 'lg',
          },
        ]"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>

      <!-- 不确定状态的横线图标 -->
      <svg
        v-if="indeterminate"
        class="text-white"
        :class="[
          {
            'h-2.5 w-2.5': size === 'sm',
            'h-3 w-3': size === 'default',
            'h-4 w-4': size === 'lg',
          },
        ]"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <!-- 标签插槽 -->
    <label
      v-if="$slots.default"
      :for="id"
      class="ml-2 cursor-pointer select-none text-sm"
      :class="[
        {
          'text-gray-400 cursor-not-allowed': disabled,
          'text-gray-700': !disabled,
        },
      ]"
      @click="!disabled && handleClick()"
    >
      <slot />
    </label>
  </div>
</template>
