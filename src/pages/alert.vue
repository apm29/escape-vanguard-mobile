<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'radix-vue'
import { AlertLevelEnum } from '~/types'

defineOptions({
  name: 'AlertDetailPage',
})
const route = useRoute()
const { t } = useI18n()
useHead({
  title: () => t('button.home'),
})

const alertStore = useAlertStore()
const alert = computed(() => alertStore.alert)

// 根据警报等级获取头部样式
function getHeaderClass(level: AlertLevelEnum) {
  switch (level) {
    case AlertLevelEnum.LOW:
      return 'blue'
    case AlertLevelEnum.MEDIUM:
      return 'orange'
    case AlertLevelEnum.HIGH:
      return 'red'
    default:
      return 'blue'
  }
}
// 计算属性：当前警报的头部样式
const currentHeaderClass = computed(() => {
  return alert.value ? getHeaderClass(alert.value.level) : 'blue'
})
const dropdownOpen = ref(false)

const layerOpen = ref(false)
const layers = reactive([
  {
    icon: 'i-carbon:car',
    label: '交通',
    checked: true,
  },
  {
    icon: 'i-carbon:fire',
    label: '火源距离',
    checked: true,
  },
  {
    icon: 'i-carbon:windy',
    label: '风向',
    checked: true,
  },
  {
    icon: 'i-carbon:cloud',
    label: '烟雾浓度',
    checked: true,
  },
  {
    icon: 'i-carbon:barrier',
    label: '道路障碍',
    checked: true,
  },

])

const contactOpen = ref(false)
</script>

<template>
  <div class="warning-system h-screen w-full flex flex-col">
    <div class="screen-header" :class="currentHeaderClass">
      <div class="alert-icon">
        <div class="i-carbon:warning-alt-filled text-lg" />
      </div>
      <span class="warning">警报: {{ alert.name }}</span>
      <Dropdown
        v-model:open="dropdownOpen"
        content-class="!bg-transparent !shadow-none !w-auto flex flex-col items-center justify-center"
      >
        <template #trigger>
          <div class="i-carbon:overflow-menu-vertical text-lg" />
        </template>
        <DropdownItem>
          <button class="icon-button" @click="layerOpen = true">
            <i class="i-carbon:layers" />
          </button>
        </DropdownItem>
        <DropdownItem>
          <button class="icon-button" @click="contactOpen = true">
            <i class="i-material-symbols:group-rounded" />
          </button>
        </DropdownItem>
        <DropdownItem>
          <RouterLink to="/info/record" class="icon-button">
            <i class="i-carbon:camera" />
          </RouterLink>
        </DropdownItem>
        <DropdownItem>
          <a class="icon-button" href="tel:120">
            <i class="i-ic:baseline-sos" />
          </a>
        </DropdownItem>
      </Dropdown>
    </div>

    <RouterView class="flex-grow overflow-auto">
      <template #default="{ Component }">
        <KeepAlive>
          <Component :is="Component" />
        </KeepAlive>
      </template>
    </RouterView>
    <div class="flex items-center justify-around gap-2 border-t bg-white p-3 text-gray-500">
      <RouterLink
        to="/alert/info" replace class="flex flex-col items-center gap-2 text-gray-500"
        :class="{ active: route.path === '/alert/info', [getHeaderClass(alert.level)]: true }"
      >
        <i class="i-carbon-information flex-shrink-0" />
        信息
      </RouterLink>

      <RouterLink
        to="/alert" replace class="flex flex-col items-center gap-2 text-gray-500"
        :class="{ active: route.path === '/alert', [getHeaderClass(alert.level)]: true }"
      >
        <i class="i-carbon:navaid-military-civil flex-shrink-0" />
        逃生
      </RouterLink>

      <RouterLink
        to="/alert/community" replace class="flex flex-col items-center gap-2 text-gray-500"
        :class="{ active: route.path === '/alert/community', [getHeaderClass(alert.level)]: true }"
      >
        <i class="i-carbon:earth-europe-africa flex-shrink-0" />
        社区
      </RouterLink>
    </div>
    <Modal v-model:open="layerOpen" title="图层" size="sm" content-class="!w-80% bg-white rounded z-9999">
      <div class="flex flex-wrap items-center justify-left gap-6 text-dark-400">
        <div v-for="layer of layers" :key="layer.label" class="flex items-center gap-2">
          <label class="flex flex-col select-none items-center justify-center gap-1 px-2 text-sm text-stone-700 leading-none dark:text-white" for="airplane-mode">
            <div class="h-2em w-2em flex items-center gap-2 border border-dark-200 rounded-full bg-gray-200 p-1">
              <i :class="layer.icon" />
            </div>
            {{ layer.label }}
          </label>

          <SwitchRoot
            v-model:checked="layer.checked"
            class="transition-[background] relative h-[20px] w-[32px] flex border border-stone-300 rounded-full shadow-sm dark:border-stone-700 data-[state=checked]:border-stone-700 data-[state=checked]:bg-blue-800 data-[state=unchecked]:bg-stone-300 focus-within:shadow-[0_0_0_1px] dark:data-[state=checked]:bg-blue-700 dark:data-[state=unchecked]:bg-stone-800"
          >
            <SwitchThumb
              class="my-auto h-3.5 w-3.5 flex translate-x-0.5 items-center justify-center rounded-full bg-white text-xs shadow-xl transition-transform will-change-transform data-[state=checked]:translate-x-full"
            />
          </SwitchRoot>
        </div>
      </div>
    </Modal>
    <Modal v-model:open="contactOpen" title="联系" size="sm" content-class="!w-80% bg-white rounded">
      <div class="flex flex-col items-center justify-center gap-2">
        <div class="w-full flex items-center justify-between border-b">
          <div>
            <h3 class="text-base text-gray-700">
              妈妈
            </h3>
            <p class="text-sm text-gray-500">
              低安全区， <a class="text-blue-500">路线规划</a>
            </p>
          </div>
          <i class="i-carbon:phone-filled" />
        </div>
        <div class="w-full flex items-center justify-between border-b">
          <div>
            <h3 class="text-base text-gray-700">
              弟弟
            </h3>
            <p class="text-sm text-gray-500">
              安全区， 下线
            </p>
          </div>
          <i class="i-carbon:phone-filled" />
        </div>
        <div class="w-full flex items-center justify-between">
          <div>
            <h3 class="text-base text-gray-700">
              外婆
            </h3>
            <p class="text-sm text-gray-500">
              低安全区， <a class="text-blue-500">路线规划</a>
            </p>
          </div>
          <i class="i-carbon:phone-filled" />
        </div>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.warning-system {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.screen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  color: white;
  font-size: 16px;
  font-weight: 600;
}

.screen-header.red {
  background: #d32f2f;
}

.screen-header.orange {
  background: #f57c00;
}

.screen-header.blue {
  background: #1976d2;
}

.tab-content {
  flex-grow: 1;
  overflow: auto;
}

.active {
  transition: all 0.3s;
}

.active i {
}

.icon-button {
  @apply flex items-center justify-center text-gray-500 hover:text-gray-700 bg-white rounded-full p-2 border;
}

.active.red {
  color: #d32f2f;
}

.active.orange {
  color: #f57c00;
}

.active.blue {
  color: #1976d2;
}
</style>
