<script setup lang="ts">
import { ref } from 'vue'
import Checkbox from './Checkbox.vue'

// 基础用法
const checked1 = ref(false)
const checked2 = ref(true)

// 不同尺寸
const checked3 = ref(false)
const checked4 = ref(false)
const checked5 = ref(false)

// 不同变体
const checked6 = ref(false)
const checked7 = ref(false)
const checked8 = ref(false)
const checked9 = ref(false)

// 禁用状态
const checked10 = ref(false)
const checked11 = ref(true)

// 不确定状态
const checked12 = ref(false)

// 表单示例
const formData = ref({
  terms: false,
  newsletter: true,
  notifications: false,
})

function handleFormChange() {
  console.log('表单数据变化:', formData.value)
}
</script>

<template>
  <div class="p-6 space-y-8">
    <div>
      <h2 class="mb-4 text-2xl font-bold">
        Checkbox 组件示例
      </h2>

      <!-- 基础用法 -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">
          基础用法
        </h3>
        <div class="space-y-2">
          <Checkbox v-model="checked1">
            我同意服务条款
          </Checkbox>
          <Checkbox v-model="checked2">
            我已阅读隐私政策
          </Checkbox>
        </div>
      </div>

      <!-- 不同尺寸 -->
      <div class="mt-6 space-y-4">
        <h3 class="text-lg font-semibold">
          不同尺寸
        </h3>
        <div class="space-y-2">
          <Checkbox v-model="checked3" size="sm">
            小尺寸
          </Checkbox>
          <Checkbox v-model="checked4" size="default">
            默认尺寸
          </Checkbox>
          <Checkbox v-model="checked5" size="lg">
            大尺寸
          </Checkbox>
        </div>
      </div>

      <!-- 不同变体 -->
      <div class="mt-6 space-y-4">
        <h3 class="text-lg font-semibold">
          不同变体
        </h3>
        <div class="space-y-2">
          <Checkbox v-model="checked6" variant="default">
            默认样式
          </Checkbox>
          <Checkbox v-model="checked7" variant="primary">
            主要样式
          </Checkbox>
          <Checkbox v-model="checked8" variant="success">
            成功样式
          </Checkbox>
          <Checkbox v-model="checked9" variant="warning">
            警告样式
          </Checkbox>
        </div>
      </div>

      <!-- 禁用状态 -->
      <div class="mt-6 space-y-4">
        <h3 class="text-lg font-semibold">
          禁用状态
        </h3>
        <div class="space-y-2">
          <Checkbox v-model="checked10" disabled>
            禁用未选中
          </Checkbox>
          <Checkbox v-model="checked11" disabled>
            禁用已选中
          </Checkbox>
        </div>
      </div>

      <!-- 不确定状态 -->
      <div class="mt-6 space-y-4">
        <h3 class="text-lg font-semibold">
          不确定状态
        </h3>
        <div class="space-y-2">
          <Checkbox v-model="checked12" :indeterminate="true">
            不确定状态
          </Checkbox>
        </div>
      </div>

      <!-- 表单示例 -->
      <div class="mt-6 space-y-4">
        <h3 class="text-lg font-semibold">
          表单示例
        </h3>
        <div class="space-y-2">
          <Checkbox v-model="formData.terms" @change="handleFormChange">
            我同意服务条款和隐私政策
          </Checkbox>
          <Checkbox v-model="formData.newsletter" @change="handleFormChange">
            订阅我们的新闻通讯
          </Checkbox>
          <Checkbox v-model="formData.notifications" @change="handleFormChange">
            接收推送通知
          </Checkbox>
        </div>
        <div class="mt-4 rounded bg-gray-100 p-4">
          <p class="text-sm text-gray-600">
            表单数据:
          </p>
          <pre class="mt-2 text-xs">{{ JSON.stringify(formData, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
