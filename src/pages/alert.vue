<script setup lang="ts">
defineOptions({
  name: 'IndexPage',
})
const route = useRoute()
const { t } = useI18n()
useHead({
  title: () => t('button.home'),
})
</script>

<template>
  <div class="warning-system h-screen w-full flex flex-col">
    <RouterView class="flex-grow overflow-auto">
      <template #default="{ Component }">
        <KeepAlive>
          <Component :is="Component" />
        </KeepAlive>
      </template>
    </RouterView>
    <div class="flex items-center justify-around gap-2 p-3 text-gray-500 bg-white border-t">
      <RouterLink to="/alert" class="flex flex-col items-center gap-2 text-gray-500" :class="{ active: route.path === '/alert' }">
        <i class="i-carbon:navaid-military-civil flex-shrink-0" />
        预警
      </RouterLink>
      <RouterLink to="/alert/info" class="flex flex-col items-center gap-2 text-gray-500" :class="{ active: route.path === '/alert/info' }">
        <i class="i-carbon-information flex-shrink-0" />
        信息
      </RouterLink>
      <RouterLink to="/alert/community" class="flex flex-col items-center gap-2 text-gray-500" :class="{ active: route.path === '/alert/community' }">
        <i class="i-carbon:earth-europe-africa flex-shrink-0" />
        社区
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.warning-system {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.tab-content {
  flex-grow: 1;
  overflow: auto;
}

.active {
  color: #d32f2f !important;
  transition: all 0.3s;
}

.active i {
  color: #d32f2f !important;
}
</style>
