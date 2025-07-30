<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useLbsStore } from '~/stores/lbs'

const lbsStore = useLbsStore()
const mapContainer = ref<HTMLDivElement | null>(null)

// 暴露导航方法给父组件
defineExpose({
  navigateToShelter: lbsStore.navigateToShelter,
})

onMounted(async () => {
  try {
    // 加载高德地图主脚本
    await lbsStore.loadMapScript()

    // 初始化地图
    if (mapContainer.value) {
      await lbsStore.initMap(mapContainer.value)
      // 获取位置后立即搜索最近的避难所
      // await lbsStore.searchNearestShelter()
      // 生成热力图数据
      // lbsStore.generateHeatmapData()
      // 初始化热力图
      // lbsStore.initHeatmap()
    }
  }
  catch (error) {
    console.error('高德地图加载失败:', error)
  }
})

onUnmounted(() => {
  // 清理地图实例
  lbsStore.destroyMap()
})
</script>

<template>
  <!-- 高德地图区域 -->
  <div ref="mapContainer" class="map-container">
    <!-- 加载状态显示 -->
    <div v-if="lbsStore.isAMapLoading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner" />
        <p>正在加载地图...</p>
      </div>
    </div>

    <!-- 错误状态显示 -->
    <div v-if="lbsStore.amapError" class="error-overlay">
      <div class="error-message">
        <p>地图加载失败</p>
        <p>请检查网络连接和API Key配置</p>
        <button class="retry-button" @click="lbsStore.loadMapScript()">
          重试
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.loading-overlay,
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  text-align: center;
  color: #e74c3c;
}

.retry-button {
  margin-top: 16px;
  padding: 8px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.retry-button:hover {
  background: #2980b9;
}

.location-info {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
}
</style>
