<script setup lang="ts">
interface Props {
  variant?: 'default' | 'destructive' | 'info' | 'warning' | 'success'
  title?: string
  icon?: any
  dismissible?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  dismissible: false,
})

defineEmits<{
  dismiss: []
}>()
</script>

<template>
  <div
    class="relative w-full border rounded-lg p-4"
    :class="[
      {
        'border-red-200 bg-red-50 text-red-800': variant === 'destructive',
        'border-blue-200 bg-blue-50 text-blue-800': variant === 'info',
        'border-yellow-200 bg-yellow-50 text-yellow-800': variant === 'warning',
        'border-green-200 bg-green-50 text-green-800': variant === 'success',
      },
    ]"
  >
    <div class="flex items-start space-x-3">
      <div v-if="icon" class="flex-shrink-0">
        <component :is="icon" class="h-5 w-5" />
      </div>
      <div class="flex-1">
        <h3 v-if="title" class="text-sm font-medium">
          {{ title }}
        </h3>
        <div v-if="$slots.default" class="mt-2 text-sm">
          <slot />
        </div>
      </div>
      <button
        v-if="dismissible"
        class="flex-shrink-0 rounded-md p-1.5 transition-colors hover:bg-black/10"
        @click="$emit('dismiss')"
      >
        <span class="sr-only">关闭</span>
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>
