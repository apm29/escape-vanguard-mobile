<script setup lang="ts">
import { useScriptTag } from '@vueuse/core'
import { onMounted, onUnmounted, ref } from 'vue'
import { useToast } from '~/composables/useToast'

// 声明高德地图全局变量
declare global {
  interface Window {
    AMap: any
    _AMapSecurityConfig: any
    openNavigation: any
  }
}

const securityKey = import.meta.env.VITE_AMAP_SAFE_KEY
window._AMapSecurityConfig = {
  securityJsCode: securityKey,
}

const mapContainer = ref<HTMLDivElement | null>(null)
let map: any = null
let heatmap: any = null
let driving: any = null
const apiKey = import.meta.env.VITE_AMAP_KEY
const plugins = [
  'AMap.HeatMap',
  'AMap.Scale',
  'AMap.ToolBar',
  'AMap.MapType',
  'AMap.Driving',
  'AMap.Geolocation',
  'AMap.Adaptor',
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

// 用户当前位置
const userLocation = ref<{ latitude: number, longitude: number } | null>(null)

// 使用toast
const toast = useToast()

// 初始化地图
async function initMap() {
  if (!mapContainer.value)
    return
  console.error(window._AMapSecurityConfig)

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

    // 初始化定位功能
    await initGeolocation()
  }
  catch (error) {
    console.error('地图初始化失败:', error)
    amapError.value = error as Error
  }
}

// 初始化定位功能
async function initGeolocation() {
  try {
    const geolocation = new window.AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000,
      buttonPosition: 'RB',
      buttonOffset: new window.AMap.Pixel(10, 20),
      zoomToAccuracy: true,
    })

    map.addControl(geolocation)

    // 获取当前位置
    geolocation.getCurrentPosition((status: string, result: any) => {
      if (status === 'complete') {
        userLocation.value = {
          latitude: result.position.lat,
          longitude: result.position.lng,
        }
        console.warn('用户位置:', userLocation.value)
      }
      else {
        console.error('获取位置失败:', result.message)
      }
    })
  }
  catch (error) {
    console.error('定位初始化失败:', error)
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

// 导航到避难所
async function navigateToShelter(shelterLocation: { latitude: number, longitude: number }) {
  if (!userLocation.value) {
    // 如果没有用户位置，尝试重新获取
    await initGeolocation()
    if (!userLocation.value) {
      toast.error('无法获取您的位置，请检查定位权限')
      return
    }
  }

  try {
    // 清除之前的路线
    if (driving) {
      map.remove(driving)
    }

    // 创建驾车导航实例
    driving = new window.AMap.Driving({
      map,
      policy: window.AMap.DrivingPolicy.LEAST_TIME, // 最快路线
    })

    // 规划路线
    driving.search(
      [userLocation.value!.longitude, userLocation.value!.latitude],
      [shelterLocation.longitude, shelterLocation.latitude],
      (status: string, result: any) => {
        if (status === 'complete') {
          console.warn('路线规划成功:', result)

          // 显示路线信息
          const route = result.routes[0]
          const distance = (route.distance / 1000).toFixed(1) // 转换为公里
          const duration = Math.ceil(route.time / 60) // 转换为分钟

          // 创建信息窗体
          const infoWindow = new window.AMap.InfoWindow({
            content: `
              <div style="padding: 10px;">
                <h4>导航到避难所</h4>
                <p>距离: ${distance}公里</p>
                <p>预计时间: ${duration}分钟</p>
                <button onclick="window.openNavigation()" style="background: #d32f2f; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                  开始导航
                </button>
              </div>
            `,
            offset: new window.AMap.Pixel(0, -30),
          })

          // 在地图上显示信息窗体
          infoWindow.open(map, [shelterLocation.longitude, shelterLocation.latitude])

          // 将导航功能暴露到全局
          window.openNavigation = () => {
            // 使用高德地图APP或网页版进行导航
            const url = `https://uri.amap.com/navigation?from=${userLocation.value?.longitude},${userLocation.value?.latitude},当前位置&to=${shelterLocation.longitude},${shelterLocation.latitude},避难所&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`
            window.open(url, '_blank')
          }
        }
        else {
          console.error('路线规划失败:', result)
          toast.error('路线规划失败，请稍后重试')
        }
      },
    )
  }
  catch (error) {
    console.error('导航失败:', error)
    toast.error('导航功能暂时不可用，请稍后重试')
  }
}

// 暴露导航方法给父组件
defineExpose({
  navigateToShelter,
})

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
  if (driving) {
    driving = null
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
