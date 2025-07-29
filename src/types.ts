import type { ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export enum AlertLevelEnum {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum AlertTypeEnum {
  FLOOD = 'flood',
  EARTHQUAKE = 'earthquake',
  FIRE = 'fire',
  WIND = 'wind',
  DROUGHT = 'drought',
  HUMAN = 'human',
  PUBLIC = 'public',
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
