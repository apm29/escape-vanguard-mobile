import { useScriptTag } from '@vueuse/core'
import { defineStore } from 'pinia'

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
  id: string
}

// 热力图数据点接口
interface HeatmapPoint {
  lng: number
  lat: number
  count: number
}

interface Contact {
  name: string
  phone: string
  location: Location
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
  const userLocation = ref<Location>({
    latitude: 24.719306,
    longitude: 118.138451,
  })

  const contacts = ref<Contact[]>([
    {
      name: '弟弟',
      phone: '1234567890',
      location: {
        latitude: 24.721244,
        longitude: 118.128669,
      },
    },
    {
      name: '妈妈',
      phone: '1234567890',
      location: {
        latitude: 24.730044,
        longitude: 118.133069,
      },
    },
  ])

  // 多个避难所
  const shelters = ref<Shelter[]>([
    {
      id: 'chengzineili',
      name: '城仔内里',
      distance: 2.5,
      location: {
        latitude: 24.730744,
        longitude: 118.138569,
      },
    },
    {
      id: 'tingxizhongxue',
      name: '汀溪中学',
      distance: 2.0,
      location: {
        latitude: 24.725123,
        longitude: 118.145678,
      },
    },
    {
      id: 'aoxizhongxue',
      name: '澳溪中学',
      distance: 2.5,
      location: {
        latitude: 24.718456,
        longitude: 118.132345,
      },
    },
    {
      id: 'shuangxiliu',
      name: '双溪流公园',
      distance: 1,
      location: {
        latitude: 24.735789,
        longitude: 118.141234,
      },
    },
  ])

  // 当前选中的避难所索引
  const currentShelterIndex = ref(0)

  // 计算属性：当前选中的避难所
  const currentShelter = computed(() => shelters.value[currentShelterIndex.value])

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

  // 更新避难所标记图标
  function updateShelterMarkers() {
    // 由于使用默认图标，不需要更新图标
    // 这个函数保留用于未来可能的扩展
    console.warn('当前选中的避难所:', currentShelter.value?.name)
  }

  // 初始化地图
  async function initMap(container: HTMLDivElement) {
    if (!container)
      return
    const center = [
      (unref(userLocation).longitude + unref(currentShelter).location.longitude) / 2,
      (unref(userLocation).latitude + unref(currentShelter).location.latitude) / 2,
    ]
    const userLngLat = new window.AMap.LngLat(unref(userLocation).longitude, unref(userLocation).latitude)

    try {
      // 创建高德地图实例
      map.value = new window.AMap.Map(container, {
        zoom: 14,
        center, // 地图中心点
        mapStyle: 'amap://styles/normal', // 地图样式
        resizeEnable: true,
      })

      // 添加地图控件
      // map.value.addControl(new window.AMap.Scale())
      // map.value.addControl(new window.AMap.ToolBar())
      // map.value.addControl(new window.AMap.MapType())

      isMapInitialized.value = true

      // 初始化定位功能
      // await initGeolocation()

      // 添加用户位置标记
      const userMarker = new window.AMap.Marker({
        position: userLngLat,
        offset: new window.AMap.Pixel(0, 0),
        title: '当前位置',
      })
      map.value.add(userMarker)

      // 为所有联系人创建标记
      contacts.value.forEach((contact, _index) => {
        const contactLngLat = new window.AMap.LngLat(contact.location.longitude, contact.location.latitude)
        const contactMarker = new window.AMap.Marker({
          position: contactLngLat,
          title: contact.name,
          icon: new window.AMap.Icon({
            // 图标尺寸
            size: new window.AMap.Size(25, 34),
            // 图标的取图地址
            image: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 32 32'%3E%3C!-- Icon from Carbon by IBM - undefined --%3E%3Cpath fill='%23ff3333' d='M20 19h-2v-2h-4v2h-2v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2zm-4-5a3 3 0 1 1 3-3a3.003 3.003 0 0 1-3 3m0-4a1 1 0 1 0 1 1a1 1 0 0 0-1-1'/%3E%3Cpath fill='%23ff3333' d='m16 30l-8.436-9.949a35 35 0 0 1-.348-.451A10.9 10.9 0 0 1 5 13a11 11 0 0 1 22 0a10.9 10.9 0 0 1-2.215 6.597l-.001.003s-.3.394-.345.447ZM8.813 18.395s.233.308.286.374L16 26.908l6.91-8.15c.044-.055.278-.365.279-.366A8.9 8.9 0 0 0 25 13a9 9 0 0 0-18 0a8.9 8.9 0 0 0 1.813 5.395'/%3E%3C/svg%3E`,
            // 图标所用图片大小
            imageSize: new window.AMap.Size(25, 34),
            // 图标取图偏移量
            imageOffset: new window.AMap.Pixel(0, 0),
          }),
          offset: new window.AMap.Pixel(-13, -30),
        })
        contactMarker.on('click', () => {
          console.warn('点击联系人:', contact.name)

          // 创建信息窗体显示联系人姓名
          const infoWindow = new window.AMap.InfoWindow({
            content: `
              <div style="padding: 10px;width:12rem; font-size: 14px; color: #333;z-index: 1000;">
                <h4 style="margin: 0 0 8px 0; color: #1976d2;">${contact.name}</h4>
                <p style="margin: 0; color: #666;">联系电话: ${contact.phone}</p>
              </div>
            `,
            width: 200,
            height: 80,
            offset: new window.AMap.Pixel(0, -30),
          })

          // 在地图上显示信息窗体
          infoWindow.open(map.value, [contact.location.longitude, contact.location.latitude])
        })
        map.value.add(contactMarker)
      })

      // 为所有避难所创建标记
      shelters.value.forEach((shelter, index) => {
        const shelterLngLat = new window.AMap.LngLat(shelter.location.longitude, shelter.location.latitude)
        const shelterMarker = new window.AMap.Marker({
          position: shelterLngLat,
          // offset: new window.AMap.Pixel(0, 0),
          title: shelter.name,
          // icon: `//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-${index + 1}.png`,
          offset: new window.AMap.Pixel(-13, -30),
          icon: new window.AMap.Icon({
            // 图标尺寸
            size: new window.AMap.Size(25, 34),
            // 图标的取图地址
            image: `//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-${index + 1}.png`,
            // 图标所用图片大小
            imageSize: new window.AMap.Size(25, 34),
            // 图标取图偏移量
            imageOffset: new window.AMap.Pixel(0, 0),
          }),
        })

        // 添加点击事件
        shelterMarker.on('click', () => {
          // 切换当前选中的避难所
          currentShelterIndex.value = index

          // 更新所有标记的图标
          updateShelterMarkers()

          // 创建信息窗体显示联系人姓名
          const infoWindow = new window.AMap.InfoWindow({
            content: `
              <div style="padding: 10px; width:12rem;font-size: 14px; color: #333;z-index: 1000;">
                <h4 style="margin: 0 0 8px 0; color: #1976d2;">${shelter.name}</h4>
                <p style="margin: 0; color: #666;">距离: ${shelter.distance}公里</p>
              </div>
            `,
            width: 200,
            height: 80,
            offset: new window.AMap.Pixel(0, -30),
          })

          // 在地图上显示信息窗体
          infoWindow.open(map.value, [shelter.location.longitude, shelter.location.latitude])

          // 重新规划路线到新选中的避难所
          planRouteToShelter()

          console.warn('切换到避难所:', shelter.name)
        })

        map.value.add(shelterMarker)
      })

      map.value.setFitView(null, false, [50, 60, 50, 60])
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
        buttonPosition: 'TL',
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
              id: `shelter${Math.random().toString(36).substring(2, 15)}`, // 生成一个随机的ID
            }

            // 将找到的避难所添加到 shelters 数组中
            shelters.value.push(shelter)
            currentShelterIndex.value = shelters.value.length - 1 // 更新当前选中的避难所索引
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
              id: `shelter${Math.random().toString(36).substring(2, 15)}`, // 生成一个随机的ID
            }
            shelters.value.push(defaultShelter)
            currentShelterIndex.value = shelters.value.length - 1 // 更新当前选中的避难所索引
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

    const data: HeatmapPoint[] = [
      {
        lng: 118.138451,
        lat: 24.720306,
        count: 100,
      },
      {
        lng: 118.149133,
        lat: 24.719868,
        count: 63,
      },
      {
        lng: 118.128071,
        lat: 24.732802,
        count: 104,
      },
      {
        lng: 118.129571,
        lat: 24.732002,
        count: 95,
      },
      {
        lng: 118.150553,
        lat: 24.723337,
        count: 79,
      },
      {
        lng: 118.151333,
        lat: 24.725523,
        count: 24,
      },
      {
        lng: 118.144076,
        lat: 24.727856,
        count: 70,
      },
      {
        lng: 118.125149,
        lat: 24.726738,
        count: 21,
      },
      {
        lng: 118.138451,
        lat: 24.720681,
        count: 55,
      },
      {
        lng: 118.133583,
        lat: 24.736380,
        count: 78,
      },
      {
        lng: 118.135163,
        lat: 24.731424,
        count: 70,
      },
      {
        lng: 118.151731,
        lat: 24.728268,
        count: 23,
      },
    ]

    // // 在用户位置周围生成随机的灾害热力图数据
    // // 生成中心点
    // data.push({
    //   lng: 118.138451,
    //   lat: 24.719306,
    //   count: 100,
    // })
    // // 再生成一些随机的热力点
    // for (let i = 0; i < 10; i++) {
    //   const randomLng = 118.138451 + (Math.random() - 0.5) * 0.03 // 经度随机偏移
    //   const randomLat = 24.719306 + (Math.random() - 0.5) * 0.03 // 纬度随机偏移
    //   const randomCount = Math.floor(Math.random() * 80) + 20 // 20~100
    //   data.push({
    //     lng: randomLng,
    //     lat: randomLat,
    //     count: randomCount,
    //   })
    // }

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
  async function planRouteToShelter() {
    if (!userLocation.value || !currentShelter.value) {
      return Promise.reject(new Error('用户位置或避难所位置未找到'))
    }

    try {
      // 清除之前的路线
      if (driving.value) {
        console.warn('清除之前的路线', driving.value)
        driving.value.clear()
        map.value.remove(driving.value)
        driving.value = null
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
          [currentShelter.value!.location.longitude, currentShelter.value!.location.latitude],
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
                <div style="width: 32rem;padding: 10px;font-size: 12px; color: #3f3f3f; width: 200px;">
                  <h4>导航到避难所: ${currentShelter.value!.name}</h4>
                  <h6>距离: ${distance}公里</h6>
                  <h6>预计时间: ${duration}分钟</h6>
                  <button onclick="window.openNavigation()" style="background: #d32f2f; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                    开始导航
                  </button>
                </div>
              `,
                width: 300, // 设置固定宽度
                height: 120, // 设置固定高度
                offset: new window.AMap.Pixel(0, -30), // 设置偏移量
              })
              console.warn(infoWindow.getSize())

              // 在地图上显示信息窗体
              // infoWindow.open(map.value, [currentShelter.value!.location.longitude, currentShelter.value!.location.latitude])

              // 将导航功能暴露到全局
              window.openNavigation = () => {
                // 使用高德地图APP或网页版进行导航
                const url = `https://uri.amap.com/navigation?from=${userLocation.value?.longitude},${userLocation.value?.latitude},当前位置&to=${currentShelter.value!.location.longitude},${currentShelter.value!.location.latitude},${currentShelter.value!.name}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`
                window.open(url, '_blank')

                // 使用地图组件导航
                // https://m.amap.com/navi/?start=116.403124,39.940693&dest=116.481488,39.990464&destName=%E4%B8%80%E6%9D%A1%E9%A9%BE%E8%BD%A6%E8%B7%AF%E7%BA%BF&key=d3f5d8b3b05231fa6a11375492310e3a&jscode=%EF%BC%88%E6%82%A8%E7%9A%84%E5%AE%89%E5%85%A8%E5%AF%86%E9%92%A5%EF%BC%89&platform=mobile
                // const url2 = `https://m.amap.com/navi/?start=${userLocation.value?.longitude},${userLocation.value?.latitude},当前位置&dest=${currentShelter.value!.location.longitude},${currentShelter.value!.location.latitude},${currentShelter.value!.name}&destName=${currentShelter.value!.name}&naviBy=car&key=${apiKey}&jscode=${securityKey}`
                // window.open(url2, '_blank')
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

  function navigateToShelter() {
    // 使用高德地图APP或网页版进行导航
    const url = `https://uri.amap.com/navigation?from=${userLocation.value?.longitude},${userLocation.value?.latitude},当前位置&to=${currentShelter.value!.location.longitude},${currentShelter.value!.location.latitude},${currentShelter.value!.name}&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0`
    window.open(url, '_blank')
  }

  // 切换当前选中的避难所
  function switchShelter(index: number) {
    if (index >= 0 && index < shelters.value.length) {
      currentShelterIndex.value = index

      // 更新标记图标
      updateShelterMarkers()

      // 清除之前的路线
      if (driving.value) {
        map.value.remove(driving.value)
        driving.value = null
      }

      // 重新规划路线
      planRouteToShelter()

      console.warn('切换到避难所:', shelters.value[index].name)
    }
  }

  return {
    // 状态
    map: readonly(map),
    heatmap: readonly(heatmap),
    isAMapLoading: readonly(isAMapLoading),
    amapError: readonly(amapError),
    isMapInitialized: readonly(isMapInitialized),
    userLocation: readonly(userLocation),
    shelters: readonly(shelters),
    currentShelterIndex: readonly(currentShelterIndex),
    currentShelter: readonly(currentShelter),
    heatmapData: readonly(heatmapData),

    // 方法
    loadMapScript,
    initMap,
    initGeolocation,
    searchNearestShelter,
    generateHeatmapData,
    initHeatmap,
    planRouteToShelter,
    navigateToShelter,
    destroyMap,
    refreshLocation,
    updateShelterMarkers,
    switchShelter,
  }
})

// if (import.meta.hot)
//   import.meta.hot.accept(acceptHMRUpdate(useLbsStore as any, import.meta.hot))
