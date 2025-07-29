<script setup lang="ts">
import AlertMapPanel from '~/components/AlertMapPanel.vue'
import { useToast } from '~/composables/useToast'
import { useAlertStore } from '~/stores/alert'
import { AlertLevelEnum } from '~/types'

defineOptions({
  name: 'WarningPage',
})

const { t } = useI18n()
useHead({
  title: () => t('button.home'),
})

const alertStore = useAlertStore()
const alert = computed(() => alertStore.alert)

// 地图组件引用
const mapPanelRef = ref<InstanceType<typeof AlertMapPanel> | null>(null)

// 使用toast
const toast = useToast()

// 根据警报等级获取样式类
function getAlertLevelClass(level: AlertLevelEnum) {
  switch (level) {
    case AlertLevelEnum.LOW:
      return 'low-risk'
    case AlertLevelEnum.MEDIUM:
      return 'medium-risk'
    case AlertLevelEnum.HIGH:
      return 'high-risk'
    default:
      return 'low-risk'
  }
}

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

// 根据警报等级获取按钮样式
function getButtonClass(level: AlertLevelEnum) {
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

// 根据警报等级获取状态文本
function getStatusText(level: AlertLevelEnum) {
  switch (level) {
    case AlertLevelEnum.LOW:
      return '保持关注'
    case AlertLevelEnum.MEDIUM:
      return '准备撤离'
    case AlertLevelEnum.HIGH:
      return '立即撤离'
    default:
      return '保持关注'
  }
}

// 计算距离（模拟数据）
function getDistance() {
  if (!alert.value)
    return '未知'
  // 这里可以根据用户位置和警报位置计算实际距离
  return '2.5km'
}

// 计算预计时间（模拟数据）
function getEstimatedTime() {
  if (!alert.value)
    return '未知'
  // 这里可以根据距离和交通状况计算实际时间
  return '15分钟'
}

// 计算属性：当前警报的样式类
const currentAlertLevelClass = computed(() => {
  return alert.value ? getAlertLevelClass(alert.value.level) : 'low-risk'
})

// 计算属性：当前警报的头部样式
const currentHeaderClass = computed(() => {
  return alert.value ? getHeaderClass(alert.value.level) : 'blue'
})

// 计算属性：当前警报的按钮样式
const currentButtonClass = computed(() => {
  return alert.value ? getButtonClass(alert.value.level) : 'blue'
})

// 计算属性：当前状态文本
const currentStatusText = computed(() => {
  return alert.value ? getStatusText(alert.value.level) : '安全状态'
})

// 计算属性：当前距离
const currentDistance = computed(() => {
  return getDistance()
})

// 计算属性：当前预计时间
const currentEstimatedTime = computed(() => {
  return getEstimatedTime()
})

// 处理立即撤离按钮点击
async function handleEvacuate() {
  if (!alert.value) {
    toast.error('没有可用的警报信息')
    return
  }

  try {
    // 调用地图组件的导航功能
    if (mapPanelRef.value) {
      await mapPanelRef.value.navigateToShelter()
    }
    else {
      toast.error('地图组件未加载完成，请稍后重试')
    }
  }
  catch (error) {
    console.error('导航失败:', error)
    toast.error('导航功能暂时不可用，请稍后重试')
  }
}

// 处理路线规划按钮点击
async function handleRoutePlanning() {
  if (!alert.value) {
    toast.error('没有可用的警报信息')
    return
  }

  try {
    // 调用地图组件的导航功能
    if (mapPanelRef.value) {
      await mapPanelRef.value.navigateToShelter()
    }
    else {
      toast.error('地图组件未加载完成，请稍后重试')
    }
  }
  catch (error) {
    console.error('路线规划失败:', error)
    toast.error('路线规划功能暂时不可用，请稍后重试')
  }
}
</script>

<template>
  <div v-if="alert" class="risk-screen" :class="currentAlertLevelClass">
    <div class="screen-header" :class="currentHeaderClass">
      <div class="alert-icon">
        <div class="i-carbon:warning-alt" />
      </div>
      <span class="warning">警报: {{ alert.name }}</span>
      <RouterLink to="/info/record" class="alert-icon" >
        <div class="i-carbon:camera" />
      </RouterLink>
    </div>
    <div class="map-area">
      <AlertMapPanel ref="mapPanelRef" />
    </div>
    <div class="status-info">
      <div class="status">
        {{ currentStatusText }}
      </div>
      <div class="location">
        {{ alert.description }}
      </div>
      <div class="distance">
        {{ alert.name }}与你的距离 {{ currentDistance }} {{ currentEstimatedTime }}
      </div>
    </div>
    <button
      class="action-btn"
      :class="currentButtonClass"
      @click="alert.level === AlertLevelEnum.HIGH ? handleEvacuate() : handleRoutePlanning()"
    >
      {{ alert.level === AlertLevelEnum.HIGH ? '立即撤离' : '路线规划' }}
    </button>
  </div>

  <!-- 当没有选中警报时显示默认页面 -->
  <div v-else class="risk-screen low-risk">
    <div class="screen-header blue">
      <span class="time">{{ new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }}</span>
      <span class="warning">暂无警报</span>
      <span class="menu">⋯</span>
    </div>
    <div class="map-area">
      <AlertMapPanel ref="mapPanelRef" />
    </div>
    <div class="status-info">
      <div class="status">
        安全状态
      </div>
      <div class="location">
        当前区域暂无灾害警报，请保持关注
      </div>
      <div class="distance">
        最近避难所距离 1.2km 步行约8分钟
      </div>
    </div>
    <button class="action-btn blue">
      查看警报中心
    </button>
  </div>
</template>

<style scoped>
.risk-screen {
  background: #000;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.screen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  color: white;
  font-size: 14px;
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

.map-area {
  flex-grow: 1;
}

.status-info {
  padding: 15px;
}

.status {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: white;
}

.location {
  font-size: 12px;
  color: #ccc;
  margin-bottom: 8px;
  line-height: 1.4;
}

.distance {
  font-size: 12px;
  color: #999;
}

.action-btn {
  width: calc(100% - 30px);
  margin: 0 15px 15px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.action-btn.red {
  background: #d32f2f;
  color: white;
}

.action-btn.orange {
  background: #f57c00;
  color: white;
}

.action-btn.blue {
  background: #1976d2;
  color: white;
}
</style>
