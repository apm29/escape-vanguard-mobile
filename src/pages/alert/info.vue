<script setup lang="ts">
import type { Disaster, Shelter } from '~/stores/info'
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
const infoStore = useInfoStore()
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
    <!-- 避难场所信息主区域 -->
    <div v-if="infoStore.infoType === 'shelter'" class="shelter-info-container">
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
          <div class="info-icon filled">
            <div class="i-carbon:location text-sm text-white" />
          </div>
          <div class="info-content">
            <div class="info-label">
              地点
            </div>
            <div class="info-value">
              {{ infoStore.info.location }}
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
              {{ (infoStore.info as Shelter).detail }}
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
              {{ (infoStore.info as Shelter).distance }}
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
              {{ (infoStore.info as Shelter).capacity }}
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
            <div class="info-value">
              {{ (infoStore.info as Shelter).facilities }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="infoStore.infoType === 'disaster'" class="disaster-info-container">
      <div class="disaster-title">
        灾害信息
      </div>
      <div class="status-line">
        状态: {{ getStatusText(alert.level) }} | {{ formatTime(alert.createdAt) }}
      </div>
      <div class="info-flow">
        <div class="info-item">
          <div class="info-icon filled">
            <div class="i-carbon:location text-sm text-white" />
          </div>
          <div class="info-content">
            <div class="info-label">
              地点
            </div>
            <div class="info-value">
              {{ (infoStore.info as Disaster).location }}
            </div>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon" />
          <div class="info-content">
            <div class="info-label">
              详细信息
            </div>
            <div class="info-value">
              {{ (infoStore.info as Disaster).description }}
            </div>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon" />
          <div class="info-content">
            <div class="info-label">
              距离
            </div>
            <div class="info-value">
              {{ (infoStore.info as Disaster).distance }}
            </div>
            <div class="threat-direction-diagram">
              <svg width="200" height="200" viewBox="0 0 200 200" class="threat-svg">
                <!-- 同心圆 -->
                <circle cx="100" cy="100" r="30" fill="none" stroke="#999" stroke-width="1" />
                <circle cx="100" cy="100" r="50" fill="none" stroke="#999" stroke-width="1" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="#999" stroke-width="1" />

                <!-- 十字准星 -->
                <line x1="100" y1="70" x2="100" y2="130" stroke="#999" stroke-width="1" />
                <line x1="70" y1="100" x2="130" y2="100" stroke="#999" stroke-width="1" />

                <!-- 中心点 -->
                <circle cx="100" cy="100" r="3" fill="#1976d2" />

                <!-- 紫色箭头（指向南方） -->
                <circle cx="100" cy="100" r="2" fill="#9c27b0" />
                <polygon points="100,100 95,110 105,110" fill="#9c27b0" />

                <!-- 红色威胁线（指向东北方向） -->
                <line x1="100" y1="100" x2="140" y2="60" stroke="#d32f2f" stroke-width="2" />
                <circle cx="140" cy="60" r="8" fill="#d32f2f" fill-opacity="0.6" />
              </svg>
            </div>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon" />
          <div class="info-content">
            <div class="info-label">
              防范措施
            </div>
            <div class="info-value" v-html="(infoStore.info as Disaster).action" />
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
.shelter-info-container,
.disaster-info-container {
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

.shelter-title,
.disaster-title {
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
  display: flex;
  align-items: center;
  justify-content: center;
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

/* 威胁方向示意图 */
.threat-direction-diagram {
  display: flex;
  justify-content: center;
  margin: 16px 0;
  padding: 16px;
  border-radius: 8px;
}

.threat-svg {
  max-width: 50%;
  height: auto;
}
</style>
