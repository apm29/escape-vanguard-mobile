import type { AlertVO } from '~/types'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { AlertLevelEnum, AlertTypeEnum } from '~/types'

export const useAlertStore = defineStore('alert', () => {
  // 初始化3个不同等级的flood警报
  const alerts = ref<AlertVO[]>([
    {
      id: 1,
      name: '轻度洪水警报',
      description: '河流水位略有上涨，请关注天气变化',
      type: AlertTypeEnum.FLOOD,
      level: AlertLevelEnum.LOW,
      createdAt: new Date().toISOString(),
      shelter: {
        location: {
          latitude: 39.9042,
          longitude: 116.4074,
        },
      },
      disaster: {
        heatmap: [
          {
            latitude: 39.9042,
            longitude: 116.4074,
            intensity: 0.3,
          },
          {
            latitude: 39.9142,
            longitude: 116.4174,
            intensity: 0.2,
          },
        ],
      },
      community: {
        posts: [
          {
            id: 1,
            title: '河流水位监测',
            img: '/images/flood-low.jpg',
            content: '当前河流水位正常，但需要持续关注',
            comments: 5,
            shares: 2,
          },
        ],
      },
    },
    {
      id: 2,
      name: '中度洪水警报',
      description: '河流水位明显上涨，部分低洼地区可能受影响',
      type: AlertTypeEnum.FLOOD,
      level: AlertLevelEnum.MEDIUM,
      createdAt: new Date().toISOString(),
      shelter: {
        location: {
          latitude: 39.9042,
          longitude: 116.4074,
        },
      },
      disaster: {
        heatmap: [
          {
            latitude: 39.9042,
            longitude: 116.4074,
            intensity: 0.6,
          },
          {
            latitude: 39.9142,
            longitude: 116.4174,
            intensity: 0.5,
          },
          {
            latitude: 39.8942,
            longitude: 116.3974,
            intensity: 0.4,
          },
        ],
      },
      community: {
        posts: [
          {
            id: 2,
            title: '洪水预警通知',
            img: '/images/flood-medium.jpg',
            content: '请低洼地区居民做好防护准备',
            comments: 12,
            shares: 8,
          },
          {
            id: 3,
            title: '救援物资准备',
            img: '/images/rescue-supplies.jpg',
            content: '社区已准备救援物资，有需要请联系',
            comments: 8,
            shares: 15,
          },
        ],
      },
    },
    {
      id: 3,
      name: '重度洪水警报',
      description: '河流水位严重超警戒线，请立即撤离危险区域',
      type: AlertTypeEnum.FLOOD,
      level: AlertLevelEnum.HIGH,
      createdAt: new Date().toISOString(),
      shelter: {
        location: {
          latitude: 39.9042,
          longitude: 116.4074,
        },
      },
      disaster: {
        heatmap: [
          {
            latitude: 39.9042,
            longitude: 116.4074,
            intensity: 0.9,
          },
          {
            latitude: 39.9142,
            longitude: 116.4174,
            intensity: 0.8,
          },
          {
            latitude: 39.8942,
            longitude: 116.3974,
            intensity: 0.7,
          },
          {
            latitude: 39.9242,
            longitude: 116.4274,
            intensity: 0.6,
          },
        ],
      },
      community: {
        posts: [
          {
            id: 4,
            title: '紧急撤离通知',
            img: '/images/flood-high.jpg',
            content: '洪水即将到达，请立即撤离到安全区域',
            comments: 25,
            shares: 45,
          },
          {
            id: 5,
            title: '救援队已就位',
            img: '/images/rescue-team.jpg',
            content: '专业救援队已到达现场，请保持冷静',
            comments: 18,
            shares: 32,
          },
          {
            id: 6,
            title: '临时避难所开放',
            img: '/images/shelter.jpg',
            content: '临时避难所已开放，地址：市中心体育馆',
            comments: 15,
            shares: 28,
          },
        ],
      },
    },
  ])

  const alert = ref<AlertVO>(unref(alerts)[0])
  const setAlert = (_alert: AlertVO) => {
    alert.value = _alert
  }
  return {
    alerts,
    alert: readonly(alert),
    setAlert,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAlertStore as any, import.meta.hot))
