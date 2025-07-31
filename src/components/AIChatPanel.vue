<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

interface Message {
  type: 'user' | 'ai'
  content: string
  time: string
}

const props = defineProps<{
  isVisible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const messagesRef = ref<HTMLElement>()
const isListening = ref(false)
const messages = ref<Message[]>([
  {
    type: 'ai',
    content: '您好！我是紧急救援AI助手，在洪水灾害期间为您提供帮助。请告诉我您当前的情况和位置，我会协助您找到安全的庇护所。',
    time: '14:30',
  },
  {
    type: 'user',
    content: '我家被洪水淹了，现在很危险，需要紧急帮助',
    time: '14:31',
  },
  {
    type: 'ai',
    content: '我理解您的紧急情况。请保持冷静，告诉我您当前的具体位置。我已经为您找到了附近的安全庇护所：1. 市体育馆（距离2公里）2. 社区中心（距离1.5公里）。您现在是否安全？',
    time: '14:31',
  },
])

function close() {
  emit('close')
}

function toggleListening() {
  isListening.value = !isListening.value

  if (isListening.value) {
    // 模拟语音识别
    setTimeout(() => {
      isListening.value = false
      addUserMessage('我想查询一下附近的餐厅')
    }, 2000)
  }
}

function addUserMessage(content: string) {
  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

  messages.value.push({
    type: 'user',
    content,
    time,
  })

  // 模拟AI回复
  setTimeout(() => {
    const aiResponses = [
      '我已经为您联系了救援队，预计15分钟内到达。请尽量往高处移动，远离水域。',
      '根据您的位置，最近的紧急庇护所在XX社区中心，距离您800米，有救援人员待命。',
      '救援直升机正在前往您的位置，请保持手机信号畅通，我们会持续跟踪您的情况。',
    ]
    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]

    const aiTime = new Date()
    const aiTimeStr = `${aiTime.getHours().toString().padStart(2, '0')}:${aiTime.getMinutes().toString().padStart(2, '0')}`

    messages.value.push({
      type: 'ai',
      content: randomResponse,
      time: aiTimeStr,
    })

    scrollToBottom()
  }, 1000)
}

function sendTextMessage() {
  addUserMessage('我需要紧急救援，水位还在上涨')
}

async function scrollToBottom() {
  await nextTick()
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

watch(() => props.isVisible, (visible) => {
  if (visible) {
    scrollToBottom()
  }
})
</script>

<template>
  <Transition name="slide-up">
    <div v-if="isVisible" class="ai-chat-modal" @click="close">
      <div class="ai-chat-panel" @click.stop>
        <div class="ai-chat-header">
          <div class="ai-chat-title">
            <div class="ai-avatar">
              <i class="i-carbon:ibm-consulting-advantage-assistant" />
            </div>
            <div class="ai-info">
              <h3>AI助手</h3>
              <p>{{ isListening ? '正在聆听...' : '点击麦克风开始对话' }}</p>
            </div>
          </div>
          <button class="close-button" @click="close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        <div ref="messagesRef" class="ai-chat-messages">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="message" :class="[message.type]"
          >
            <div v-if="message.type === 'ai'" class="message-avatar">
              <i class="i-carbon:ibm-consulting-advantage-assistant" />
            </div>
            <div class="message-content">
              <p>{{ message.content }}</p>
              <span class="message-time">{{ message.time }}</span>
            </div>
          </div>
        </div>

        <div class="ai-chat-input">
          <div class="voice-button-container">
            <button
              class="voice-button" :class="[{ listening: isListening }]"
              @click="toggleListening"
            >
              <svg v-if="!isListening" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div v-else class="listening-animation">
                <div class="wave" />
                <div class="wave" />
                <div class="wave" />
              </div>
            </button>
          </div>
          <div class="input-actions">
            <button class="action-button" @click="sendTextMessage">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.ai-chat-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.ai-chat-panel {
  position: relative;
  width: 100%;
  height: 70vh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.ai-chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.ai-chat-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.ai-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.ai-info p {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #666;
}

.close-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.2);
  color: #333;
}

.ai-chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 80%;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.message-content {
  background: #f0f0f0;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
}

.message.user .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message-content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  display: block;
}

.message.user .message-time {
  color: rgba(255, 255, 255, 0.8);
}

.ai-chat-input {
  padding: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
}

.voice-button-container {
  flex: 1;
  display: flex;
  justify-content: center;
}

.voice-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.voice-button:hover {
  transform: scale(1.05);
}

.voice-button.listening {
  background: #ff4757;
  animation: pulse 1.5s infinite;
}

.listening-animation {
  display: flex;
  align-items: center;
  gap: 2px;
}

.wave {
  width: 3px;
  height: 20px;
  background: white;
  border-radius: 2px;
  animation: wave 1s infinite ease-in-out;
}

.wave:nth-child(2) {
  animation-delay: 0.1s;
}

.wave:nth-child(3) {
  animation-delay: 0.2s;
}

.input-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:hover {
  background: rgba(0, 0, 0, 0.2);
  color: #333;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 71, 87, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 71, 87, 0);
  }
}

@keyframes wave {
  0%,
  100% {
    height: 20px;
  }
  50% {
    height: 30px;
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
