<script setup lang="ts">
import { useScriptTag } from '@vueuse/core'
import { onMounted, onUnmounted, ref } from 'vue'

// 声明高德地图全局变量
declare global {
  interface Window {
    AMap: any
  }
}

const mapContainer = ref<HTMLDivElement | null>(null)
let map: any = null
let heatmap: any = null
const apiKey = import.meta.env.VITE_AMAP_KEY
const plugins = [
  'AMap.HeatMap',
  'AMap.Scale',
  'AMap.ToolBar',
  'AMap.MapType',
]

// 使用 useScriptTag 加载高德地图主脚本
const { load: loadAMap } = useScriptTag(
  `https://webapi.amap.com/maps?v=2.0&key=${apiKey}&plugin=${plugins.join(',')}`,
)
// 使用 useScriptTag 加载高德地图主脚本
const { load: loadHeatmapData } = useScriptTag(
  `https://a.amap.com/jsapi_demos/static/resource/heatmapData.js`,
)

// 计算加载状态
const isAMapLoading = ref(false)
const amapError = ref<Error | null>(null)

// 初始化地图
async function initMap() {
  if (!mapContainer.value)
    return

  try {
    // 创建高德地图实例
    map = new window.AMap.Map(mapContainer.value, {
      zoom: 10,
      center: [113.3, 23.1], // 地图中心点
      mapStyle: 'amap://styles/normal', // 地图样式
    })

    // 添加地图控件
    map.addControl(new window.AMap.Scale())
    map.addControl(new window.AMap.ToolBar())
    map.addControl(new window.AMap.MapType())
  }
  catch (error) {
    console.error('地图初始化失败:', error)
    amapError.value = error as Error
  }
}

// 初始化热力图数据
async function initHeatmapData() {
  // 示例热力图数据点（可替换为实际风险点数据）
  const heatmapData = [
    // 随机分布的点，无明显规律
    { lng: 113.22, lat: 23.19, count: 57 },
    { lng: 113.41, lat: 23.05, count: 83 },
    { lng: 113.36, lat: 23.27, count: 21 },
    { lng: 113.13, lat: 23.08, count: 99 },
    { lng: 113.44, lat: 23.18, count: 65 },
    { lng: 113.25, lat: 23.31, count: 48 },
    { lng: 113.38, lat: 23.02, count: 72 },
    { lng: 113.19, lat: 23.25, count: 54 },
    { lng: 113.33, lat: 23.14, count: 80 },
    { lng: 113.27, lat: 23.09, count: 36 },
    { lng: 113.46, lat: 23.21, count: 91 },
    { lng: 113.15, lat: 23.29, count: 60 },
    { lng: 113.31, lat: 23.04, count: 77 },
    { lng: 113.23, lat: 23.22, count: 44 },
    { lng: 113.42, lat: 23.11, count: 68 },
    { lng: 113.29, lat: 23.33, count: 53 },
    { lng: 113.17, lat: 23.16, count: 95 },
    { lng: 113.39, lat: 23.07, count: 29 },
    { lng: 113.21, lat: 23.13, count: 87 },
    { lng: 113.35, lat: 23.19, count: 41 },
    { lng: 113.26, lat: 23.28, count: 73 },
    { lng: 113.32, lat: 23.06, count: 58 },
    // 可以添加更多数据点
  ]

  // 创建热力图实例
  heatmap = new window.AMap.HeatMap(map, {
    radius: 30, // 热力图半径
    opacity: [0, 0.8], // 热力图透明度范围
    gradient: {
      0.4: 'rgb(0, 255, 255)',
      0.65: 'rgb(0, 255, 0)',
      0.85: 'rgb(255, 255, 0)',
      1.0: 'rgb(255, 0, 0)',
    },
  })

  // 设置热力图数据
  heatmap.setDataSet({
    data: heatmapData,
    max: 100,
  })
}

// 加载地图脚本
async function loadMapScript() {
  try {
    isAMapLoading.value = true
    amapError.value = null

    await loadAMap()
    await loadHeatmapData()
    // 等待脚本加载完成
    await new Promise((resolve) => {
      const checkAMap = () => {
        if (window.AMap) {
          resolve(true)
        }
        else {
          setTimeout(checkAMap, 100)
        }
      }
      checkAMap()
    })

    isAMapLoading.value = false
  }
  catch (error) {
    isAMapLoading.value = false
    amapError.value = error as Error
    console.error('高德地图脚本加载失败:', error)
  }
}

onMounted(async () => {
  try {
    // 加载高德地图主脚本
    await loadMapScript()

    // 初始化地图
    await initMap()

    // 初始化热力图
    await initHeatmapData()
  }
  catch (error) {
    console.error('高德地图加载失败:', error)
  }
})

onUnmounted(() => {
  // 清理地图实例
  if (map) {
    map.destroy()
    map = null
  }
  if (heatmap) {
    heatmap = null
  }
})
</script>

<template>
  <!-- 高德地图区域 -->
  <div ref="mapContainer" class="map-container">
    <!-- 加载状态显示 -->
    <div v-if="isAMapLoading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner" />
        <p>正在加载地图...</p>
      </div>
    </div>

    <!-- 错误状态显示 -->
    <div v-if="amapError" class="error-overlay">
      <div class="error-message">
        <p>地图加载失败</p>
        <p>请检查网络连接和API Key配置</p>
        <button class="retry-button" @click="loadMapScript()">
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
</style>
