<script setup lang="ts">
import { TabsTrigger } from 'radix-vue'

interface Props {
  value: string
}

defineProps<Props>()
</script>

<template>
  <TabsTrigger
    :value="value"
    class="ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex flex-shrink-0 items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
  >
    <slot />
  </TabsTrigger>
</template>
