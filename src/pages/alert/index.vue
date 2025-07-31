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

const navigated = ref(false)

// 处理路线规划按钮点击
async function handleRoutePlanning() {
  if (!alert.value) {
    toast.error('没有可用的警报信息')
    return
  }

  try {
    // 调用地图组件的导航功能
    if (mapPanelRef.value) {
      await mapPanelRef.value.planRouteToShelter()
      navigated.value = true
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

// 处理开始导航按钮点击
async function handleStartNavigation() {
  try {
    // 这里可以添加导航逻辑
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
function getAlertLevelActionText(level: AlertLevelEnum) {
  switch (level) {
    case AlertLevelEnum.LOW:
      return '等待指令'
    case AlertLevelEnum.MEDIUM:
      return '准备疏散'
    case AlertLevelEnum.HIGH:
      return '立即疏散'
    default:
      return '保持关注'
  }
}

function getAlertLevelActionDescriptionText(level: AlertLevelEnum) {
  switch (level) {
    case AlertLevelEnum.LOW:
      return '所在位置目前风险低，请注意信息'
    case AlertLevelEnum.MEDIUM:
      return '所在位置在<span class="text-orange-500">中风险区域</span>，请做好设立准备'
    case AlertLevelEnum.HIGH:
      return '所在位置在<span class="text-red-500">高风险区域</span>，请立即撤离'
    default:
      return '保持关注'
  }
}
</script>

<template>
  <div v-if="alert" class="risk-screen" :class="currentAlertLevelClass">
    <div class="map-area">
      <div v-if="!navigated" class="action-area">
        <h3 class="text-dark-400 font-bold">
          {{ getAlertLevelActionText(alert.level) }}
        </h3>
        <h4 v-html="getAlertLevelActionDescriptionText(alert.level)" />
        <p class="text-sm text-gray-500">
          灾害类型：{{ alert.type }} | 时间：{{ alert.createdAt }}
        </p>
        <div class="w-full border-t" />
        <div class="flex items-center justify-center text-gray-600">
          <div class="h-1em w-1em rounded-full bg-blue-500" />
          <div class="flex flex-col items-center justify-center">
            <div class="px-8 text-sm">
              {{ alert.type }}与你的距离
            </div>
            <div class="h-1 w-full bg-red-500" />
            <div class="px-8 text-sm">
              {{ alert.disaster.distance }} {{ alert.disaster.time }}
            </div>
          </div>
          <div class="i-carbon:flood" />
        </div>
      </div>
      <AlertMapPanel ref="mapPanelRef" />
    </div>
    <div v-if="!navigated" class="status-info">
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

    <!-- 路线选项显示区域 -->
    <div v-if="navigated" class="route-options">
      <button class="navigation-btn" @click="handleStartNavigation">
        开始导航
      </button>
      <div class="route-cards">
        <div class="route-card recommended">
          <div class="route-title">
            推荐路线
          </div>
          <div class="route-details">
            <span class="distance">2.5km</span>
            <span class="time">10mins</span>
          </div>
        </div>
        <div class="route-card">
          <div class="route-title">
            最快路线
          </div>
          <div class="route-details">
            <span class="distance">1.5km</span>
            <span class="time">7mins</span>
          </div>
        </div>
        <div class="route-card">
          <div class="route-title">
            特殊路线
          </div>
          <div class="route-details">
            <span class="distance">2.5km</span>
            <span class="time">15mins</span>
          </div>
        </div>
      </div>
    </div>

    <button
      v-if="!navigated" class="action-btn" :class="currentButtonClass"
      @click="handleRoutePlanning()"
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
  position: relative;
}

.action-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  background-color: #fff;
  padding: 10px;
  gap: 4px;
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

.route-options {
  padding: 15px;
  background: white;
  border-top: 1px solid #eee;
}

.navigation-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  background: #d32f2f;
  color: white;
  text-align: center;
  margin-bottom: 15px;
  font-size: 16px;
}

.route-cards {
  display: flex;
  gap: 10px;
  width: 100%;
}

.route-card {
  flex: 1;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  border: 1px solid #e9ecef;
}

.route-card.recommended {
  background: #fff3cd;
  border-color: #ffc107;
}

.route-card.recommended .route-title {
  color: #d32f2f;
  font-weight: bold;
}

.route-card.recommended .route-details {
  color: #d32f2f;
}

.route-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.route-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.route-details .distance {
  font-weight: bold;
}

.route-details .time {
  color: #999;
}
</style>
