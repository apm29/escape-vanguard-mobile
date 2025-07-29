<script setup lang="ts">
import ExtendedImage from '~/components/ui/ExtendedImage.vue'
import { useAlertStore } from '~/stores/alert'
import { AlertLevelEnum } from '~/types'

defineOptions({
  name: 'CommunityPage',
})

const { t } = useI18n()
useHead({
  title: () => t('button.home'),
})

const alertStore = useAlertStore()
const alert = computed(() => alertStore.alert)

// 根据警报等级获取头部样式
function getHeaderClass(level: AlertLevelEnum) {
  switch (level) {
    case AlertLevelEnum.LOW:
      return 'blue'
    case AlertLevelEnum.MEDIUM:
      return 'orange'
    case AlertLevelEnum.HIGH:
      return 'red'
    default:
      return 'blue'
  }
}

// 获取社区帖子数据
function getCommunityPosts() {
  // 根据警报数据返回社区帖子
  return alert.value?.community?.posts.map(post => ({
    id: post.id,
    username: '社区用户',
    avatar: 'i-carbon:user',
    text: post.content,
    images: post.img ? [post.img] : [],
    timestamp: '刚刚',
    location: '厦门市 · 同安区',
    likes: Math.floor(Math.random() * 20) + 5,
    comments: post.comments,
    shares: post.shares,
  })) ?? []
}
</script>

<template>
  <div>
    <!-- 头部警报栏 -->
    <div v-if="alert" class="alert-header" :class="getHeaderClass(alert.level)">
      <div class="alert-icon">
        <div class="i-carbon:warning-alt" />
      </div>
      <span class="warning">警报: {{ alert.name }}</span>
      <RouterLink to="/info/record" class="alert-icon" >
        <div class="i-carbon:camera" />
      </RouterLink>
    </div>

    <!-- 当没有警报时显示默认头部 -->
    <div v-else class="alert-header blue">
      <div class="alert-left">
        <i class="alert-icon">ℹ</i>
        <span class="alert-text">社区信息</span>
      </div>
      <span class="menu-dots">⋯</span>
    </div>

    <!-- 社区帖子列表 -->
    <div class="post-container">
      <div
        v-for="post in getCommunityPosts()"
        :key="post.id"
        class="post-item"
      >
        <div class="post-header">
          <div class="user-info">
            <div class="user-avatar">
              <span :class="post.avatar">{{ post.avatar }}</span>
            </div>

            <div class="user-details">
              <div class="username">
                {{ post.username }}
              </div>
              <div class="post-meta">
                <span class="timestamp">{{ post.timestamp }}</span>
                <span class="location">{{ post.location }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="post-content">
          <p class="post-text">
            {{ post.text }}
          </p>
          <div v-if="post.images && post.images.length > 0" class="post-images">
            <ExtendedImage
              v-for="(image, index) in post.images"
              :key="index"
              :src="image"
              :alt="`图片${index + 1}`"
              class="post-image"
            />
          </div>
        </div>

        <div class="post-actions">
          <button class="action-btn">
            <i class="i-carbon:thumbs-up" />
            <span class="action-text">{{ post.likes }}</span>
          </button>
          <button class="action-btn">
            <i class="i-carbon:chat" />
            <span class="action-text">{{ post.comments }}</span>
          </button>
          <button class="action-btn">
            <i class="i-carbon:share" />
            <span class="action-text">{{ post.shares }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 社区tab样式 */
.community-tab {
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 社区头部 */
.community-header {
  background: #d32f2f;
  position: sticky;
  padding-left: 12px;
  padding-right: 12px;
  top: 0;
  z-index: 10;
  height: 40px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.header-title {
  color: white;
  font-size: 18px;
  font-weight: 600;
  flex-grow: 1;
}

.camera-btn {
  color: white;
  font-size: 20px;
  cursor: pointer;
}

/* 帖子容器 */
.posts-container {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

/* 帖子项目 */
.post-item {
  background: white;
  margin-bottom: 8px;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

/* 帖子头部 */
.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #333;
}

.user-details {
  flex: 1;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.post-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.timestamp {
  color: #999;
}

.location {
  color: #666;
}

.post-actions {
  margin-left: 8px;
}

.action-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* 帖子内容 */
.post-content {
  margin-bottom: 12px;
  padding-left: 48px;
}

.post-text {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  margin-bottom: 12px;
}

/* 图片展示 */
.post-images {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}

.post-images.single-image .image-container {
  width: 100%;
  max-width: 300px;
}

.post-images.multiple-images {
  flex-wrap: wrap;
}

.image-container {
  flex: 1;
  min-width: 0;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
}

.image-container.single {
  width: 100%;
  max-width: 300px;
}

.image-container.double {
  flex: 1;
  min-width: calc(50% - 2px);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 12px;
}

.image-text {
  text-align: center;
}

/* 交互按钮 */
.post-interactions {
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.interaction-buttons {
  display: flex;
  gap: 16px;
}

.interaction-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.interaction-btn:hover {
  background: #f5f5f5;
}

.interaction-icon {
  font-size: 14px;
}

.interaction-count {
  font-size: 12px;
  color: #666;
}

/* 警报头部 */
.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  color: white;
  font-size: 14px;
}

.alert-header.red {
  background: #d32f2f;
}

.alert-header.orange {
  background: #f57c00;
}

.alert-header.blue {
  background: #1976d2;
}
</style>
