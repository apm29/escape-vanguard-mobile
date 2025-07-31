<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAlertStore } from '~/stores/alert'

const router = useRouter()
const alertStore = useAlertStore()

// 响应式数据
const postContent = ref('')
const selectedImages = ref<string[]>([])
const fileInput = ref<HTMLInputElement>()

// 计算属性
const canPublish = computed(() => {
  return postContent.value.trim().length > 0 || selectedImages.value.length > 0
})

// 方法
function handleInput() {
  if (postContent.value.length > 500) {
    postContent.value = postContent.value.slice(0, 500)
  }
}

function selectImages() {
  fileInput.value?.click()
}

function handleImageSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (files) {
    const remainingSlots = 9 - selectedImages.value.length
    const filesToProcess = Array.from(files).slice(0, remainingSlots)

    filesToProcess.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          selectedImages.value.push(result)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  target.value = ''
}

function removeImage(index: number) {
  selectedImages.value.splice(index, 1)
}

async function goBack() {
  router.back()
}

async function handlePublish() {
  try {
    const newPost = {
      title: postContent.value.slice(0, 20) + (postContent.value.length > 20 ? '...' : ''),
      img: selectedImages.value[0],
      content: postContent.value,
    }

    await alertStore.addPostToCommunity(newPost)
    router.push('/alert/community')
  }
  catch (error) {
    console.error('发布失败:', error)
  }
}
</script>

<template>
  <div class="record-page">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-left">
        <button class="cancel-btn" @click="goBack">
          取消
        </button>
      </div>
      <div class="header-title">
        发布动态
      </div>
      <div class="header-right">
        <button
          class="publish-btn"
          :class="{ 'publish-btn-active': canPublish }"
          :disabled="!canPublish"
          @click="handlePublish"
        >
          发布
        </button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="content">
      <!-- 文本输入区域 -->
      <div class="text-input-area">
        <textarea
          v-model="postContent"
          class="content-textarea"
          placeholder="填写你的上报内容..."
          :maxlength="500"
          @input="handleInput"
        />
        <div class="char-count">
          {{ postContent.length }}/500
        </div>
      </div>

      <!-- 图片上传区域 -->
      <div class="image-upload-area">
        <div class="image-grid">
          <div
            v-for="(image, index) in selectedImages"
            :key="index"
            class="image-item"
          >
            <img :src="image" class="uploaded-image">
            <button class="remove-image-btn" @click="removeImage(index)">
              ×
            </button>
          </div>

          <div
            v-if="selectedImages.length < 9"
            class="image-upload-btn"
            @click="selectImages"
          >
            <div class="upload-icon">
              +
            </div>
            <div class="upload-text">
              添加图片
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInput"
      type="file"
      multiple
      accept="image/*"
      class="hidden-input"
      @change="handleImageSelect"
    >
  </div>
</template>

<style scoped>
.record-page {
  min-height: 100vh;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left,
.header-right {
  flex: 1;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.cancel-btn {
  background: none;
  border: none;
  color: #007aff;
  font-size: 16px;
  cursor: pointer;
  padding: 8px;
}

.publish-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 16px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  float: right;
}

.publish-btn-active {
  color: #007aff;
  font-weight: 600;
}

.content {
  flex: 1;
  background-color: #fff;
  margin-top: 8px;
}

.text-input-area {
  padding: 16px;
  position: relative;
}

.content-textarea {
  width: 100%;
  min-height: 120px;
  border: none;
  outline: none;
  font-size: 16px;
  line-height: 1.5;
  resize: none;
  font-family: inherit;
}

.char-count {
  position: absolute;
  bottom: 8px;
  right: 16px;
  font-size: 12px;
  color: #999;
}

.image-upload-area {
  padding: 0 16px 16px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-upload-btn {
  aspect-ratio: 1;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #fafafa;
}

.upload-icon {
  font-size: 24px;
  color: #999;
  margin-bottom: 4px;
}

.upload-text {
  font-size: 12px;
  color: #999;
}

.location-section {
  border-top: 1px solid #e5e5e5;
  padding: 16px;
}

.location-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 0;
}

.location-icon {
  font-size: 16px;
  margin-right: 8px;
}

.location-text {
  flex: 1;
  font-size: 16px;
  color: #333;
}

.location-arrow {
  color: #999;
  font-size: 14px;
}

.hidden-input {
  display: none;
}
</style>
