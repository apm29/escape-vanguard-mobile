<script setup lang="ts">
import { ref } from 'vue'
import AIChatButton from '~/components/AIChatButton.vue'
import AIChatPanel from '~/components/AIChatPanel.vue'
import ToastProvider from '~/components/ui/ToastProvider.vue'

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Vitesse',
  meta: [
    {
      name: 'description',
      content: 'Opinionated Vite Starter Template',
    },
    {
      name: 'theme-color',
      content: () => isDark.value ? '#00aba9' : '#ffffff',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg',
    },
  ],
})

const showAIChat = ref(false)

function handleAIChatClick() {
  console.warn('handleAIChatClick')

  showAIChat.value = true
}

function handleAIChatClose() {
  showAIChat.value = false
}
</script>

<template>
  <ToastProvider>
    <RouterView />
    <AIChatButton @click="handleAIChatClick" />
    <AIChatPanel :is-visible="showAIChat" @close="handleAIChatClose" />
  </ToastProvider>
</template>
