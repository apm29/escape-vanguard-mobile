<script setup lang="ts">
import { ref } from 'vue'
import Button from './Button.vue'
import Modal from './Modal.vue'

const isOpen = ref(false)
const isOpen2 = ref(false)
const isOpen3 = ref(false)
const isOpen4 = ref(false)

function handleOpenChange(open: boolean) {
  console.log('Modal状态变化:', open)
}

function handleConfirm() {
  console.log('确认操作')
  isOpen.value = false
}

function handleCancel() {
  console.log('取消操作')
  isOpen.value = false
}
</script>

<template>
  <div class="p-8 space-y-8">
    <h2 class="text-2xl font-bold">
      Modal 组件示例
    </h2>

    <!-- 基础用法 -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">
        基础用法
      </h3>
      <Modal title="基础模态框" description="这是一个基础的模态框示例">
        <template #trigger>
          <Button variant="outline">
            打开基础模态框
          </Button>
        </template>

        <div class="space-y-4">
          <p>这是模态框的内容区域。您可以在这里放置任何内容。</p>
          <div class="flex justify-end space-x-2">
            <Button variant="outline" @click="isOpen = false">
              取消
            </Button>
            <Button @click="isOpen = false">
              确认
            </Button>
          </div>
        </div>
      </Modal>
    </div>

    <!-- 受控模式 -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">
        受控模式
      </h3>
      <div class="space-x-2">
        <Button variant="outline" @click="isOpen = true">
          打开受控模态框
        </Button>
        <Button variant="outline" @click="isOpen = false">
          关闭受控模态框
        </Button>
      </div>

      <Modal
        v-model:open="isOpen"
        title="受控模态框"
        description="这是一个受控的模态框，可以通过外部状态控制"
        size="sm"
        @open-change="handleOpenChange"
      >
        <template #trigger>
          <div />
        </template>

        <div class="space-y-4">
          <p>当前状态: {{ isOpen ? '打开' : '关闭' }}</p>
          <p>这个模态框的状态由父组件控制。</p>
          <div class="flex justify-end space-x-2">
            <Button variant="outline" @click="handleCancel">
              取消
            </Button>
            <Button @click="handleConfirm">
              确认
            </Button>
          </div>
        </div>
      </Modal>
    </div>

    <!-- 不同尺寸 -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">
        不同尺寸
      </h3>
      <div class="flex flex-wrap gap-2">
        <Modal title="小尺寸模态框" size="sm">
          <template #trigger>
            <Button variant="outline" size="sm">
              小尺寸
            </Button>
          </template>
          <p>这是一个小尺寸的模态框。</p>
        </Modal>

        <Modal title="中等尺寸模态框" size="md">
          <template #trigger>
            <Button variant="outline" size="sm">
              中等尺寸
            </Button>
          </template>
          <p>这是一个中等尺寸的模态框。</p>
        </Modal>

        <Modal title="大尺寸模态框" size="lg">
          <template #trigger>
            <Button variant="outline" size="sm">
              大尺寸
            </Button>
          </template>
          <p>这是一个大尺寸的模态框。</p>
        </Modal>

        <Modal title="超大尺寸模态框" size="xl">
          <template #trigger>
            <Button variant="outline" size="sm">
              超大尺寸
            </Button>
          </template>
          <p>这是一个超大尺寸的模态框。</p>
        </Modal>

        <Modal title="全屏模态框" size="full">
          <template #trigger>
            <Button variant="outline" size="sm">
              全屏
            </Button>
          </template>
          <p>这是一个全屏的模态框。</p>
        </Modal>
      </div>
    </div>

    <!-- 自定义行为 -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">
        自定义行为
      </h3>
      <div class="flex flex-wrap gap-2">
        <!-- 无关闭按钮 -->
        <Modal title="无关闭按钮" :show-close-button="false">
          <template #trigger>
            <Button variant="outline">
              无关闭按钮
            </Button>
          </template>
          <div class="space-y-4">
            <p>这个模态框没有关闭按钮，只能通过内容区域的按钮关闭。</p>
            <div class="flex justify-end">
              <Button @click="isOpen2 = false">
                关闭
              </Button>
            </div>
          </div>
        </Modal>

        <!-- 不可点击遮罩层关闭 -->
        <Modal title="不可点击遮罩层关闭" :close-on-overlay-click="false">
          <template #trigger>
            <Button variant="outline">
              不可点击遮罩层
            </Button>
          </template>
          <div class="space-y-4">
            <p>这个模态框不能通过点击遮罩层关闭。</p>
            <div class="flex justify-end space-x-2">
              <Button variant="outline" @click="isOpen3 = false">
                取消
              </Button>
              <Button @click="isOpen3 = false">
                确认
              </Button>
            </div>
          </div>
        </Modal>

        <!-- 不可按ESC关闭 -->
        <Modal title="不可按ESC关闭" :close-on-escape="false">
          <template #trigger>
            <Button variant="outline">
              不可按ESC
            </Button>
          </template>
          <div class="space-y-4">
            <p>这个模态框不能通过按ESC键关闭。</p>
            <div class="flex justify-end space-x-2">
              <Button variant="outline" @click="isOpen4 = false">
                取消
              </Button>
              <Button @click="isOpen4 = false">
                确认
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>

    <!-- 复杂内容 -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">
        复杂内容
      </h3>
      <Modal title="用户信息" description="查看和编辑用户详细信息" size="lg">
        <template #trigger>
          <Button variant="outline">
            查看用户信息
          </Button>
        </template>

        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1 block text-sm font-medium">姓名</label>
              <input
                type="text"
                class="border-input focus:ring-ring w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2"
                placeholder="请输入姓名"
              >
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium">邮箱</label>
              <input
                type="email"
                class="border-input focus:ring-ring w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2"
                placeholder="请输入邮箱"
              >
            </div>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium">地址</label>
            <textarea
              class="border-input focus:ring-ring w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2"
              rows="3"
              placeholder="请输入地址"
            />
          </div>

          <div class="flex items-center space-x-2">
            <input id="newsletter" type="checkbox" class="rounded">
            <label for="newsletter" class="text-sm">订阅新闻通讯</label>
          </div>

          <div class="flex justify-end space-x-2">
            <Button variant="outline">
              取消
            </Button>
            <Button>保存</Button>
          </div>
        </div>
      </Modal>
    </div>

    <!-- 确认对话框 -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">
        确认对话框
      </h3>
      <Modal title="确认删除" description="此操作不可撤销，请确认是否继续" size="sm">
        <template #trigger>
          <Button variant="destructive">
            删除项目
          </Button>
        </template>

        <div class="space-y-4">
          <p class="text-muted-foreground text-sm">
            您即将删除这个项目。此操作不可撤销，所有相关数据将被永久删除。
          </p>
          <div class="flex justify-end space-x-2">
            <Button variant="outline">
              取消
            </Button>
            <Button variant="destructive">
              确认删除
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  </div>
</template>
