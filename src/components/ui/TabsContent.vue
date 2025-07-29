<script setup lang="ts">
import { TabsContent } from 'radix-vue'

interface Props {
  value: string
}

defineProps<Props>()
</script>

<template>
  <TabsContent
    :value="value"
    class="tab-content ring-offset-background focus-visible:ring-ring p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
  >
    <slot />
  </TabsContent>
</template>
