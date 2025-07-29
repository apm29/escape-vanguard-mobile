<script>
export default {
  name: 'ExtendedImage',
  props: {
    // 图片源
    src: {
      type: String,
      required: true,
    },
    // 图片描述
    alt: {
      type: String,
      default: '',
    },
    // 容器类名
    containerClass: {
      type: String,
      default: '',
    },
    // 图片类名
    imageClass: {
      type: String,
      default: '',
    },
    // 图片样式
    imageStyle: {
      type: Object,
      default: () => ({}),
    },
    // 加载文本
    loadingText: {
      type: String,
      default: '加载中...',
    },
    // 错误文本
    errorText: {
      type: String,
      default: '图片加载失败',
    },
    // 是否懒加载
    lazy: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: true,
      error: false,
    }
  },
  mounted() {
    if (this.lazy) {
      this.setupLazyLoading()
    }
  },
  methods: {
    handleLoad() {
      this.loading = false
      this.error = false
      this.$emit('load')
    },
    handleError() {
      this.loading = false
      this.error = true
      this.$emit('error')
    },
    handleClick(event) {
      this.$emit('click', event)
    },
    setupLazyLoading() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 当图片进入视口时开始加载
            this.loading = true
            observer.unobserve(entry.target)
          }
        })
      })

      observer.observe(this.$el)
    },
  },
}
</script>

<template>
  <div class="image-container" :class="containerClass">
    <!-- 加载状态 -->
    <div v-if="loading" class="image-loading">
      <div class="loading-spinner" />
      <span v-if="loadingText" class="loading-text">{{ loadingText }}</span>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="image-error">
      <div class="error-icon">
        <div class="i-carbon:image" />
      </div>
      <span v-if="errorText" class="error-text">{{ errorText }}</span>
    </div>

    <!-- 图片 -->
    <img
      v-show="!loading && !error"
      :src="src"
      :alt="alt"
      :class="imageClass"
      :style="imageStyle"
      @load="handleLoad"
      @error="handleError"
      @click="handleClick"
    >
  </div>
</template>

<style scoped>
.image-container {
  position: relative;
  display: inline-block;
  overflow: hidden;
}

.image-loading,
.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 120px;
  background-color: #f5f5f5;
  color: #999;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #e0e0e0;
  border-top: 2px solid #007aff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 8px;
}

.loading-text,
.error-text {
  font-size: 12px;
  color: #999;
}

.error-icon {
  font-size: 24px;
  margin-bottom: 8px;
  opacity: 0.6;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
  transition: opacity 0.3s ease;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .image-loading,
  .image-error {
    min-height: 100px;
  }

  .loading-spinner {
    width: 20px;
    height: 20px;
  }

  .error-icon {
    font-size: 20px;
  }
}
</style>
