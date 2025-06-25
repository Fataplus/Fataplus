<template>
  <div class="bg-white rounded-xl shadow-lg border border-gray-200 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <span class="text-2xl">🇲🇬</span>
          </div>
          <div>
            <h2 class="text-xl font-bold">Assistant Agriculture Madagascar</h2>
            <p class="text-green-100 text-sm">Mpanolo-tsaina fambolena ho an'ny Malagasy</p>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm text-green-100">Powered by NuxtHub AI</div>
          <div class="text-xs text-green-200">AutoRAG • {{ currentMonth }}</div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="p-4 bg-gray-50 border-b">
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="action in quickActions"
          :key="action.label"
          @click="handleQuickAction(action)"
          class="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg border hover:bg-green-50 hover:border-green-200 transition-colors text-sm"
        >
          <span>{{ action.icon }}</span>
          <span>{{ action.label }}</span>
        </button>
      </div>
    </div>

    <!-- Chat Messages -->
    <div class="h-96 overflow-y-auto p-4 space-y-4" ref="chatContainer">
      <!-- Welcome Message -->
      <div v-if="messages.length === 0" class="text-center py-8">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl">🌾</span>
        </div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Tongasoa!</h3>
        <p class="text-gray-600 mb-4">Manontania ahy momba ny fambolena malagasy</p>
      </div>

      <!-- Chat Messages -->
      <div v-for="(message, index) in messages" :key="index" class="flex" :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
        <!-- User Message -->
        <div v-if="message.role === 'user'" class="max-w-xs lg:max-w-md">
          <div class="bg-green-600 text-white rounded-lg px-4 py-2">
            {{ message.content }}
          </div>
        </div>

        <!-- Assistant Message -->
        <div v-else class="max-w-xs lg:max-w-md">
          <div class="flex items-start space-x-2">
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-sm">🤖</span>
            </div>
            <div class="flex-1">
              <div class="bg-gray-100 rounded-lg px-4 py-2">
                <div>{{ message.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="isLoading" class="flex justify-start">
        <div class="flex items-start space-x-2">
          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span class="text-sm">🤖</span>
          </div>
          <div class="bg-gray-100 rounded-lg px-4 py-2">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-green-600 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-green-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-4 border-t">
      <form @submit.prevent="handleSubmit" class="flex space-x-3">
        <input
          v-model="currentMessage"
          :disabled="isLoading"
          placeholder="Manontania momba ny fambolena..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          :disabled="isLoading || !currentMessage.trim()"
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          Alefa
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface QuickAction {
  label: string
  icon: string
  message: string
}

// Reactive state
const messages = ref<ChatMessage[]>([])
const currentMessage = ref('')
const isLoading = ref(false)
const chatContainer = ref<HTMLElement>()

// Quick actions
const quickActions: QuickAction[] = [
  { label: 'Calendrier', icon: '📅', message: 'Quel est le calendrier agricole de ce mois ?' },
  { label: 'Riz', icon: '🌾', message: 'Comment cultiver le riz à Madagascar ?' },
  { label: 'Vanille', icon: '🌸', message: 'Techniques pollinisation vanille SAVA' },
  { label: 'Météo', icon: '🌤️', message: 'Risques climatiques actuels Madagascar' },
  { label: 'Urgences', icon: '⚠️', message: 'Tâches agricoles urgentes maintenant' }
]

// Current month
const currentMonth = computed(() => {
  return new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
})

// Methods
const handleQuickAction = (action: QuickAction) => {
  sendMessage(action.message)
}

const sendMessage = async (content: string) => {
  if (!content.trim() || isLoading.value) return

  currentMessage.value = ''
  isLoading.value = true

  // Add user message
  const userMessage: ChatMessage = {
    role: 'user',
    content: content.trim(),
    timestamp: new Date()
  }
  messages.value.push(userMessage)

  await scrollToBottom()

  try {
    // Call AI API
    const response = await $fetch('/api/ai/chat', {
      method: 'POST',
      body: {
        message: content.trim(),
        history: messages.value.slice(-10)
      }
    })

    // Add assistant response
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: response.response,
      timestamp: new Date()
    }
    messages.value.push(assistantMessage)

  } catch (error) {
    console.error('AI Chat Error:', error)
    
    // Fallback response
    const errorMessage: ChatMessage = {
      role: 'assistant',
      content: "Miala tsiny, misy olana teknika izaho. Manandrama indray azafady.",
      timestamp: new Date()
    }
    messages.value.push(errorMessage)
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

const handleSubmit = () => {
  sendMessage(currentMessage.value)
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 