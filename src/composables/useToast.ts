import { inject } from 'vue'

interface ToastAPI {
  success: (message: string, title?: string, duration?: number) => string
  error: (message: string, title?: string, duration?: number) => string
  warning: (message: string, title?: string, duration?: number) => string
  info: (message: string, title?: string, duration?: number) => string
  remove: (id: string) => void
  clear: () => void
}

export function useToast(): ToastAPI {
  const toast = inject<ToastAPI>('toast')
  
  if (!toast) {
    // 如果toast provider不可用，提供fallback实现
    console.warn('Toast provider not found. Using fallback implementation.')
    return {
      success: (message: string) => {
        console.log('Toast (success):', message)
        return ''
      },
      error: (message: string) => {
        console.error('Toast (error):', message)
        return ''
      },
      warning: (message: string) => {
        console.warn('Toast (warning):', message)
        return ''
      },
      info: (message: string) => {
        console.info('Toast (info):', message)
        return ''
      },
      remove: () => {},
      clear: () => {},
    }
  }
  
  return toast
} 