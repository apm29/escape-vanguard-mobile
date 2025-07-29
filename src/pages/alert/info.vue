<script setup lang="ts">
import { useAlertStore } from '~/stores/alert'
import { AlertLevelEnum } from '~/types'

defineOptions({
  name: 'InfoPage',
})

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

// 格式化时间
function formatTime(dateString: string) {
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 根据警报等级获取状态文本
function getStatusText(level: AlertLevelEnum) {
  switch (level) {
    case AlertLevelEnum.LOW:
      return '轻度警报'
    case AlertLevelEnum.MEDIUM:
      return '中度警报'
    case AlertLevelEnum.HIGH:
      return '重度警报'
    default:
      return '警报'
  }
}
</script>

<template>
  <div v-if="alert">
    <!-- 头部警报栏 -->
    <div class="alert-header" :class="getHeaderClass(alert.level)">
      <RouterLink to="/info/record" class="alert-icon" >
        <div class="i-carbon:warning-alt" />
      </RouterLink>
      <span class="warning">警报: {{ alert.name }}</span>
      <RouterLink to="/info/record" class="alert-icon" >
        <div class="i-carbon:camera" />
      </RouterLink>
    </div>

    <!-- 避难场所信息主区域 -->
    <div class="shelter-info-container">
      <div class="shelter-title">
        避难场所信息
      </div>
      <div class="status-line">
        状态: {{ getStatusText(alert.level) }} | {{ formatTime(alert.createdAt) }}
      </div>

      <!-- 信息流程 -->
      <div class="info-flow">
        <!-- 地点 -->
        <div class="info-item">
          <div class="info-icon filled" />
          <div class="info-content">
            <div class="info-label">
              地点
            </div>
            <div class="info-value">
              汀溪中学, 同安区
            </div>
          </div>
        </div>

        <!-- 详细信息 -->
        <div class="info-item">
          <div class="info-icon" />
          <div class="info-content">
            <div class="info-label">
              详细信息
            </div>
            <div class="info-value">
              厦门市同安区大岭溪北路699号
            </div>
            <div class="info-value">
              电话: 0592-7155284
            </div>
          </div>
        </div>

        <!-- 距离 -->
        <div class="info-item">
          <div class="info-icon" />
          <div class="info-content">
            <div class="info-label">
              距离
            </div>
            <div class="info-value">
              距离2.5km, 预计步行时间15分钟
            </div>
          </div>
        </div>

        <!-- 容量 -->
        <div class="info-item">
          <div class="info-icon" />
          <div class="info-content">
            <div class="info-label">
              容量
            </div>
            <div class="info-value">
              可容纳2500人, 目前剩余容量1800人。
            </div>
          </div>
        </div>

        <!-- 设施 -->
        <div class="info-item">
          <div class="info-icon" />
          <div class="info-content">
            <div class="info-label">
              设施
            </div>
            <!-- <div class="facilities-grid">
              <div v-for="facility in ['地震', '山火', '洪涝', '台风', '干旱', '人为事件', '公共卫生']" :key="facility" class="facility-item">
                {{ facility }}
              </div>
            </div> -->
            <div class="nearby-shelters">
              <div
                v-for="shelter in [
                  { name: '汀溪中学', type: 'school', distance: '2km', highlighted: true },
                  { name: '澳溪中学', type: 'school', distance: '3.5km', highlighted: false },
                  { name: '双溪流公园', type: 'park', distance: '4.2km', highlighted: false },
                ]" :key="shelter.name" class="shelter-marker"
                :class="{ highlighted: shelter.highlighted }"
              >
                <i class="shelter-icon">🏠</i>
                <span>{{ shelter.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 当没有选中警报时显示默认页面 -->
  <div v-else>
    <!-- 头部警报栏 -->
    <div class="alert-header blue">
      <div class="alert-left">
        <i class="alert-icon">ℹ</i>
        <span class="alert-text">暂无警报</span>
      </div>
      <span class="menu-dots">⋯</span>
    </div>

    <!-- 避难场所信息主区域 -->
    <div class="shelter-info-container">
      <div class="shelter-title">
        避难场所信息
      </div>
      <div class="status-line">
        状态: 安全 | {{ new Date().toLocaleString('zh-CN') }}
      </div>

      <!-- 信息流程 -->
      <div class="info-flow">
        <!-- 地点 -->
        <div class="info-item">
          <div class="info-icon filled" />
          <div class="info-content">
            <div class="info-label">
              地点
            </div>
            <div class="info-value">
              汀溪中学, 同安区
            </div>
          </div>
        </div>

        <!-- 详细信息 -->
        <div class="info-item">
          <div class="info-icon" />
          <div class="info-content">
            <div class="info-label">
              详细信息
            </div>
            <div class="info-value">
              厦门市同安区大岭溪北路699号
            </div>
            <div class="info-value">
              电话: 0592-7155284
            </div>
          </div>
        </div>

        <!-- 距离 -->
        <div class="info-item">
          <div class="info-icon" />
          <div class="info-content">
            <div class="info-label">
              距离
            </div>
            <div class="info-value">
              距离2km, 预计步行时间20mins
            </div>
          </div>
        </div>

        <!-- 容量 -->
        <div class="info-item">
          <div class="info-icon" />
          <div class="info-content">
            <div class="info-label">
              容量
            </div>
            <div class="info-value">
              可容纳3000人, 目前剩余容量1700人。
            </div>
          </div>
        </div>

        <!-- 设施 -->
        <div class="info-item">
          <div class="info-icon" />
          <div class="info-content">
            <div class="info-label">
              设施
            </div>
            <div class="facilities-grid">
              <div v-for="facility in ['地震', '山火', '洪涝', '台风', '干旱', '人为事件', '公共卫生']" :key="facility" class="facility-item">
                {{ facility }}
              </div>
            </div>
            <div class="nearby-shelters">
              <div
                v-for="shelter in [
                  { name: '汀溪中学', type: 'school', distance: '2km', highlighted: true },
                  { name: '澳溪中学', type: 'school', distance: '3.5km', highlighted: false },
                  { name: '双溪流公园', type: 'park', distance: '4.2km', highlighted: false },
                ]" :key="shelter.name" class="shelter-marker"
                :class="{ highlighted: shelter.highlighted }"
              >
                <i class="shelter-icon">🏠</i>
                <span>{{ shelter.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 警报头部 */
.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  color: white;
  font-size: 14px;
}

.alert-header.red {
  background: #d32f2f;
}

.alert-header.orange {
  background: #f57c00;
}

.alert-header.blue {
  background: #1976d2;
}

.alert-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.alert-text {
  font-weight: 500;
}

/* 避难场所信息容器 */
.shelter-info-container {
  background: white;
  margin: 16px;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)),
    repeating-linear-gradient(0deg, transparent, transparent 20px, #e0e0e0 20px, #e0e0e0 21px),
    repeating-linear-gradient(90deg, transparent, transparent 20px, #e0e0e0 20px, #e0e0e0 21px);
}

.shelter-title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.status-line {
  text-align: center;
  font-size: 12px;
  color: #666;
  margin-bottom: 20px;
}

/* 信息流程 */
.info-flow {
  position: relative;
}

.info-flow::before {
  content: '';
  position: absolute;
  left: 12px;
  top: 24px;
  bottom: 24px;
  width: 2px;
  background: #e0e0e0;
  z-index: 1;
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  position: relative;
  z-index: 2;
}

.info-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
  background: white;
  margin-right: 16px;
  flex-shrink: 0;
  position: relative;
  z-index: 3;
}

.info-icon.filled {
  background: #999;
  border-color: #999;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.info-value {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
  margin-bottom: 2px;
}

/* 设施网格 */
.facilities-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.facility-item {
  padding: 4px 8px;
  background: #f0f0f0;
  border-radius: 12px;
  font-size: 11px;
  color: #666;
}

/* 附近避难场所 */
.nearby-shelters {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.shelter-marker {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  background: #f0f0f0;
  color: #666;
}

.shelter-marker.highlighted {
  background: #ffebee;
  color: #d32f2f;
  font-weight: 500;
}

.shelter-icon {
  font-size: 12px;
}
</style>
