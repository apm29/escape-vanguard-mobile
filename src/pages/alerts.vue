<script setup lang="ts">
import type { AlertVO } from '~/types'
import { useAlertStore } from '~/stores/alert'
import { AlertLevelEnum } from '~/types'

defineOptions({
  name: 'AlertsPage',
})

useHead({
  title: '警报中心',
})

const alertStore = useAlertStore()
const alerts = computed(() => alertStore.alerts)
const router = useRouter()
// 当前选中的警报
const selectedAlert = ref<AlertVO | null>(null)
const showAlertModal = ref(false)

// 根据警报等级获取样式类
function getAlertLevelClass(level: AlertLevelEnum) {
  switch (level) {
    case AlertLevelEnum.LOW:
      return 'alert-low'
    case AlertLevelEnum.MEDIUM:
      return 'alert-medium'
    case AlertLevelEnum.HIGH:
      return 'alert-high'
    default:
      return 'alert-low'
  }
}

// 根据警报等级获取图标
function getAlertIcon(level: AlertLevelEnum) {
  switch (level) {
    case AlertLevelEnum.LOW:
      return 'i-carbon:warning'
    case AlertLevelEnum.MEDIUM:
      return 'i-carbon:warning'
    case AlertLevelEnum.HIGH:
      return 'i-carbon:warning-filled'
    default:
      return 'i-carbon:warning'
  }
}

// 根据警报等级获取背景色
function getAlertBgColor(level: AlertLevelEnum) {
  switch (level) {
    case AlertLevelEnum.LOW:
      return '#3398ff'
    case AlertLevelEnum.MEDIUM:
      return '#f57c00'
    case AlertLevelEnum.HIGH:
      return '#d32f2f'
    default:
      return '#3398ff'
  }
}

// 显示警报详情
function showAlertDetail(alert: AlertVO) {
  selectedAlert.value = alert
  showAlertModal.value = true
}

// 关闭警报弹窗
function closeAlertModal(alert: AlertVO) {
  showAlertModal.value = false
  selectedAlert.value = null
  alertStore.setAlert(alert)
  router.push('/alert')
}

// 格式化时间
function formatTime(dateString: string) {
  return new Date(dateString).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="alerts-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1>警报中心</h1>
      <p>实时监控灾害警报信息</p>
    </div>

    <!-- 警报列表 -->
    <div class="alerts-container">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="alert-card"
        :class="getAlertLevelClass(alert.level)"
        @click="showAlertDetail(alert)"
      >
        <div class="alert-header">
          <div class="alert-icon">
            <div class="icon-wrapper" :class="getAlertLevelClass(alert.level)">
              <i :class="getAlertIcon(alert.level)" class="icon" />
            </div>
          </div>
          <div class="alert-info">
            <h3>{{ alert.name }}</h3>
            <p>{{ alert.description }}</p>
          </div>
          <div class="alert-time">
            {{ formatTime(alert.createdAt) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 紧急警报弹窗 -->
    <Teleport to="body">
      <div v-if="showAlertModal && selectedAlert" class="emergency-alert-modal">
        <div class="modal-backdrop" @click="closeAlertModal" />
        <div class="emergency-alert" :style="{ backgroundColor: getAlertBgColor(selectedAlert.level) }">
          <!-- 弹窗头部 -->
          <div class="alert-modal-header">
            <div class="warning-icon">
              <div class="warning-triangle">
                <i class="exclamation-icon i-carbon:warning" />
              </div>
            </div>
            <div class="alert-title">
              警报
            </div>
            <button class="close-btn" @click="closeAlertModal">
              <i class="i-carbon:close" />
            </button>
          </div>

          <!-- 弹窗内容 -->
          <div class="alert-modal-content">
            <div class="alert-category">
              警报: {{ selectedAlert.name }}
            </div>
            <div class="alert-message">
              {{ selectedAlert.description }}
            </div>

            <!-- 详细信息 -->
            <div class="alert-details">
              <div class="detail-item">
                <span class="detail-label">警报等级:</span>
                <span class="detail-value">{{ selectedAlert.level }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">发布时间:</span>
                <span class="detail-value">{{ formatTime(selectedAlert.createdAt) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">避难所位置:</span>
                <span class="detail-value">
                  {{ selectedAlert.shelter.location.latitude.toFixed(4) }},
                  {{ selectedAlert.shelter.location.longitude.toFixed(4) }}
                </span>
              </div>
            </div>
          </div>

          <!-- 行动按钮 -->
          <div class="alert-action">
            <button class="action-btn" @click="closeAlertModal(selectedAlert)">
              <i
                :class="selectedAlert.level === AlertLevelEnum.HIGH ? 'i-carbon:run' : 'i-carbon:information'"
                class="action-icon"
              />
              {{ selectedAlert.level === AlertLevelEnum.HIGH ? '立即疏散' : '了解详情' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.alerts-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.page-header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
}

.page-header p {
  font-size: 16px;
  opacity: 0.8;
}

.alerts-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.alert-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid;
}

.alert-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.alert-card.alert-low {
  border-left-color: #3398ff;
}

.alert-card.alert-medium {
  border-left-color: #f57c00;
}

.alert-card.alert-high {
  border-left-color: #d32f2f;
}

.alert-header {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 15px;
}

.alert-icon {
  flex-shrink: 0;
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.icon-wrapper.alert-low {
  background: rgba(255, 152, 0, 0.1);
  color: #3398ff;
}

.icon-wrapper.alert-medium {
  background: rgba(245, 124, 0, 0.1);
  color: #f57c00;
}

.icon-wrapper.alert-high {
  background: rgba(211, 47, 47, 0.1);
  color: #d32f2f;
}

.icon {
  width: 24px;
  height: 24px;
}

.alert-info {
  flex-grow: 1;
}

.alert-info h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.alert-info p {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.alert-time {
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
}

.alert-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

/* 紧急警报弹窗样式 */
.emergency-alert-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
}

.emergency-alert {
  position: relative;
  width: 90%;
  max-width: 500px;
  background: #d32f2f;
  border-radius: 16px;
  color: white;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.alert-modal-header {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.warning-icon {
  margin-right: 15px;
}

.warning-triangle {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.exclamation-icon {
  width: 24px;
  height: 24px;
  color: #d32f2f;
}

.alert-title {
  flex-grow: 1;
  font-size: 20px;
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.close-icon {
  width: 16px;
  height: 16px;
}

.alert-modal-content {
  padding: 20px;
}

.alert-category {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}

.alert-message {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;
}

.alert-details {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-size: 14px;
  opacity: 0.8;
}

.detail-value {
  font-size: 14px;
  font-weight: bold;
}

.community-info h4 {
  font-size: 16px;
  margin-bottom: 10px;
}

.community-posts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.community-post {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
}

.post-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
}

.post-content {
  font-size: 12px;
  opacity: 0.9;
  margin-bottom: 8px;
  line-height: 1.4;
}

.post-stats {
  display: flex;
  gap: 15px;
  font-size: 12px;
  opacity: 0.8;
}

.stat-with-icon {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-icon {
  width: 12px;
  height: 12px;
}

.alert-action {
  padding: 20px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.action-btn {
  background: white;
  color: #d32f2f;
  border: none;
  border-radius: 8px;
  padding: 12px 30px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.action-btn:hover {
  background: #f5f5f5;
  transform: translateY(-1px);
}

.action-icon {
  width: 16px;
  height: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .alerts-page {
    padding: 15px;
  }

  .emergency-alert {
    width: 95%;
    margin: 20px;
  }

  .alert-header {
    flex-direction: column;
    gap: 10px;
  }

  .alert-time {
    align-self: flex-end;
  }
}
</style>
