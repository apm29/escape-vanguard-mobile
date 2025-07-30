import type { AlertVO } from '~/types'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { AlertLevelEnum, AlertTypeEnum } from '~/types'
import dayjs from 'dayjs'

export const useAlertStore = defineStore('alert', () => {
  // 初始化3个不同等级的flood警报
  const alerts = ref<AlertVO[]>([
    {
      id: 1,
      name: '轻度洪水警报',
      description: '河流水位略有上涨，请关注天气变化',
      type: AlertTypeEnum.FLOOD,
      level: AlertLevelEnum.LOW,
      createdAt: dayjs().format('YYYY/MM/DD HH:mm:ss'),
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
        distance: "2.5km",
        time: "10分钟",
      },
      community: {
        posts: [
          {
            id: 1,
            title: '河流水位监测',
            img: 'https://images.unsplash.com/photo-1604275689235-fdc521556c16?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
      createdAt: dayjs().format('YYYY/MM/DD HH:mm:ss'),
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
        distance: "2.5km",
        time: "10分钟",
      },
      community: {
        posts: [
          {
            id: 2,
            title: '洪水预警通知',
            img: 'https://images.unsplash.com/photo-1534862262637-373c120dcbcc?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            content: '请低洼地区居民做好防护准备',
            comments: 12,
            shares: 8,
          },
          {
            id: 3,
            title: '救援物资准备',
            img: 'https://images.unsplash.com/photo-1716016435588-f5db7da707d5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
      createdAt: dayjs().format('YYYY/MM/DD HH:mm:ss'),
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
        distance: "2.5km",
        time: "10分钟",
      },
      community: {
        posts: [
          {
            id: 4,
            title: '紧急撤离通知',
            img: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
            img: 'https://images.unsplash.com/photo-1519406596751-0a3ccc4937fe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHNjaG9vbHxlbnwwfHwwfHx8MA%3D%3D',
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

  // 新增API：添加帖子到当前alert的community
  const addPostToCommunity = async (post: {
    title: string
    img: string
    content: string
  }) => {
    try {
      // 创建新的帖子对象
      const newPost = {
        id: Date.now(),
        title: post.title,
        img: post.img,
        content: post.content,
        comments: 0,
        shares: 0,
      }

      // 更新当前alert的community posts
      const updatedAlert = {
        ...alert.value,
        community: {
          ...alert.value.community,
          posts: [...alert.value.community.posts, newPost]
        }
      }

      // 更新store中的alert
      alert.value = updatedAlert

      // 同时更新alerts数组中对应的alert
      const alertIndex = alerts.value.findIndex(a => a.id === alert.value.id)
      if (alertIndex !== -1) {
        alerts.value[alertIndex] = updatedAlert
      }

      // 这里可以添加实际的API调用
      // await api.addPostToAlert(alert.value.id, newPost)

      return newPost
    } catch (error) {
      console.error('添加帖子失败:', error)
      throw error
    }
  }

  return {
    alerts,
    alert: readonly(alert),
    setAlert,
    addPostToCommunity,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAlertStore as any, import.meta.hot))
