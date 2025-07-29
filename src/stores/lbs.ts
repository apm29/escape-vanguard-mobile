import { useScriptTag } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'

// 声明高德地图全局变量
declare global {
  interface Window {
    AMap: any
    _AMapSecurityConfig: any
    openNavigation: any
  }
}

// 位置接口
interface Location {
  latitude: number
  longitude: number
}

// 避难所接口
interface Shelter {
  location: Location
  name: string
  distance: number
}

// 热力图数据点接口
interface HeatmapPoint {
  lng: number
  lat: number
  count: number
}

export const useLbsStore = defineStore('lbs', () => {
  // 地图相关状态
  const map = ref<any>(null)
  const heatmap = ref<any>(null)
  const driving = ref<any>(null)
  const isAMapLoading = ref(false)
  const amapError = ref<Error | null>(null)
  const isMapInitialized = ref(false)

  // 位置相关状态
  const userLocation = ref<Location | null>(null)
  const nearestShelter = ref<Shelter | null>(null)
  const heatmapData = ref<HeatmapPoint[]>([])

  // API配置
  const apiKey = import.meta.env.VITE_AMAP_KEY
  const securityKey = import.meta.env.VITE_AMAP_SAFE_KEY
  const plugins = [
    'AMap.HeatMap',
    'AMap.Scale',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.Driving',
    'AMap.Geolocation',
    'AMap.Adaptor',
    'AMap.PlaceSearch',
  ]

  // 设置安全配置
  window._AMapSecurityConfig = {
    securityJsCode: securityKey,
  }

  // 使用 useScriptTag 加载高德地图主脚本
  const { load: loadAMap } = useScriptTag(
    `https://webapi.amap.com/maps?v=2.0&key=${apiKey}&plugin=${plugins.join(',')}`,
  )

  // 加载地图脚本
  async function loadMapScript() {
    try {
      isAMapLoading.value = true
      amapError.value = null

      await loadAMap()

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

  // 初始化地图
  async function initMap(container: HTMLDivElement) {
    if (!container)
      return

    try {
      // 创建高德地图实例
      map.value = new window.AMap.Map(container, {
        zoom: 10,
        center: [113.3, 23.1], // 地图中心点
        mapStyle: 'amap://styles/normal', // 地图样式
      })

      // 添加地图控件
      map.value.addControl(new window.AMap.Scale())
      map.value.addControl(new window.AMap.ToolBar())
      // map.value.addControl(new window.AMap.MapType())

      isMapInitialized.value = true

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

      map.value.addControl(geolocation)

      return new Promise((resolve, reject) => {
        // 获取当前位置
        geolocation.getCurrentPosition((status: string, result: any) => {
          if (status === 'complete') {
            userLocation.value = {
              latitude: result.position.lat,
              longitude: result.position.lng,
            }
            console.warn('用户位置:', userLocation.value)
            resolve(userLocation.value)
          }
          else {
            console.error('获取位置失败:', result.message)
            reject(new Error(result.message))
          }
        })
      })
    }
    catch (error) {
      console.error('定位初始化失败:', error)
    }
  }

  // 搜索最近的避难所（学校）
  async function searchNearestShelter(): Promise<Shelter | null> {
    if (!userLocation.value || !map.value)
      return null

    return new Promise((resolve, reject) => {
      try {
        const placeSearch = new window.AMap.PlaceSearch({
          type: '学校',
          pageSize: 10,
          pageIndex: 1,
        })

        placeSearch.searchNearBy('学校', [userLocation.value!.longitude, userLocation.value!.latitude], 5000, (status: string, result: any) => {
          if (status === 'complete' && result.poiList.pois.length > 0) {
            // 找到最近的学校
            const nearestSchool = result.poiList.pois[0]

            const shelter: Shelter = {
              location: {
                latitude: nearestSchool.location.lat,
                longitude: nearestSchool.location.lng,
              },
              name: nearestSchool.name,
              distance: nearestSchool.distance,
            }

            nearestShelter.value = shelter
            console.warn('找到最近避难所:', shelter)
            resolve(shelter)
          }
          else {
            console.error('未找到附近的学校')
            // 使用默认位置作为避难所
            const defaultShelter: Shelter = {
              location: {
                latitude: userLocation.value!.latitude + 0.01,
                longitude: userLocation.value!.longitude + 0.01,
              },
              name: '默认避难所',
              distance: 1000,
            }
            nearestShelter.value = defaultShelter
            resolve(defaultShelter)
          }
        })
      }
      catch (error) {
        console.error('搜索避难所失败:', error)
        reject(error)
      }
    })
  }

  // 生成热力图数据
  function generateHeatmapData() {
    if (!userLocation.value)
      return

    const data: HeatmapPoint[] = []
    const centerLng = userLocation.value.longitude
    const centerLat = userLocation.value.latitude

    // 在用户位置周围生成随机的灾害热力图数据
    for (let i = 0; i < 250; i++) {
      // 在用户位置周围2公里范围内随机生成点
      const randomLng = centerLng + (Math.random() - 0.5) * 0.02 // 约2公里范围
      const randomLat = centerLat + (Math.random() - 0.5) * 0.02
      const count = Math.floor(Math.random() * 100) + 10 // 10-110的随机强度

      data.push({
        lng: randomLng,
        lat: randomLat,
        count,
      })
    }

    heatmapData.value = data
    console.warn('生成热力图数据:', data.length, '个点')
  }

  // 初始化热力图
  function initHeatmap() {
    if (!map.value || !heatmapData.value.length)
      return

    try {
      // 创建热力图实例
      heatmap.value = new window.AMap.HeatMap(map.value, {
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
      heatmap.value.setDataSet({
        data: heatmapData.value,
        max: 100,
      })
    }
    catch (error) {
      console.error('热力图初始化失败:', error)
    }
  }

  // 导航到避难所
  async function navigateToShelter() {
    if (!userLocation.value || !nearestShelter.value) {
      return Promise.reject(new Error('用户位置或避难所位置未找到'))
    }

    try {
      // 清除之前的路线
      if (driving.value) {
        map.value.remove(driving.value)
      }

      // 创建驾车导航实例
      driving.value = new window.AMap.Driving({
        map: map.value,
        policy: window.AMap.DrivingPolicy.LEAST_TIME, // 最快路线
      })

      return new Promise((resolve, reject) => {
        // 规划路线
        driving.value.search(
          [userLocation.value!.longitude, userLocation.value!.latitude],
          [nearestShelter.value!.location.longitude, nearestShelter.value!.location.latitude],
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
                <div style="padding: 10px;font-size: 12px;">
                  <h4>导航到避难所: ${nearestShelter.value!.name}</h4>
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
              infoWindow.open(map.value, [nearestShelter.value!.location.longitude, nearestShelter.value!.location.latitude])

              // 将导航功能暴露到全局
              window.openNavigation = () => {
                // 使用高德地图APP或网页版进行导航
                const url = `https://uri.amap.com/navigation?from=${userLocation.value?.longitude},${userLocation.value?.latitude},当前位置&to=${nearestShelter.value!.location.longitude},${nearestShelter.value!.location.latitude},${nearestShelter.value!.name}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`
                window.open(url, '_blank')
              }

              resolve(result)
            }
            else {
              console.error('路线规划失败:', result)
              reject(new Error('路线规划失败'))
            }
          },
        )
      })
    }
    catch (error) {
      console.error('导航失败:', error)
      return Promise.reject(error)
    }
  }

  // 清理地图资源
  function destroyMap() {
    if (map.value) {
      map.value.destroy()
      map.value = null
    }
    if (heatmap.value) {
      heatmap.value = null
    }
    if (driving.value) {
      driving.value = null
    }
    isMapInitialized.value = false
  }

  // 重新获取位置
  async function refreshLocation() {
    await initGeolocation()
  }

  return {
    // 状态
    map: readonly(map),
    heatmap: readonly(heatmap),
    isAMapLoading: readonly(isAMapLoading),
    amapError: readonly(amapError),
    isMapInitialized: readonly(isMapInitialized),
    userLocation: readonly(userLocation),
    nearestShelter: readonly(nearestShelter),
    heatmapData: readonly(heatmapData),

    // 方法
    loadMapScript,
    initMap,
    initGeolocation,
    searchNearestShelter,
    generateHeatmapData,
    initHeatmap,
    navigateToShelter,
    destroyMap,
    refreshLocation,
  }
})

// if (import.meta.hot)
//   import.meta.hot.accept(acceptHMRUpdate(useLbsStore as any, import.meta.hot))

