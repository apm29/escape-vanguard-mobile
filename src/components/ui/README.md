# UI 组件库

基于 radix-vue 构建的可自定义UI组件库。

## 组件

### Dropdown.vue

主要的下拉菜单容器组件。

### DropdownItem.vue

下拉菜单项组件，支持多种类型。

### Modal.vue

模态框组件，支持多种配置选项。

### Checkbox.vue

复选框组件，支持多种样式变体和尺寸。

## Dropdown 组件

### 使用方法

#### 基础用法

```vue
<script setup>
import Button from '@/components/ui/Button.vue'
import Dropdown from '@/components/ui/Dropdown.vue'
import DropdownItem from '@/components/ui/DropdownItem.vue'

function handleSelect(event) {
  console.log('选中了:', event)
}
</script>

<template>
  <Dropdown>
    <template #trigger>
      <Button variant="outline">
        点击打开菜单
        <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </Button>
    </template>

    <DropdownItem @select="handleSelect">
      菜单项 1
    </DropdownItem>
    <DropdownItem @select="handleSelect">
      菜单项 2
    </DropdownItem>
    <DropdownItem separator />
    <DropdownItem @select="handleSelect">
      菜单项 3
    </DropdownItem>
  </Dropdown>
</template>
```

### Dropdown Props

| 属性           | 类型                                     | 默认值     | 说明                   |
| -------------- | ---------------------------------------- | ---------- | ---------------------- |
| `disabled`     | `boolean`                                | `false`    | 是否禁用dropdown       |
| `onOpenChange` | `(open: boolean) => void`                | -          | dropdown打开时的回调   |
| `defaultOpen`  | `boolean`                                | `false`    | 是否默认打开           |
| `open`         | `boolean`                                | -          | 是否受控模式           |
| `side`         | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | dropdown内容的位置     |
| `align`        | `'start' \| 'center' \| 'end'`           | `'center'` | dropdown内容的对齐方式 |
| `showArrow`    | `boolean`                                | `false`    | 是否显示箭头           |

### Dropdown Events

| 事件          | 参数               | 说明               |
| ------------- | ------------------ | ------------------ |
| `update:open` | `(value: boolean)` | 打开状态变化时触发 |

### DropdownItem Props

| 属性         | 类型                     | 默认值  | 说明           |
| ------------ | ------------------------ | ------- | -------------- |
| `disabled`   | `boolean`                | `false` | 是否禁用       |
| `onSelect`   | `(event: Event) => void` | -       | 点击时的回调   |
| `separator`  | `boolean`                | `false` | 是否为分隔符   |
| `label`      | `boolean`                | `false` | 是否为标签     |
| `group`      | `boolean`                | `false` | 是否为分组     |
| `checkbox`   | `boolean`                | `false` | 是否为复选框项 |
| `checked`    | `boolean`                | `false` | 复选框是否选中 |
| `radioGroup` | `boolean`                | `false` | 是否为单选框组 |
| `value`      | `string`                 | -       | 单选框的值     |
| `sub`        | `boolean`                | `false` | 是否为子菜单   |
| `subTrigger` | `boolean`                | `false` | 子菜单的触发器 |
| `subContent` | `boolean`                | `false` | 子菜单的内容   |

### DropdownItem Events

| 事件             | 参数               | 说明                 |
| ---------------- | ------------------ | -------------------- |
| `update:checked` | `(value: boolean)` | 复选框状态变化时触发 |
| `select`         | `(event: Event)`   | 选中时触发           |

## Modal 组件

### 使用方法

#### 基础用法

```vue
<script setup>
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
</script>

<template>
  <Modal title="基础模态框" description="这是一个基础的模态框示例">
    <template #trigger>
      <Button variant="outline">
        打开模态框
      </Button>
    </template>

    <div class="space-y-4">
      <p>这是模态框的内容区域。您可以在这里放置任何内容。</p>
      <div class="flex justify-end space-x-2">
        <Button variant="outline">
          取消
        </Button>
        <Button>确认</Button>
      </div>
    </div>
  </Modal>
</template>
```

#### 受控模式

```vue
<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <Modal
    v-model:open="isOpen"
    title="受控模态框"
    description="这是一个受控的模态框"
  >
    <template #trigger>
      <div />
    </template>

    <div class="space-y-4">
      <p>当前状态: {{ isOpen ? '打开' : '关闭' }}</p>
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
</template>
```

### Modal Props

| 属性                  | 类型                                     | 默认值  | 说明                       |
| --------------------- | ---------------------------------------- | ------- | -------------------------- |
| `title`               | `string`                                 | `''`    | 模态框标题                 |
| `description`         | `string`                                 | `''`    | 模态框描述                 |
| `open`                | `boolean`                                | -       | 是否显示模态框             |
| `defaultOpen`         | `boolean`                                | `false` | 是否默认打开               |
| `onOpenChange`        | `(open: boolean) => void`                | -       | 模态框打开时的回调         |
| `disabled`            | `boolean`                                | `false` | 是否禁用                   |
| `size`                | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'`  | 模态框大小                 |
| `showCloseButton`     | `boolean`                                | `true`  | 是否显示关闭按钮           |
| `closeOnOverlayClick` | `boolean`                                | `true`  | 是否可以通过点击遮罩层关闭 |
| `closeOnEscape`       | `boolean`                                | `true`  | 是否可以通过按ESC键关闭    |

### Modal Events

| 事件          | 参数               | 说明               |
| ------------- | ------------------ | ------------------ |
| `update:open` | `(value: boolean)` | 打开状态变化时触发 |

### Modal 高级用法

#### 不同尺寸

```vue
<Modal title="小尺寸模态框" size="sm">
  <template #trigger>
    <Button variant="outline">小尺寸</Button>
  </template>
  <p>这是一个小尺寸的模态框。</p>
</Modal>

<Modal title="大尺寸模态框" size="lg">
  <template #trigger>
    <Button variant="outline">大尺寸</Button>
  </template>
  <p>这是一个大尺寸的模态框。</p>
</Modal>
```

#### 自定义行为

```vue
<!-- 无关闭按钮 -->
<Modal title="无关闭按钮" :show-close-button="false">
  <template #trigger>
    <Button variant="outline">无关闭按钮</Button>
  </template>
  <div class="space-y-4">
    <p>这个模态框没有关闭按钮。</p>
    <div class="flex justify-end">
      <Button>关闭</Button>
    </div>
  </div>
</Modal>

<!-- 不可点击遮罩层关闭 -->
<Modal title="不可点击遮罩层关闭" :close-on-overlay-click="false">
  <template #trigger>
    <Button variant="outline">不可点击遮罩层</Button>
  </template>
  <p>这个模态框不能通过点击遮罩层关闭。</p>
</Modal>
```

#### 确认对话框

```vue
<Modal title="确认删除" description="此操作不可撤销，请确认是否继续" size="sm">
  <template #trigger>
    <Button variant="destructive">删除项目</Button>
  </template>

  <div class="space-y-4">
    <p class="text-sm text-muted-foreground">
      您即将删除这个项目。此操作不可撤销，所有相关数据将被永久删除。
    </p>
    <div class="flex justify-end space-x-2">
      <Button variant="outline">取消</Button>
      <Button variant="destructive">确认删除</Button>
    </div>
  </div>
</Modal>
```

## Checkbox 组件

### 使用方法

#### 基础用法

```vue
<script setup>
import { ref } from 'vue'
import Checkbox from '@/components/ui/Checkbox.vue'

const checked = ref(false)

function handleChange(value) {
  console.log('复选框状态变化:', value)
}
</script>

<template>
  <Checkbox v-model="checked" @change="handleChange">
    我同意服务条款
  </Checkbox>
</template>
```

#### 不同尺寸

```vue
<template>
  <div class="space-y-2">
    <Checkbox v-model="checked" size="sm">
      小尺寸
    </Checkbox>
    <Checkbox v-model="checked" size="default">
      默认尺寸
    </Checkbox>
    <Checkbox v-model="checked" size="lg">
      大尺寸
    </Checkbox>
  </div>
</template>
```

#### 不同变体

```vue
<template>
  <div class="space-y-2">
    <Checkbox v-model="checked" variant="default">
      默认样式
    </Checkbox>
    <Checkbox v-model="checked" variant="primary">
      主要样式
    </Checkbox>
    <Checkbox v-model="checked" variant="success">
      成功样式
    </Checkbox>
    <Checkbox v-model="checked" variant="warning">
      警告样式
    </Checkbox>
    <Checkbox v-model="checked" variant="error">
      错误样式
    </Checkbox>
  </div>
</template>
```

#### 禁用状态

```vue
<template>
  <div class="space-y-2">
    <Checkbox v-model="checked" disabled>
      禁用未选中
    </Checkbox>
    <Checkbox v-model="checked" disabled>
      禁用已选中
    </Checkbox>
  </div>
</template>
```

#### 不确定状态

```vue
<template>
  <Checkbox v-model="checked" :indeterminate="true">
    不确定状态
  </Checkbox>
</template>
```

### Checkbox Props

| 属性            | 类型                                                          | 默认值      | 说明               |
| --------------- | ------------------------------------------------------------- | ----------- | ------------------ |
| `modelValue`    | `boolean`                                                     | `false`     | 复选框的选中状态   |
| `disabled`      | `boolean`                                                     | `false`     | 是否禁用复选框     |
| `size`          | `'sm' \| 'default' \| 'lg'`                                   | `'default'` | 复选框的尺寸       |
| `variant`       | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error'` | `'default'` | 复选框的样式变体   |
| `indeterminate` | `boolean`                                                     | `false`     | 是否为不确定状态   |
| `name`          | `string`                                                      | -           | 表单字段名称       |
| `id`            | `string`                                                      | -           | 复选框的唯一标识符 |

### Checkbox Events

| 事件                | 参数               | 说明                 |
| ------------------- | ------------------ | -------------------- |
| `update:modelValue` | `(value: boolean)` | 选中状态变化时触发   |
| `change`            | `(value: boolean)` | 状态变化时的回调函数 |

### Checkbox 特性

1. **无障碍支持**: 支持键盘导航（Enter 和 Space 键）
2. **语义化**: 使用正确的 ARIA 属性
3. **响应式**: 支持触摸和鼠标交互
4. **可定制**: 支持多种尺寸和样式变体
5. **表单集成**: 支持 v-model 双向绑定

## 样式定制

组件使用了 Tailwind CSS 类名，您可以通过以下方式自定义样式：

1. 修改组件中的 class 属性
2. 使用 CSS 变量覆盖默认样式
3. 使用 Tailwind CSS 的 `@apply` 指令

## 注意事项

1. 确保已安装 `radix-vue` 依赖
2. Dropdown 触发器必须使用 `#trigger` 插槽
3. Modal 触发器必须使用 `#trigger` 插槽
4. 子菜单需要正确的嵌套结构
5. 复选框和单选框需要正确的状态管理
6. Modal 组件会自动处理焦点管理和无障碍功能
