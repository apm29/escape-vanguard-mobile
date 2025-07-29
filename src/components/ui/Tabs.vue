<script setup lang="ts">
import { TabsList, TabsRoot } from 'radix-vue'

interface Props {
  defaultValue?: string
  modelValue?: string
  mode?: 'top' | 'bottom'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'top',
})
defineEmits<{
  'update:modelValue': [value: string]
}>()

const currentValue = computed(() => {
  return props.defaultValue || props.modelValue
})
</script>

<template>
  <TabsRoot
    :default-value="currentValue"
    class="w-full"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <slot v-if="mode === 'top'" />
    <TabsList class="bg-muted text-muted-foreground min-h-16 inline-flex items-center justify-around border-t rounded-md p-1">
      <slot name="list" :active="currentValue" />
    </TabsList>
    <slot v-if="mode === 'bottom'" />
  </TabsRoot>
</template>
