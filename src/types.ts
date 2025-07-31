import type { ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export enum AlertLevelEnum {
  LOW = '低',
  MEDIUM = '中',
  HIGH = '高',
}

export enum AlertTypeEnum {
  FLOOD = '洪水',
  EARTHQUAKE = '地震',
  FIRE = '火灾',
  WIND = '台风',
  DROUGHT = '干旱',
  HUMAN = '人祸',
  PUBLIC = '公共',
}

export interface AlertVO {
  id: number
  name: string
  description: string
  type: AlertTypeEnum
  level: AlertLevelEnum
  createdAt: string
  shelter: {
    location: {
      latitude: number
      longitude: number
    }
  }
  disaster: {
    heatmap: {
      latitude: number
      longitude: number
      intensity: number
    }[]
    distance: string
    time: string
  }

  community: {
    posts: {
      id: number
      title: string
      img: string
      content: string
      comments: number
      shares: number
    }[]
  }
}
